import { useContext } from "react";
import RecipeDetailsContext from "../../../../contexts/RecipeDetailsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';


const RatingSummary = () => {

  const {avgRating, numRatings} = useContext(RecipeDetailsContext)

  return (
    <>
          Avg: {avgRating} <FontAwesomeIcon
            icon={ icon({name: 'star'}) } 
            style={{color: "#ffd200", height: "15px"}}
          />           ({numRatings})

    </>
  )

}

export default RatingSummary;