import React from 'react';
import evaluateExpressions from '@solid/react';

/** Displays the value of a Solid LDflex expression. */
export evaluateExpressions("user", function User({
  pending, error, src, children, props
}) {
  // Render pending state
  if (pending)
    return children || <span className="solid value pending"/>;
  // Render error state
  if (error)
    return children || <span className="solid value error" data-error={error.message}/>;
  // Render empty value
  if (src === undefined || src === null)
    return children || <span className="solid value empty"/>;
  // Render stringified value
  this.props.setUser(src);
  return null
});