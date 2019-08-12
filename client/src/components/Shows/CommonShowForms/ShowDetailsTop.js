import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, change } from 'redux-form';
import { DatePicker__React } from '../../DatePicker';
import Input from '../../Input';
import { requiredValidate } from '../../../utils/validation';

class ShowDetailsTop extends Component {
  render() {
    const { props } = this;
    const { date, change, formSelectorName, allowRepeatSelect } = props;
    change(formSelectorName, 'repeat_start_date', date);
    return (
      <>
        <Field
          className="grid-span--2"
          component={Input}
          label="Title"
          name="show_details.title"
          type="text"
          validate={[requiredValidate]}
        />

        <Field
          className="z-index--250"
          component={DatePicker__React}
          label="From"
          name="start_time_utc"
          type="time"
          validate={[requiredValidate]}
          dateFormat="MM/dd/yyyy h:mm aa"
          showTimeInput
        />

        <Field
          className="z-index--250"
          component={DatePicker__React}
          label="To"
          name="end_time_utc"
          validate={[requiredValidate]}
          dateFormat="MM/dd/yyyy h:mm aa"
          showTimeInput
        />

        {allowRepeatSelect && (
          <Field
            component={Input}
            dirtyOverride
            label="Repeat"
            name="is_recurring"
            type="checkbox"
          />
        )}
      </>
    );
  }
}

export default connect(
  null,
  { change },
)(ShowDetailsTop);
