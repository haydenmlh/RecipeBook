import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import RecipeDetailTitle from "./RecipeDetailTitle";
import RecipeDetailsContext from "../../contexts/RecipeDetailsContext";

const RecipeDetailContent = () => {
  let [searchParams] = useSearchParams();

  const { cuisine, 
          setRecipeId, 
          setCuisine, 
          setName, 
          setAvgRating, 
          setNumRatings,
          setNumLikes, 
          setBaseRecipeId,
          setBaseRecipeName,
          setRecipeImages,
          setDiets,
          setIngredients,
          setServings,
          setPrepSteps,
          setCookSteps,
          ingredients,
          servings,
          prepSteps,
          cookSteps,
        } = useContext(RecipeDetailsContext)


  useEffect(() => {
    let accessToken = localStorage.getItem('access-token');
    // const headers_obj = {
    //   headers: {
    //     "Authorization" : `Bearer ${accessToken}`
    //   }
    // }
    const url = `http://127.0.0.1:8000/recipes/long-details/${searchParams.get("id")}/`;
    
    fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      setRecipeId(json.id);
      setCuisine(json.cuisine_name);
      setName(json.name);
      setAvgRating(json.avg_rating);
      setNumRatings(json.num_ratings);
      setNumLikes(json.num_likes);
      setBaseRecipeId(json.base_recipe);
      setBaseRecipeName(json.base_recipe_name);
      setRecipeImages(json.recipe_images);
      setDiets(json.diets_detailed);
      setIngredients(json.ingredients)
      setServings(json.servings)
      setPrepSteps(json.prep_steps)
      setCookSteps(json.cook_steps)
    })
    .catch((e) => console.log(e))
  }, []);



  return (
    <>
      
      <RecipeDetailTitle />

        <div class="section-title">
            Ingredients
        </div>
        <div class="divider"></div>

        <div class="section-content">
            <div class="servings-container">
                <div class="serving-title">
                    Servings: 
                </div>
                <button class="btn minus-btn">
                  <FontAwesomeIcon 
                    icon={icon({name: 'minus'})} 
                    style={{color: "white"}} 
                  />
                </button>
                <div class="serving">
                    {servings}
                </div>
                <button class="btn plus-btn">
                  <FontAwesomeIcon 
                  icon={icon({name: 'plus'})} 
                  style={{color: "white"}} 
                  />
                </button>
            </div>

            <div class="ingredients-container">
                { ingredients.map( (val, idx) => {

                  return (
                    <>
                    <div class="row">
                      <div class="col-1 amount">{val[2]}</div>
                      <div class="col-2 unit">{val[1]}</div>
                      <div class="col-9 ingredient">{val[0]}</div>
                    </div>
                    
                    </>
                  )


                })}

                
            </div>
        </div>

        <div class="section-title">
            Preparation
        </div>
        <div class="divider"></div>

        <div class="section-content">
            <div class="step-container">

              {prepSteps.map((val, idx) => {
                return(
                  <>
                  <div class="step-container">
                    <div class="step-title-container">
                      <div class="step-title">Step {val[0]}</div>
                      <div class="step-time">{val[1]} hours, {val[2]} mins</div>
                    </div>
                    <div class="step-details">
                        {val[3]}
                    </div>
                    <div>
                      {val[4].map((url, idx) => {
                        let last = url.split(".")[url.split(".").length - 1]
                        if (['jpg', 'png', 'gif'].includes(last.toLowerCase())) {
                          return (<img key={idx} src={url} height="400px"/>)
                        } else {
                          return (<video key={idx} width="320" height="240" controls>
                                    <source src={url} />
                                      Your browser does not support the video tag.
                                  </video>)
                        }
                      })}
                    </div>
                  </div>
                  </>
                )})}
                
          </div>
        </div>

        
        <div class="section-title">
            Cooking
        </div>
        <div class="divider"></div>

        <div class="section-content">

        {cookSteps.map((val, idx) => {
                return(
                  <>
                  <div class="step-container">
                    <div class="step-title-container">
                      <div class="step-title">Step {val[0]}</div>
                      <div class="step-time">{val[1]} hours, {val[2]} mins</div>
                    </div>
                    <div class="step-details">
                        {val[3]}
                    </div>
                    <div>
                      {val[4].map((url, idx) => {
                        let last = url.split(".")[url.split(".").length - 1]
                        if (['jpg', 'png', 'gif'].includes(last.toLowerCase())) {
                          return (<img key={idx} src={url} height="400px"/>)
                        } else {
                          return (<video key={idx} width="320" height="240" controls>
                                    <source src={url} />
                                      Your browser does not support the video tag.
                                  </video>)
                        }
                      })}
                    </div>
                  </div>
                  </>
                )})}
        </div>
        
        <div class="section-title">
            Comments
        </div>
        <div class="divider"></div>

        <div class="section-content">
            <form class="comment-form section-content" action="#" method="POST">
                <label class="form-comment-title" for="form-comment-box">Leave a comment</label>
                <textarea id="form-comment-box" name="form-comment-box" placeholder="Enter your comment here" rows="3" required></textarea>
                <div class="submit-btn-container">
                    <input type="submit" value="Comment" class="btn btn-primary" />
                </div>
            </form>

            <div class="comment-list">
                <div class="user-comment-container">
                    <div class="user-image-container">
                        <img class="user-image" src="img/profile.png" alt="" />
                    </div>
                    <div class="user-comment-body">
                        <div class="user-comment-info">
                            <div class="user-name">Jeffie Wong</div>
                            <div class="comment-date">2/3/2022</div>
                        </div>
                        <div class="user-comment">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis est est, sollicitudin ut varius eget, 
                            imperdiet sit amet metus. Nunc nec condimentum libero. Morbi bibendum odio non urna gravida, eu venenatis ligula scelerisque. 
                            Praesent porta massa a dapibus accumsan. Proin a diam malesuada, venenatis erat sit amet
                        </div>
                    </div>

                    
                </div>

                <div class="user-comment-container">
                    <div class="user-image-container">
                        <img class="user-image" src="img/profile.png" alt="" />
                    </div>
                    <div class="user-comment-body">
                        <div class="user-comment-info">
                            <div class="user-name">Jeffie Wong</div>
                            <div class="comment-date">2/3/2022</div>
                        </div>
                        <div class="user-comment">
                            Lorem ipsum dolor sit amet, some short comment
                        </div>
                    </div>

                    
                </div>

                <div class="user-comment-container">
                    <div class="user-image-container">
                        <img class="user-image" src="img/profile.png" alt=""  />
                    </div>
                    <div class="user-comment-body">
                        <div class="user-comment-info">
                            <div class="user-name">Jeffie Wong</div>
                            <div class="comment-date">2/3/2022</div>
                        </div>
                        <div class="user-comment">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis est est, sollicitudin ut varius eget, 
                            imperdiet sit amet metus. Nunc nec condimentum libero. Morbi bibendum odio non urna gravida, eu venenatis ligula scelerisque. 
                            Praesent porta massa a dapibus accumsan. Proin a diam malesuada, venenatis erat sit amet
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis est est, sollicitudin ut varius eget, 
                            imperdiet sit amet metus. Nunc nec condimentum libero. Morbi bibendum odio non urna gravida, eu venenatis ligula scelerisque. 
                            Praesent porta massa a dapibus accumsan. Proin a diam malesuada, venenatis erat sit amet
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis est est, sollicitudin ut varius eget, 
                            imperdiet sit amet metus. Nunc nec condimentum libero. Morbi bibendum odio non urna gravida, eu venenatis ligula scelerisque. 
                            Praesent porta massa a dapibus accumsan. Proin a diam malesuada, venenatis erat sit amet
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    </>
  )
}

export default RecipeDetailContent;