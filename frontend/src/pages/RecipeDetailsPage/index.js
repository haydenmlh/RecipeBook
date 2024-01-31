import { useSearchParams } from "react-router-dom";
import './style.css';
import RecipeDetailContent from "../../components/RecipeDetailContent";
import RecipeDetailsContext, { useRecipeDetailsContext } from "../../contexts/RecipeDetailsContext";

const RecipeDetails = (props) => {
  let [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  return (
    <>
      <div id="main-content">
        {id}
        <RecipeDetailsContext.Provider value={useRecipeDetailsContext()}>
          <RecipeDetailContent />
        </RecipeDetailsContext.Provider>
      </div>
    </>
  )
} 


export default RecipeDetails;