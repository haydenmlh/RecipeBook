import React, { useContext, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Ratings from './Ratings'
import RecipeCardImage from './RecipeCardImage';
import './style.css';
import UserContext from '../../contexts/userContext';
import axios from 'axios';

const RecipeCard = (props) => {
  const { id, img, name, likes, rating, numRatings, duration, description } = props
  const { isLoggedIn } = useContext(UserContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addToShoppingList = () => {
    let accessToken = localStorage.getItem('access-token');
    let user_id = localStorage.getItem('user-id');
    let form_data = new FormData();
    form_data.append("servingSize", 1);
    form_data.append("recipe", id);
    form_data.append("user", user_id);
    const shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/${user_id}/`;

    axios.post(shopping_list_url, form_data, {
      headers: {
          "Authorization" : `Bearer ${accessToken}`
      }
    })
    .then(function (response) {
        navigate("../shopping-list", { replace: true });
    })
    .catch((e) => {
      if(e.response.status === 400){
        setError("Already added");
      }
    })
  }

  return (
    <>
      <div class="card" style={{width: "18rem"}}>
      <Link to={"recipe-details?id=" + id}><RecipeCardImage img={img} /></Link>
        <div class="card-body">
          <div class="d-flex justify-content-between">
          <Link to={"recipe-details?id=" + id}  style={{ textDecoration: 'none' }}><h5 class="card-title m-0">{name}</h5></Link>
            <div class="text-end">{likes} <FontAwesomeIcon icon={icon({name: 'heart'})} /></div>
          </div>
          <div class="d-flex justify-content-between">
            <Ratings rating={rating} numRatings={numRatings} />
            
            <div>{duration} hour(s) <FontAwesomeIcon icon={icon({name: 'clock', style: 'regular'})} /></div>
          </div>
          <p></p>
          <p class="card-text">A tasty recipe about {name}</p>
          { (isLoggedIn)
            ? (error) 
            ? <button class="btn btn-outline-primary me-2 mb-2 light-button" type="button" disabled={true}>Recipe was added</button>
            : <button class="btn btn-outline-primary me-2 mb-2 light-button" type="button" onClick={addToShoppingList}>Add to Shopping Cart</button>
            : <></>
          }
          <Link to={"/recipe-details?id=" + id}><button class="btn btn-outline-primary me-2 mb-2 dark-button" type="button" >More details</button></Link>
        </div>
      </div>
    </>
  )
}

export default RecipeCard;