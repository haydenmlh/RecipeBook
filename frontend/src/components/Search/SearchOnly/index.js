import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../contexts/userContext";

const SearchOnly = () => {
  
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [query, setQuery] = useState("");
  const {pass, setPass } = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = (e) => {
    let base_url=`/search`;

    console.log("clicked")

    
    let diet_url=`&diet=${diet}`
    let cuisine_url=`&cuisine=${cuisine}`
    let cookingTime_url=`&cookingTime=${cookingTime}`
    let query_url = `?query=${query}`

    let final_url = query_url + diet_url + cuisine_url + cookingTime_url
    console.log(final_url)
    setPass(true)
    navigate({pathname: base_url, search: final_url}, {replace: true});
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
          <form class="d-flex pb-2" role="search">
            <input class="form-control me-2" onChange={onChangeQuery} type="search" placeholder="Find a recipe" aria-label="Search" style={{width: "min(80%, 350px)"}}/>
            <button class="btn btn-outline-primary me-2 dark-button" onClick={() => handleClick()}>Search</button>
          </form>
    </>
  )

}

export default SearchOnly;