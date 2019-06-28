import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { formatTotalSecondsAsMMSS } from '../../utils/formatters';

import Card, { CardBody } from '../../components/Card';

import { trackActions } from '../../redux';

class TrackViewPage extends Component {
  componentDidMount() {
    const { trackState, trackActions, match } = this.props;
    const { id } = match.params;

    if (trackState.doc == null || id !== trackState.doc._id) {
      trackActions.findOne(id);
    }
  }

  render() {
    let artistsHtml = [];
    const { match, trackState } = this.props;
    const { url } = match;
    let lastUpdated = '';
    if (trackState.doc != null) {
      for (var i = 0; i < trackState.doc.artists.length; i++) {
        let artist = trackState.doc.artists[i];
        if (i > 0) {
          artistsHtml.push(<span>, </span>);
        }
        artistsHtml.push(
          <a href={'/library/artist/' + artist._id}>{artist.name}</a>,
        );
      }
      let lastUpdatedDateObj = new Date(trackState.doc.updated_at);
      lastUpdated =
        lastUpdatedDateObj.toLocaleDateString() +
        ' ' +
        lastUpdatedDateObj.toLocaleTimeString();
    }

    return (
      <div className="track-view-page">
        {!trackState.loading && trackState.doc != null && (
          <div>
            <Card>
              <CardBody>
                <div className="float-right">Last updated: {lastUpdated}</div>
                <Link className="track-edit-button-wrapper" to={`${url}/edit`}>
                  <div className="track-edit-button">
                    Edit <i className="fas fa-edit" />
                  </div>
                </Link>
                <h1 className="mb-0">{trackState.doc.name}</h1>
                <div>
                  {' '}
                  by <span>{artistsHtml}</span>
                </div>
                <div>
                  Track duration:{' '}
                  {formatTotalSecondsAsMMSS(trackState.doc.duration_in_seconds)}
                </div>
                <div>
                  from the album{' '}
                  <a href={'/library/album/' + trackState.doc.album._id}>
                    {trackState.doc.album.name}
                  </a>
                </div>
                <div>Disk number: {trackState.doc.disk_number}</div>
                <div>Track number: {trackState.doc.track_number}</div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    trackState: state.track,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    trackActions: bindActionCreators({ ...trackActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackViewPage);
