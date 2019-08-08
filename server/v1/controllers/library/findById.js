const db = require('../../models');

async function findById(req, res) {
  const dbLibrary = await db.Library.findById(req.params.id).populate([
    'artist',
    'artists',
    'album',
  ]);

  if (!dbLibrary) {
    res.status(422).json('Library object does not exist');
  }

  let data = {
    ...dbLibrary._doc,
  };

  // find additional data, depending on the entity type

  if (dbLibrary.type === 'album') {
    const dbTracks = await db.Library.find({ album: dbLibrary._id });
    data.tracks = dbTracks;
  } else if (dbLibrary.type === 'artist') {
    const dbAlbums = await db.Album.find(
      { artist: dbLibrary._id },
      {},
      { sort: 'name' },
    );
    data.albums = await Promise.all(
      dbAlbums.map(async album => {
        const numberOfTracks = await db.Track.countDocuments({
          album: album._id,
        });
        let modifiedAlbum = {
          ...album._doc,
          number_of_tracks: numberOfTracks,
        };
        return modifiedAlbum;
      }),
    );
  }

  res.status(200).json(data);
}

module.exports = findById;
