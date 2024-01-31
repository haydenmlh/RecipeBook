import { useContext } from "react";
import RecipeDetailsContext from "../../../contexts/RecipeDetailsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Stars from "../../RecipeCard/Ratings/Stars";
import StarsWithHover from "./StarsWithHover";
import { Link, useSearchParams } from "react-router-dom";
import RatingSummary from "./RatingSummary";
import LikesRecipeDetail from "./LikesRecipeDetail";
import FavoriteRecipeDetail from "./FavoriteRecipeDetail";


const RecipeDetailTitle = () => {
  

  const { cuisine, name, setRecipeId, baseRecipeId, baseRecipeName, recipeImages, diets } = useContext(RecipeDetailsContext);

  return(
    <>
    <div class="text-center">
      <div class="cuisine">{cuisine} Cuisine</div>
      <div class="recipe-title">{name}</div>

      <div class="diet-container">
        
            {diets.map((val, idx) => {
              return (
                <div class="diet-pill badge vegan">
                  <FontAwesomeIcon 
                  icon={icon({name: 'leaf'})} 
                  style={{color: "black"}} 
                  />
                  <div class="diet-text">{val[1]}</div>
                </div>
            )})}

      </div>

      <div class="rating-container">
        <StarsWithHover height="27px" />
        <RatingSummary style={{paddingTop: "12px"}}/>
      </div>

      <div class="time-container">
        <div class="time-icon">
          <i class="fa fa-clock-o fa-2x"></i>
        </div>
        
        <div class="time-block">
          <div>Prep Time</div>
          <div>20 mins</div>
        </div>
        <div class="time-block">
          <div>Cook Time</div>
          <div>20 mins</div>
        </div>
      </div>

      {(baseRecipeName)
        ?<div class="base-recipe-container text-center">
            <div class="base-recipe-label" style={{fontFamily: "Courgette, cursive", color: "#5c3802"}}>Base recipe</div>
            <Link to={`/recipe-details?id=${baseRecipeId}`}>{baseRecipeName}</Link>
          </div>
        : <></>
      }
      

        <div class="abs-btn-container">
          
          <FavoriteRecipeDetail />

          <LikesRecipeDetail />
                
          
        </div>
              

        {recipeImages.map((url, index) => {
          let last = url.split(".")[url.split(".").length - 1]
          if (['jpg', 'png', 'gif'].includes(last.toLowerCase())) {
            return (<img key={index} src={url} height="400px"/>)
          } else {
            return (<video key={index} width="320" height="240" controls>
                      <source src={url} />
                        Your browser does not support the video tag.
                    </video>)
          }
        })}

      </div>
    </>
)};

export default RecipeDetailTitle;