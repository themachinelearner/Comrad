import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { requiredValidate } from '../../utils/validation';
import { trackAdd } from '../../redux/track';
import Button from '../Button';
import Input from '../Input';

class FormTrackAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  submit = (values, dispatch, props) => {
    const tracks = this.props.tracks;
    const { trackAdd } = this.props;
    for (var key in tracks) {
      if (parseInt(tracks[key].disk_number) === parseInt(values.disk_number)) {
        if (
          parseInt(tracks[key].track_number) === parseInt(values.track_number)
        ) {
          return console.log('error'); // handle error when disk and track numbers match those of existing track
        }
      }
    }

    return trackAdd(values);
  };

  render() {
    const { props, submit } = this;
    const { handleSubmit } = props;

    return (
      <form
        className="form-track-add"
        onSubmit={handleSubmit(data => {
          const duration_in_seconds =
            parseInt(data.seconds) + parseInt(data.minutes) * 60;
          submit({
            ...data,
            duration_in_seconds: duration_in_seconds,
          });
        })}
      >
        <Field
          component={Input}
          label="Disk Number"
          name="disk_number"
          type="number"
          autoFocus
          validate={requiredValidate}
        />
        <Field
          component={Input}
          label="Track Number"
          name="track_number"
          type="number"
          autoFocus
          validate={requiredValidate}
        />
        <Field
          component={Input}
          label="Name"
          name="name"
          autoFocus
          validate={requiredValidate}
        />
        <div className="duration-container">
          <div className="duration-label-container">
            <div className="duration-label">Duration:</div>
          </div>
          <Field
            component={Input}
            name="minutes"
            className="minutes"
            type="number"
            placeholder="00"
            autoFocus
            validate={requiredValidate}
          />
          <div className="duration-colon">:</div>
          <Field
            component={Input}
            name="seconds"
            className="seconds"
            type="number"
            placeholder="00"
            autoFocus
            validate={requiredValidate}
          />
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    initialValues: {
      album: ownProps.albumId,
      artists: [ownProps.artistId],
      disk_number: ownProps.maxDiskNumber,
      track_number: ownProps.maxTrackNumber + 1,
    },
  };
}

const ReduxFormTrackAdd = reduxForm({
  form: 'trackAdd',
})(FormTrackAdd);

export default connect(
  mapStateToProps,
  { trackAdd },
)(ReduxFormTrackAdd);
