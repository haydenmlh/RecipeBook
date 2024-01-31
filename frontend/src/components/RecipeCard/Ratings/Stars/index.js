import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';


const Stars = ({ rating, numRatings }) => {
  
  const FirstStar = () => {
      if (rating >= 0.75) {
        return <FontAwesomeIcon icon={icon({name: 'star'})} style={{color: "#ffd200"}} />
      } else if (rating >= 0.25) {
        return <FontAwesomeIcon icon={icon({name: 'star-half-stroke'})} style={{color: "#ffd200"}} />
      } else {
        return <FontAwesomeIcon icon={icon({name: 'star', style: 'regular'})} style={{color: "#ffd200"}} />
      }
  }

  const SecondStar = () => {
    if (rating >= 1.75) {
      return <FontAwesomeIcon icon={icon({name: 'star'})} style={{color: "#ffd200"}} />
    } else if (rating >= 1.25) {
      return <FontAwesomeIcon icon={icon({name: 'star-half-stroke'})} style={{color: "#ffd200"}} />
    } else {
      return <FontAwesomeIcon icon={icon({name: 'star', style: 'regular'})} style={{color: "#ffd200"}} />
    }
  }

  const ThirdStar = () => {
    if (rating >= 2.75) {
      return <FontAwesomeIcon icon={icon({name: 'star'})} style={{color: "#ffd200"}} />
    } else if (rating >= 2.25) {
      return <FontAwesomeIcon icon={icon({name: 'star-half-stroke'})} style={{color: "#ffd200"}} />
    } else {
      return <FontAwesomeIcon icon={icon({name: 'star', style: 'regular'})} style={{color: "#ffd200"}} />
    }
  }

  const FourthStar = () => {
    if (rating >= 3.75) {
      return <FontAwesomeIcon icon={icon({name: 'star'})} style={{color: "#ffd200"}} />
    } else if (rating >= 3.25) {
      return <FontAwesomeIcon icon={icon({name: 'star-half-stroke'})} style={{color: "#ffd200"}} />
    } else {
      return <FontAwesomeIcon icon={icon({name: 'star', style: 'regular'})} style={{color: "#ffd200"}} />
    }
  }

  const FifthStar = () => {
    if (rating >= 4.75) {
      return <FontAwesomeIcon icon={icon({name: 'star'})} style={{color: "#ffd200"}} />
    } else if (rating >= 4.25) {
      return <FontAwesomeIcon icon={icon({name: 'star-half-stroke'})} style={{color: "#ffd200"}} />
    } else {
      return <FontAwesomeIcon icon={icon({name: 'star', style: 'regular'})} style={{color: "#ffd200"}} />
    }
  }

  if (rating > 1) {
    return (
      <>
      <div>
        <FirstStar />
        <SecondStar />
        <ThirdStar />
        <FourthStar />
        <FifthStar />
      </div>
      </>
    )
  } else {
    return (
      <>
      <div>
      </div>
      </>
    );
  }
  
}

export default Stars;