import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Ratings from '../RecipeCard/Ratings'
import RecipeCardImage from '../RecipeCard/RecipeCardImage';
import './style.css';
import React, { useContext, useState} from 'react';
import axios from 'axios';

const ShoppingListRecipeCard = (props) => {
  const { recipeId, 
          img, 
          name, 
          likes, 
          rating, 
          numRatings, 
          duration, 
          description, 
          shoppingListId, 
          servingSize,
          setIngredients,
          setRecipes,
          setShoppingList} = props
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const deleteFromShoppingList = () => {
    let accessToken = localStorage.getItem('access-token');
    const shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/${shoppingListId}/`;

    axios.delete(shopping_list_url, {
      headers: {
          "Authorization" : `Bearer ${accessToken}`
      }
    })
    .then(function (response) {
        
    })
    .catch((e) => {
      console.log(e);
    })
    .then( () => {
        accessToken = localStorage.getItem('access-token');
        const get_shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/info/`;

        fetch(get_shopping_list_url, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(json => {
          setIngredients(json.shopping_list);
          setRecipes(json.recipes);
          setShoppingList(json.shopping_list_objects);
        })
        .catch((e) => console.log(e))

    })
  }

  const incrementServingSize = () => {
    let accessToken = localStorage.getItem('access-token');
    let user_id = localStorage.getItem('user-id');
    const shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/${shoppingListId}/`;
    let form_data = new FormData();
    form_data.append("servingSize", servingSize + 1);
    form_data.append("recipe", recipeId);
    form_data.append("user", user_id);
    axios.patch(shopping_list_url, form_data, {
      headers: {
          "Authorization" : `Bearer ${accessToken}`
      }
    })
    .then(function (response) {
        
    })
    .catch((e) => {
      console.log(e);
    })
    .then( () => {
      accessToken = localStorage.getItem('access-token');
      const get_shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/info/`;

      fetch(get_shopping_list_url, {
          headers: {
              "Authorization" : `Bearer ${accessToken}`
          }
      })
      .then(response => response.json())
      .then(json => {
        setIngredients(json.shopping_list);
        setRecipes(json.recipes);
        setShoppingList(json.shopping_list_objects);
      })
      .catch((e) => console.log(e))

  })
  }

  const decrementServingSize = () => {
    let accessToken = localStorage.getItem('access-token');
    let user_id = localStorage.getItem('user-id');
    const shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/${shoppingListId}/`;
    if(servingSize > 1){
      let form_data = new FormData();
      form_data.append("servingSize", servingSize - 1);
      form_data.append("recipe", recipeId);
      form_data.append("user", user_id);
      axios.patch(shopping_list_url, form_data, {
        headers: {
            "Authorization" : `Bearer ${accessToken}`
        }
      })
      .then(function (response) {
          
      })
      .catch((e) => {
        console.log(e);
      })
      .then( () => {
        accessToken = localStorage.getItem('access-token');
        const get_shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/info/`;

        fetch(get_shopping_list_url, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(json => {
          setIngredients(json.shopping_list);
          setRecipes(json.recipes);
          setShoppingList(json.shopping_list_objects);
        })
        .catch((e) => console.log(e))

      })
    }else{
      setIsDisabled(true);
    }
  }

  return (
    <>
      <div className="card" style={{width: "18rem"}}>
      <Link to={"recipe-details?id=" + recipeId}><RecipeCardImage img={img} /></Link>
        <div className="card-body">
          <div clasName="d-flex justify-content-between">
          <Link to={"recipe-details?id=" + recipeId}  style={{ textDecoration: 'none' }}><h5 className="card-title m-0">{name}</h5></Link>
            <div className="text-end">{likes} <FontAwesomeIcon icon={icon({name: 'heart'})} /></div>
          </div>
          <div className="d-flex justify-content-between">
            <Ratings rating={rating} numRatings={numRatings} />
            
            <div>{duration} hour(s) <FontAwesomeIcon icon={icon({name: 'clock', style: 'regular'})} /></div>
          </div>
          <p></p>
          <p class="card-text">A tasty recipe about {name}</p>
          <button class="btn btn-outline-primary me-2 mb-2 light-button" type="button" onClick={deleteFromShoppingList}>Delete from Shopping Cart</button>
          <Link to={"/recipe-details?id=" + recipeId}><button class="btn btn-outline-primary me-2 mb-2 dark-button" type="button" >More details</button></Link>
          <button class="btn minus-btn" onClick={decrementServingSize} disabled={isDisabled}><b>-</b></button>
          {servingSize}
          <button class="btn minus-btn" onClick={incrementServingSize}><b>+</b></button>
        </div>
      </div>
    </>
  )
}

export default ShoppingListRecipeCard;