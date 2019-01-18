import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { inputClear, inputUpdate } from '../../actions/index';
import validation from '../../utils/validation';

import Feedback from '../Feedback';
import Label from '../Label';
import { ReactComponent as SearchSolid } from '../../images/search-solid.svg';

class Input extends Component {
  state = {};

  myRef = React.createRef();

  componentDidUpdate() {
    const { current } = this.myRef;
    this.toggleActiveClass(current);
  }

  componentWillUnmount() {
    const { name, inputClear } = this.props;
    inputClear(name);
  }

  toggleActiveClass(current) {
    const { classList, value } = current;
    if (value.length > 0) {
      return classList.add('active');
    }

    return classList.remove('active');
  }

  handleInputChange = e => {
    const { inputUpdate, validate, action } = this.props;
    const { classList, name, value } = e.target;

    if (validate) {
      const valid = validation.input(validate, value);
      valid ? classList.remove('invalid') : classList.add('invalid');
    }
    if (action) {
      console.log(action);
      //action({ [name]: value });
    } else {
      inputUpdate({ [name]: value });
    }
  };

  handleBlurChange = e => {
    const { classList, value } = e.target;
    const { validate } = this.props;

    if (validate) {
      const valid = validation.input(validate, value);
      valid ? classList.remove('invalid') : classList.add('invalid');
    }
  };

  getIconClass(icon) {
    switch (icon) {
      case 'search':
        return <SearchSolid className="icon" />;
      default:
        break;
    }
  }

  render() {
    const { getIconClass, myRef, props } = this;

    const { feedback, icon, label, name, type, className, validate } = props;

    return (
      <div className={classnames('form-group', className)}>
        <input
          ref={myRef}
          className="input"
          name={name}
          type={type}
          validate={validate}
          onBlur={this.handleBlurChange}
          onChange={this.handleInputChange}
        />
        {label && <Label>{label}</Label>}
        {feedback && <Feedback>{feedback}</Feedback>}
        {icon && getIconClass(icon)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    input: state.input,
  };
}

export default connect(
  mapStateToProps,
  { inputClear, inputUpdate },
)(Input);
