import React from 'react';
import PropTypes from 'prop-types';
import './Alert.css'; 

const Alert = ({ variant, children }) => {
  return (
    <div className={`alert alert-${variant}`}>
      {children}
    </div>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info']),
  children: PropTypes.node.isRequired,
};

Alert.defaultProps = {
  variant: 'info',
};

export const AlertTitle = ({ children }) => {
  return <h4 className="alert-title">{children}</h4>;
};

AlertTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AlertDescription = ({ children }) => {
  return <p className="alert-description">{children}</p>;
};

AlertDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Alert;
