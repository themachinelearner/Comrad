import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { requiredValidate } from '../../../utils/validation';
import { albumActions } from '../../../redux';
import { artistActions } from '../../../redux';

import Button from '../../Button';
import Input from '../../Input';

class FormAlbumAdd extends Component {
  submit = values => {
    const { albumActions, artistActions, history } = this.props;
    return albumActions.add(values, albumData => {
      artistActions.clear();
      history.push(`/library/artist/${albumData.artist}`);
    });
  };

  render() {
    const { props, submit } = this;
    const { handleSubmit } = props;

    return (
      <form
        className="form-album-add"
        onSubmit={handleSubmit(data => {
          submit({
            ...data,
          });
        })}
      >
        <Field
          component={Input}
          label="Name"
          name="name"
          autoFocus
          validate={requiredValidate}
        />
        <Field
          component={Input}
          label="Label"
          name="label"
          autoFocus
          validate={requiredValidate}
        />
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    );
  }
}

const ReduxFormAlbumAdd = reduxForm({
  form: 'albumAdd',
})(FormAlbumAdd);

function mapStateToProps(state) {
  return {
    initialValues: {
      artist: state.artist.doc._id,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    albumActions: bindActionCreators({ ...albumActions }, dispatch),
    artistActions: bindActionCreators({ ...artistActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxFormAlbumAdd);
