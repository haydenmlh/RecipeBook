import { useContext, useEffect, useState } from "react";
import RecipeDetailsContext from "../../../../contexts/RecipeDetailsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useSearchParams } from "react-router-dom"
import axios from 'axios';
import UserContext from "../../../../contexts/userContext";


const FavoriteRecipeDetail = () => {

  const { numFavorites, setNumFavorites } = useContext(RecipeDetailsContext);
  const [ favorited, setFavorited ] = useState(false);
  let [searchParams] = useSearchParams();
  const { userId, setUserId } = useContext(UserContext);


  useEffect(()=>{
    let accessToken = localStorage.getItem('access-token');
    const headers_obj = {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    }
    const url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/favorite/`;
    axios.get(url, headers_obj)
    .then((resp) => { // favorite found and exists, -> set favorited to true
      console.log("initial get like for logged in user")
      console.log(resp);
      setFavorited(true);
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
        setNumFavorites(json.num_favorites);
      })
    })
    .catch((e) => {console.log(e)})

  }, [])

  const handleClick = (e) => {
     if (favorited) {  // if it's already favorited then a click will remove the favorite
      
      let accessToken = localStorage.getItem('access-token');

      const headers_obj = {
        headers: {
          "Authorization" : `Bearer ${accessToken}`
        }
      }
      let url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/favorite/`;
      axios.delete(url, headers_obj)
      .then((resp) => { 
        setFavorited(false)
        
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
          setNumFavorites(json.num_favorites);
        })
      })
      .catch((e) => console.log(e))
      

      } else {  // add a like
      
        let accessToken = localStorage.getItem('access-token');
        let form_data = new FormData();

        const headers_obj = {
          headers: {
            "Authorization" : `Bearer ${accessToken}`
          }
        }

        let url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/favorite/`;
        form_data.append("recipe", searchParams.get("id"));
        form_data.append("user", parseInt(userId));
        axios.post(url, form_data, headers_obj)
        .then((resp => {
          console.log(resp);
          setFavorited(true);
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
            setNumFavorites(json.num_favorites);
          })
        })
        .catch((e) => console.log(e))

      

      }     
  };


  return (
    <>
      <div class="d-flex">
        <button class="like-btn btn" id="like-btn">
          <FontAwesomeIcon 
              icon={ favorited
                    ? icon({name: 'heart'}) 
                    : icon({name: 'heart', style: "regular"}) } 
              style={{color: "red"}} 
              onClick={handleClick}
          />
        </button>
        <label for="like-btn" class="like-num">{numFavorites}</label>
      </div>
    </>
  )
}

export default FavoriteRecipeDetail