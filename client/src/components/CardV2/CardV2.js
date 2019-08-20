import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import CardBody from './CardBodyV2';

function Card({ backgroundColor, children, className }) {
  return <div className={classnames('card', className)}>{children}</div>;
}

Card.defaultProps = {
  background: '#fff',
};

Card.Body = CardBody;

export default Card;
