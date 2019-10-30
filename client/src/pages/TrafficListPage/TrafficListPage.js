import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { trafficActions } from '../../redux';
import {
  clearShows,
  errorShowsMessage,
  fetchingShowsStatus,
  getShowsData,
  searchShow,
} from '../../redux/show';
import Card, { CardBody } from '../../components/Card';
import Checkbox from '../../components/Checkbox';
import DatePicker from '../../components/DatePicker';
import Loading from '../../components/Loading';

class TrafficListPage extends Component {
  state = {
    filterByType: [
      'Announcement',
      'Feature',
      'Giveaway',
      'Legal ID',
      'PSA',
      'Underwriting',
    ],
    searchDate: moment().startOf('day'),
  };

  componentDidMount = () => {
    this.updateListData();
  };

  componentWillUnmount() {
    const { trafficActions, clearShows } = this.props;
    trafficActions.clear();
    clearShows();
  }

  handleDateChange = newDate => {
    const { trafficActions, clearShows } = this.props;

    trafficActions.clear();
    clearShows();

    this.setState(
      {
        searchDate: moment(newDate).startOf('day'),
      },
      function() {
        this.updateListData();
      },
    );
  };

  toggleFilter = trafficType => {
    let { filterByType } = this.state;
    let newFilterByType = filterByType.slice(); // make a copy of the array
    if (filterByType.indexOf(trafficType) !== -1) {
      newFilterByType.splice(newFilterByType.indexOf(trafficType), 1);
    } else {
      newFilterByType.push(trafficType);
    }
    this.setState(
      {
        filterByType: newFilterByType,
      },
      function() {
        this.updateListData();
      },
    );
  };

  updateListData = () => {
    const { trafficActions, searchShow } = this.props;
    const { filterByType, searchDate } = this.state;

    const nextDay = searchDate.clone();
    nextDay.add(1, 'day');

    trafficActions.find(searchDate.format(), nextDay.format(), filterByType);
    searchShow(searchDate, nextDay);
  };

  render() {
    const { traffic, showsFetching, shows } = this.props;
    const { searchDate } = this.state;

    let listElements = [];
    if (shows !== null && traffic.docs !== null) {
      let trafficIndex = 0;
      let currentTrafficObject =
        trafficIndex < traffic.docs.length ? traffic.docs[trafficIndex] : null;
      Object.keys(shows).forEach(function(s) {
        let showObject = shows[s];
        let startTime = moment(showObject.start_time_utc);
        let endTime = moment(showObject.end_time_utc);
        let startTimeFormatted = startTime.format('LT');
        let endTimeFormatted = endTime.format('LT');
        listElements.push(
          <div className="traffic-list__show" key={'show-' + s}>
            <h2>{showObject.show_details.title}</h2>
            <h5>
              {startTimeFormatted} - {endTimeFormatted}
            </h5>
          </div>,
        );

        while (
          currentTrafficObject != null &&
          currentTrafficObject.start_time_utc < showObject.end_time_utc
        ) {
          listElements.push(
            <div
              className={classnames(
                'traffic-list__traffic',
                'traffic-list__traffic--' +
                  currentTrafficObject.traffic_details.type
                    .replace(/ /g, '-')
                    .toLowerCase(),
              )}
              key={'traffic-' + trafficIndex}
            >
              {moment(currentTrafficObject.start_time_utc).format('h:mm a')}
              <span>&nbsp;-&nbsp;</span>
              <Link to={'/traffic/' + currentTrafficObject.master_time_id}>
                {currentTrafficObject.traffic_details.title}
              </Link>
            </div>,
          );
          trafficIndex++;
          currentTrafficObject =
            trafficIndex < traffic.docs.length
              ? traffic.docs[trafficIndex]
              : null;
        }
      });
    }

    let dateInput = {
      name: 'date',
      onChange: this.handleDateChange,
      value: searchDate,
    };

    return (
      <div className="traffic-list">
        <Card>
          <CardBody>
            <h1>Traffic List</h1>
            <Link className="traffic-add-button" to="/traffic/add">
              <div className="traffic-add-button__text">Add</div>
              <i className="fas fa-plus" />
            </Link>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="traffic-list__date-selector">
              <DatePicker label="Date" input={dateInput} />
            </div>
            <div>
              Show: <br />
              <Checkbox
                id="announcement"
                initialChecked={true}
                className="checkbox--inline"
                onChange={() => this.toggleFilter('Announcement')}
              />{' '}
              Announcement <br />
              <Checkbox
                id="feature"
                initialChecked={true}
                className="checkbox--inline"
                onChange={() => this.toggleFilter('Feature')}
              />{' '}
              Feature <br />
              <Checkbox
                id="giveaway"
                initialChecked={true}
                className="checkbox--inline"
                onChange={() => this.toggleFilter('Giveaway')}
              />{' '}
              Giveaway <br />
              <Checkbox
                id="legal-id"
                initialChecked={true}
                className="checkbox--inline"
                onChange={() => this.toggleFilter('Legal ID')}
              />{' '}
              Legal ID <br />
              <Checkbox
                id="psa"
                initialChecked={true}
                className="checkbox--inline"
                onChange={() => this.toggleFilter('PSA')}
              />{' '}
              PSA <br />
              <Checkbox
                id="underwriting"
                initialChecked={true}
                className="checkbox--inline"
                onChange={() => this.toggleFilter('Underwriting')}
              />{' '}
              Underwriting
            </div>
            {!showsFetching && !traffic.loading && (
              <div className="traffic-list__events">{listElements}</div>
            )}
            {(showsFetching || traffic.loading) && (
              <Loading displayMode="static" />
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

function mapStateToProps({ show, traffic }) {
  return {
    shows: getShowsData(show),
    showsError: errorShowsMessage(show),
    showsFetching: fetchingShowsStatus(show),
    traffic,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearShows: bindActionCreators(clearShows, dispatch),
    searchShow: bindActionCreators(searchShow, dispatch),
    trafficActions: bindActionCreators({ ...trafficActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrafficListPage);
