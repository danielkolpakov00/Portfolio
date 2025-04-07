import React from 'react';
import PropTypes from 'prop-types';
import RelayedCursor from './RelayedCursor';
import IframeCursorContainer from './IframeCursorContainer';

/**
 * IframeWithRelayCursor - A complete solution for iframe cursor relay
 * 
 * This component combines RelayedCursor with IframeCursorContainer to provide
 * a seamless cursor experience that works across iframe boundaries.
 */
const IframeWithRelayCursor = ({
  src,
  title,
  className = '',
  style = {},
  cursorConfig = {},
  ...iframeProps
}) => {
  // Default cursor configuration
  const defaultCursorConfig = {
    innerColor: '#ff2d00',
    outerColor: '#ff2d00',
    innerSize: 8,
    outerSize: 35,
    outerAlpha: 0.3,
    innerScale: 1.2,
    outerScale: 1.4,
    enableTooltips: true,
    debugMode: false
  };

  // Merge default configuration with user-provided configuration
  const mergedCursorConfig = {
    ...defaultCursorConfig,
    ...cursorConfig
  };

  return (
    <>
      {/* The RelayedCursor component that handles cursor interactions */}
      <RelayedCursor {...mergedCursorConfig} />
      
      {/* The container that wraps the iframe and provides the relay functionality */}
      <IframeCursorContainer
        src={src}
        title={title}
        className={className}
        style={style}
        {...iframeProps}
      />
    </>
  );
};

IframeWithRelayCursor.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  cursorConfig: PropTypes.shape({
    innerColor: PropTypes.string,
    outerColor: PropTypes.string,
    innerSize: PropTypes.number,
    outerSize: PropTypes.number,
    outerAlpha: PropTypes.number,
    innerScale: PropTypes.number,
    outerScale: PropTypes.number,
    enableTooltips: PropTypes.bool,
    debugMode: PropTypes.bool
  })
};

export default IframeWithRelayCursor;