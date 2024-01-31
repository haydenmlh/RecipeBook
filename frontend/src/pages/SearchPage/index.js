import './style.css';
import Search from '../../components/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import SearchOnly from '../../components/Search/SearchOnly';
import axios from 'axios';
import RecipeCard from '../../components/RecipeCard';
import UserContext from '../../contexts/userContext';



const SearchPage = () => {
  let [searchParams] = useSearchParams();

  const {pass, setPass } = useContext(UserContext);

  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [searchPressed, setSearchPressed] = useState(false);
  const [query, setQuery] = useState({
    search: '', page: 0
  })
  const [recipes, setRecipes] = useState([]);
  var [hasEnded, setHasEnded] = useState(true);
  
  useEffect( () => {
    if (pass) {
      const query = searchParams.get("query");
      const cuisine = searchParams.get("cuisine");
      const diet = searchParams.get("diet");
      const cookingTime = searchParams.get("cookingTime");
      setPass(false)
    }
    

    const url = `http://127.0.0.1:8000/recipes/search/`;
    let form_data = new FormData();
    form_data.append("query", query)
    form_data.append("cuisine", cuisine)
    form_data.append("diet", diet)
    form_data.append("cookingTime", cookingTime)

    // for (var pair of form_data.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]); 
    // }

    axios.get(url, form_data, { })
    .then((r) => {
      if (r.results) {
        console.log(r.results);
        setRecipes(r.results);
        setHasEnded(r.next === null);
      }
    })
    .catch((e) => console.log(e))

  }, [query, searchPressed])


  useEffect(() => {



  }, [query, searchPressed])


  


  const handleClick2 = (e) => {
    e.preventDefault()
    setSearchPressed(!searchPressed)
    
  }

  const onChangeDiet = (e) => {
    setDiet(e.target.value)
  }

  const onChangeCuisine = (e) => {
    setCuisine(e.target.value)
  }

  const onChangeCookingTime = (e) => {
    setCookingTime(e.target.value)
  }

  const onChangeQuery = (e) => {
      setQuery(e.target.value)
  }


  return (
    <>
    
    <div class="d-flex flex-wrap pb-2">
            <select class="form-select" onChange={onChangeDiet} defaultValue="Filter by Diet" aria-label="Default select example" style={{width: "min(40%, 175px)", marginRight: "5px"}}>
              <option disabled hidden>Filter by Diet</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="lactose">Lactose</option>
              <option value="halal">Halal</option>
              <option value="gluten-free">Gluten-Free</option>
              
            </select>
            <select class="form-select"  onChange={onChangeCuisine} defaultValue="Filter by Cuisine" aria-label="Default select example" style={{width: "min(40%, 175px)", marginRight: "5px"}}>
              <option disabled hidden>Filter by Cuisine</option>
              <option value="chinese">Chinese</option>
              <option value="indian">Indian</option>
              <option value="middle-eastern">Middle Eastern</option>
              <option value="comfort-food">Comfort Food</option>
              <option value="dessert">Dessert</option>
            </select>
            <select class="form-select" onChange={onChangeCookingTime} defaultValue="Filter by Cooking Time" aria-label="Default select example" style={{width: "min(60%, 262.5px)"}}>
              <option disabled hidden>Filter by Cooking Time</option>
              <option value="30-mins">&#60; 30 minutes</option>
              <option value="1-hour">30 minutes - 1 hour</option>
              <option value="2-hours">1 hour - 2 hours</option>
              <option value="gt-2-hours">	&#62; 2 hours</option>
            </select>
          </div>
          <form class="d-flex pb-2">
            <input class="form-control me-2" onChange={onChangeQuery} type="search" placeholder="Find a recipe" aria-label="Search" style={{width: "min(80%, 350px)"}}/>
            <button class="btn btn-outline-primary me-2 dark-button" onClick={(e) => handleClick2(e)}>Search</button>
          </form>

      <h1>Search Results</h1>

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

export default SearchPage;