import React from 'react';

const DownloadLink = ({ downloadUrl }) => {
  return (
    <p>
      Download URL:{' '}
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
        Download File
      </a>
    </p>
  );
};

export default DownloadLink;
