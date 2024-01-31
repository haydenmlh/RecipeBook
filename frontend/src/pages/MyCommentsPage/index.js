import RecipeCard from "../../components/RecipeCard";
import { useState, useEffect, useContext, useCallback } from "react";
import MyRecipesContext from "../../contexts/MyRecipesContext.js";
import './style.css'


const MyComments = () => {

  // const [recipes, setRecipes] = useState([]);
  const { recipes, setRecipes, query, setQuery } = useContext(MyRecipesContext);
  var [hasEnded, setHasEnded] = useState(true);

  useEffect(() => {
    // let accessToken = localStorage.getItem('access-token');
    const url = `http://127.0.0.1:8000/recipes/my-com-recipes/?limit=8&offset=${query.page}`;
    let accessToken = localStorage.getItem('access-token');
    
    fetch(url, {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then(json => {
        console.log(Date(), json.results);
        if (json.results) {
          setRecipes(json.results);
          setHasEnded(json.next === null);
        }        
    })
  }, [query]);

  return (
    <>  
    
    <div>
      <button class="btn btn-outline-primary me-2 mb-2 dark-button" disabled={query.page < 1} onClick={() => setQuery({ ...query, page: query.page - 8 })}>prev</button>
      Page {(query.page+8)/8} {' '} {' '}
      <button class="btn btn-outline-primary me-2 mb-2 dark-button" disabled={hasEnded} onClick={() => setQuery({ ...query, page: query.page + 8 })}>next</button>
    </div>
      
    <div class="my-recipes">
        
        {recipes.map((recipe, index) => (
            <RecipeCard 
            key={recipe.id}
            id={recipe.id}
            img={recipe.img}
            name={recipe.name} 
            likes={recipe.likes} 
            rating={recipe.rating} 
            numRatings={recipe.numRatings} 
            duration={recipe.duration}
            />
        ))} 
    
    
    </div>
        
    </>
  )
  
}

export default MyComments;