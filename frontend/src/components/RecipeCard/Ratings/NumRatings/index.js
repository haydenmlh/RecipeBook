import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';


const NumRatings = ({ numRatings }) => {
  if (numRatings >= 1) {
    return (
      <div>({numRatings})</div>
    );
  } else {
    return "No Ratings";
  }

}

export default NumRatings;