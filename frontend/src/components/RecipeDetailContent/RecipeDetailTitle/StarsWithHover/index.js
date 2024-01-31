import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import RecipeDetailsContext from '../../../../contexts/RecipeDetailsContext';
import UserContext from '../../../../contexts/userContext';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';


const StarsWithHover = ({ height }) => {

  const [ rating, setRating ] = useState(0);
  const [ rated, setRated ] = useState(false);

  const { userId, setUserId } = useContext(UserContext);
  const { recipeId, setRecipeId, setCuisine, setName, setAvgRating, setNumRatings} = useContext(RecipeDetailsContext);

  let [searchParams] = useSearchParams();


  useEffect(()=>{
    
    let accessToken = localStorage.getItem('access-token');
    const headers_obj = {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    }
    const url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/rating/`;
    axios.get(url, headers_obj)
    .then((resp) => { // rating found and exists, -> update current rating and rated
      console.log("initial get recipe rating for logged in user")
      console.log(resp);
      setRating(resp.data.stars);
      setRated(true);
    })
    .catch((e) => {console.log(e)})

  }, [])
  
  const handleRating = (index) => {
    
    if (index === rating && rated) {  // you have rated and are trying to delete your rating
      
      // do api call to delete rating
      let accessToken = localStorage.getItem('access-token');

      const headers_obj = {
        headers: {
          "Authorization" : `Bearer ${accessToken}`
        }
      }
      let url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/rating/`;
      axios.delete(url, headers_obj)
      .then((resp) => { 
        setRated(!rated)
        
      })
      .then( () => {
        let accessToken = localStorage.getItem('access-token');
        const headers_obj = {
          headers: {
            "Authorization" : `Bearer ${accessToken}`
          }
        }
        const url = `http://127.0.0.1:8000/recipes/long-details/${searchParams.get("id")}/`;
    
        fetch(url, headers_obj)
        .then(response => response.json())
        .then(json => {
          console.log(json);
          setRecipeId(json.id);
          setCuisine(json.cuisine_name);
          setName(json.name);
          setAvgRating(json.avg_rating);
          setNumRatings(json.num_ratings);
        })
      })
      .catch((e) => console.log(e))
      
      
    } else {  // you are trying to rate / change your rating
      
      // check if rating exists, if not then create, otherwise update
      let accessToken = localStorage.getItem('access-token');
      let form_data = new FormData();

      const headers_obj = {
        headers: {
          "Authorization" : `Bearer ${accessToken}`
        }
      }
      let url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/rating/`;
      axios.get(url, headers_obj)
      .then((resp) => { // rating found and exists, update
        url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/rating/`;
        form_data = new FormData();
        form_data.append("stars", index);
        form_data.append("recipe", searchParams.get("id"));
        form_data.append("user", parseInt(userId));
        axios.patch(url, form_data, headers_obj)
        .then((resp => {
          console.log(resp);
          setRating(index);
          setRated(true);
        }))
        .then( () => {
          let accessToken = localStorage.getItem('access-token');
          const headers_obj = {
            headers: {
              "Authorization" : `Bearer ${accessToken}`
            }
          }
          const url = `http://127.0.0.1:8000/recipes/long-details/${searchParams.get("id")}/`;
      
          fetch(url, headers_obj)
          .then(response => response.json())
          .then(json => {
            console.log(json);
            setRecipeId(json.id);
            setCuisine(json.cuisine_name);
            setName(json.name);
            setAvgRating(json.avg_rating);
            setNumRatings(json.num_ratings);
          })
        })
        .catch((e) => console.log(e))
        })
      .catch((e) => { 
        
        if (e.response.status === 404) {// if 404, rating does not exist, create
          console.log("404 is good.")
          url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/rating/`;
          form_data = new FormData();
          form_data.append("stars", index);
          form_data.append("recipe", searchParams.get("id"));
          form_data.append("user", parseInt(userId));
          axios.post(url, form_data, headers_obj)
          .then((resp => {
            console.log(resp);
            setRating(index);
            setRated(true);
          }))
          .then( () => {
            let accessToken = localStorage.getItem('access-token');
            const headers_obj = {
              headers: {
                "Authorization" : `Bearer ${accessToken}`
              }
            }
            const url = `http://127.0.0.1:8000/recipes/long-details/${searchParams.get("id")}/`;
        
            fetch(url, headers_obj)
            .then(response => response.json())
            .then(json => {
              console.log(json);
              setRecipeId(json.id);
              setCuisine(json.cuisine_name);
              setName(json.name);
              setAvgRating(json.avg_rating);
              setNumRatings(json.num_ratings);
            })
          })
          .catch((e) => console.log(e))

          
        }        
      })

      
    }
  }


  return(
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <FontAwesomeIcon 
            key={index}
            icon={ (index <= rating && rated) 
                   ? icon({name: 'star'}) 
                   : icon({name: 'star', style: 'regular'})} 
            style={{color: "#ffd200", height: "28px"}}
            // className={index <= rating ? "r-star on" : "r-star off"}
            onClick={() => handleRating(index)}
          />
          // <button
          //   type="button"
          //   key={index}
          //   className={index <= rating ? "on" : "off"}
          //   onClick={() => setRating(index)}
          // >
          //   <span className="star">&#9733;</span>
          // </button>
        );
      })}
    </div>
  );
  
}

export default StarsWithHover;