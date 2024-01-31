import RecipeCard from "../../components/RecipeCard";
import { useState, useEffect, useContext } from "react";
import './style.css';
import PopularRecipesContext from "../../contexts/PopularRecipesContext";


const PopularRecipes = () => {

  // const [recipes, setRecipes] = useState([]);
  const { recipes, setRecipes, query, setQuery } = useContext(PopularRecipesContext);
  var [hasEnded, setHasEnded] = useState(true);

  useEffect(() => {
    // let accessToken = localStorage.getItem('access-token');
    const url = `http://127.0.0.1:8000/recipes/popular-recipes/?limit=8&offset=${query.page}`;
    

    fetch(url, {})
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
      
      <div class="popular-recipes">
      
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

export default PopularRecipes;