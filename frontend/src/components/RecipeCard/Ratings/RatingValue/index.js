import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';


const Rating = ({rating}) => {
  if (rating > 1) {
    return rating;
  } else {
    return;
  }

}

export default Rating;