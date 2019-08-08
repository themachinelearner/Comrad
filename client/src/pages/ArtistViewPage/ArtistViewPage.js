import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { Link } from 'react-router-dom';

import Card, { CardBody } from '../../components/Card';
import Loading from '../../components/Loading';
import FormArtistUpdateName from '../../components/forms/FormArtistUpdateName';
import LargeText from '../../components/LargeText';
import TableArtistAlbums from '../../components/tables/TableArtistAlbums';

import { libraryActions } from '../../redux';

class ArtistViewPage extends Component {
  componentDidMount() {
    const { library, libraryActions, match } = this.props;
    const { _id } = library.doc;
    const { id } = match.params;

    if (id !== _id) {
      libraryActions.findOne(id);
    }
  }

  navigateToAlbum = (state, rowInfo, column, instance) => {
    return {
      onClick: (e, handleOriginal) => {
        //navigate to the view page for this album
        this.props.history.push('/library/album/' + rowInfo.original._id);
      },
    };
  };

  render() {
    const { navigateToAlbum, props } = this;
    const { match, library } = props;
    const { doc, loading } = library;
    const { albums, updated_at } = doc;
    const dateObj = new Date(updated_at);
    const lastUpdated = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
    const { url } = this.props.match;

    return (
      <div className="artist-view">
        {loading && <Loading />}
        {!loading ? (
          <>
            <Card>
              <CardBody>
                <div className="float-right">Last updated: {lastUpdated}</div>
                <FormArtistUpdateName match={match} />
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="mb-1">Albums</h2>
                <Link className="add-album-button" to={`${url}/add`}>
                  Add Album
                </Link>
                {isEmpty(albums) ? (
                  <LargeText align="left">No Albums</LargeText>
                ) : (
                  <TableArtistAlbums onRowClick={navigateToAlbum} />
                )}
              </CardBody>
            </Card>
          </>
        ) : null}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    libraryActions: bindActionCreators({ ...libraryActions }, dispatch),
  };
}

function mapStateToProps({ library }) {
  return {
    library,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArtistViewPage);
