import React, { useEffect } from 'react';

/**
 * A component that wraps children and ensures they take up the full width of the screen
 * This component adds a class to the body when mounted and removes it when unmounted
 */
const FullWidthWrapper = ({ children, className }) => {
  useEffect(() => {
    // Add the full-width-view class to the body when component mounts
    document.body.classList.add('full-width-view');
    
    // Return a cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('full-width-view');
    };
  }, []);

  return (
    <div className={`route-view ${className || ''}`}>
      {children}
    </div>
  );
};

export default FullWidthWrapper;