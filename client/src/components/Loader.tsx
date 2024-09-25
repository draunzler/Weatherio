import React from 'react';

const Loader: React.FC = () => {
  return (
    <div style={styles.loaderContainer}>
      <img src="/310.gif" alt="Loading..." style={styles.loaderImage} />
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%"
  },
  loaderImage: {
    width: '50px',
  },
};

export default Loader;