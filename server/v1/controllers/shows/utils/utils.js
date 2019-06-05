const moment = require('moment');
const { RRule } = require('rrule');
const _ = require('lodash');
const db = require('../../../models');

const {
  master_time_id,
  master_time_id__byShowType,
} = require('./utils__mongoose');

async function showList(shows, startDate = null, endDate = null) {
  //Filter all shows that are series
  const allSeriesShows = reduceShowsByRepeatProperty(shows, true);

  const allSeriesShowsExpanded = allSeriesShows.map(show => {
    const allShowDates = returnDatesArrayByRepeatRule(show, startDate, endDate);
    const allSeriesShowsExpandedByDates = returnSeriesShowsArrayWithNewDates(
      allShowDates,
      show,
    );

    return allSeriesShowsExpandedByDates;
  });

  //Filter all shows that are instances
  const allInstanceShows = reduceShowsByRepeatProperty(shows, false);
  const allInstanceShowsExpanded = returnInstanceShowsArray(allInstanceShows);

  //Replace repeat shows with instance shows here
  const seriesFlattened = _.flatten(allSeriesShowsExpanded);
  const seriesKeyBy = _.keyBy(seriesFlattened, '_id');

  const instanceKeyBy = _.keyBy(await allInstanceShowsExpanded, o => {
    return o.master_time_id;
  });

  //console.log(instanceKeyBy);
  //Combined series and instance shows by object ID and then return the final array
  return { ...seriesKeyBy, ...instanceKeyBy };
}

function createRRule(show, queryStartDate, queryEndDate) {
  const {
    frequency,
    repeat_start_date,
    repeat_end_date,
    interval,
    count,
    byweekday,
    bymonth,
    bysetpos,
    bymonthday,
  } = show.repeat_rule;

  const { show_start_time_utc, show_end_time_utc } = show;

  let newRRule = {};

  if (frequency) {
    newRRule.freq = frequency;
  }

  //Format RRULE start date by UTC Time
  const qsd = combineDayAndTime(queryStartDate, show_start_time_utc);
  const rsd = combineDayAndTime(repeat_start_date, show_start_time_utc);

  if (rsd.isAfter(qsd)) {
    newRRule.dtstart = new Date(rsd.format());
  } else {
    newRRule.dtstart = new Date(qsd.format());
  }

  //Format RRULE end date by UTC Time
  const qed = combineDayAndTime(
    queryEndDate,
    show_end_time_utc,
    'MOMENT',
    'END',
  );
  const red = combineDayAndTime(
    repeat_end_date,
    show_end_time_utc,
    'MOMENT',
    'END',
  );

  if (red.isBefore(qed)) {
    newRRule.until = new Date(red.format());
  } else {
    newRRule.until = new Date(qed.format());
  }

  if (count) {
    newRRule.count = count;
  }

  if (interval) {
    newRRule.interval = interval;
  }

  if (byweekday) {
    newRRule.byweekday = byweekday.map(day => {
      return RRule[day];
    });
  }

  if (bymonth) {
    newRRule.bymonth = [bymonth];
  }

  if (bysetpos) {
    newRRule.bysetpos = [bysetpos];
  }

  if (bymonthday) {
    newRRule.bymonthday = [bymonthday];
  }

  return newRRule;
}

function reduceShowsByRepeatProperty(shows, recurringCheckValue) {
  const reducer = (accShows, currentShow) => {
    if (
      currentShow.is_recurring === recurringCheckValue ||
      (currentShow.is_recurring === undefined && recurringCheckValue === false)
    ) {
      return [...accShows, currentShow];
    }
    return accShows;
  };

  const reducedShowList = shows.reduce(reducer, []);

  return reducedShowList;
}

function returnDatesArrayByRepeatRule(show, startDate = null, endDate = null) {
  const { is_recurring } = show;

  if (is_recurring) {
    const rule = new RRule(createRRule(show, startDate, endDate));
    try {
      return rule.all();
    } catch (e) {
      console.log('Error in returnDatesArrayByRepeatRule');
      console.log(e);
      return null;
    }
  }
}

function combineDayAndTime(
  desiredDate,
  desiredTime,
  format = 'MOMENT',
  type = 'START',
) {
  //https://stackoverflow.com/questions/21918095/moment-js-how-to-detect-daylight-savings-time-and-add-one-day
  //Need to detect and handle DST, days are offset by 1 day in november/march.
  let hours = moment(desiredTime).hours();
  let minutes = moment(desiredTime).minutes();

  if (type === 'END' && hours === 0 && minutes === 0) {
    /**
     * If a show happens at midnight,
     * and the hours are applied to the current day,
     * the day moves back by 1, so just set hours manually
     *  */
    hours = 23;
    minutes = 59;
  }

  const returnedValue = moment(desiredDate)
    .hours(hours)
    .minutes(minutes)
    .seconds(0)
    .utc();

  if (format === 'MOMENT') {
    return returnedValue;
  } else if (format === 'STRING') {
    return returnedValue.format();
  } else {
    console.error('Date string format does not exist in case check');
    return null;
  }
}

function returnSeriesShowsArrayWithNewDates(dateArray, show) {
  const returnedShows = dateArray.map((date, i) => {
    let newShow = { ...show.toObject() };
    let { show_start_time_utc, show_end_time_utc } = show;

    show_start_time_utc = combineDayAndTime(
      date,
      show_start_time_utc,
      'STRING',
    );

    show_end_time_utc = combineDayAndTime(
      date,
      show_end_time_utc,
      'STRING',
      'END',
    );

    newShow.master_show_uid = newShow._id;
    newShow._id = master_time_id(newShow.master_show_uid, show_start_time_utc);
    newShow.master_time_id = newShow._id;
    newShow.show_start_time_utc = show_start_time_utc;
    newShow.show_end_time_utc = show_end_time_utc;
    return newShow;
  });
  return returnedShows;
}

function getShowTitles(shows) {
  const promises = shows.map(async show => {
    show = { ...show.toObject() };
    if (!show.show_details.title) {
      let masterShow = db.Show.findById(show.master_show_uid);
      let promise = await masterShow;
      //let title = await masterShow.show_details.title;
      return promise;
    }
  });
  return Promise.all(promises);
}

function keyTitleById(acc, title) {
  if (title) {
    return { ...acc, [title.id]: title.title };
  }
  return acc;
}

const returnInstanceShowsArray = async shows => {
  let titles = await getShowTitles(shows);
  titles = titles.map(show => {
    if (show) {
      const id = show._id;
      const title = show.show_details.title;
      return { id, title };
    }
  });

  titles = titles.reduce(keyTitleById, {});

  const allInstances = shows.map(show => {
    let instanceShow = { ...show.toObject() };
    let { title } = instanceShow.show_details;
    if (!title) {
      const { master_show_uid } = instanceShow;
      title = titles[master_show_uid];
    }
    const date = instanceShow.show_start_time_utc;

    //Update properties of the instance show
    instanceShow.show_start_time_utc = combineDayAndTime(
      date,
      instanceShow.show_start_time_utc,
      'STRING',
    );
    instanceShow.show_end_time_utc = combineDayAndTime(
      date,
      instanceShow.show_end_time_utc,
      'STRING',
      'END',
    );

    instanceShow.show_details.title = title + ' (Show List - Instance Version)';
    instanceShow.master_time_id = master_time_id__byShowType(instanceShow);

    return instanceShow;
  });
  return allInstances;
};

module.exports = {
  showList,
};
