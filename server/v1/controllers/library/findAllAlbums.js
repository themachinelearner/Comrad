const db = require('../../models');
const keys = require('../../config/keys');

async function findAllByAlbums(req, res) {
  let { sortBy, sortDescending, page } = req.query;

  //set defaults for variables & cast variables to correct data type
  sortBy = sortBy || 'updated_at';
  sortDescending = sortDescending || true;
  page = page != null ? Number(page) : 0;

  let sortObj = {};
  sortObj[sortBy] = sortDescending ? -1 : 1;

  //query 100 items of Artist type from the mongo database
  const results = await db.Album.find({}, null, {
    sort: sortObj,
    skip: page * keys.queryPageSize,
    limit: keys.queryPageSize,
  });

  //estimate the total number of pages
  const docs = await db.Album.estimatedDocumentCount();
  const totalPages = Math.ceil(docs / keys.queryPageSize);
  let resultsJson = {
    results: results,
    totalPages: totalPages,
  };

  if (page < totalPages) {
    //generate a URL that will be used to display the next page of results
    page++;
    resultsJson.nextPage = {
      page: page,
      url:
        '/v1/library/artists?page=' +
        page +
        '&sortBy=' +
        sortBy +
        '&sortDescending=' +
        (sortDescending ? '1' : '0'),
    };
  }

  return res.json(resultsJson);
}

module.exports = findAllByAlbums;
