import { useContext, useEffect, useState } from "react";
import RecipeDetailsContext from "../../../../contexts/RecipeDetailsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useSearchParams } from "react-router-dom"
import axios from 'axios';
import UserContext from "../../../../contexts/userContext";

const LikesRecipeDetail = () => {

  const { numLikes, setNumLikes } = useContext(RecipeDetailsContext);
  const [ liked, setLiked ] = useState(false);
  let [searchParams] = useSearchParams();
  const { userId, setUserId } = useContext(UserContext);


  useEffect(()=>{
    let accessToken = localStorage.getItem('access-token');
    const headers_obj = {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    }
    const url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/like/`;
    axios.get(url, headers_obj)
    .then((resp) => { // rating found and exists, -> set liked to true
      console.log("initial get like for logged in user")
      console.log(resp);
      setLiked(true);
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
        setNumLikes(json.num_likes);
      })
    })
    .catch((e) => {console.log(e)})

  }, [])

  const handleClick = (e) => {
     if (liked) {  // if it's already liked then a click will remove the like
      
      let accessToken = localStorage.getItem('access-token');

      const headers_obj = {
        headers: {
          "Authorization" : `Bearer ${accessToken}`
        }
      }
      let url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/like/`;
      axios.delete(url, headers_obj)
      .then((resp) => { 
        setLiked(false)
        
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
          setNumLikes(json.num_likes);
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
      
      let url = `http://127.0.0.1:8000/recipes/${searchParams.get("id")}/like/`;
      form_data.append("recipe", searchParams.get("id"));
      form_data.append("user", parseInt(userId));
      axios.post(url, form_data, headers_obj)
      .then((resp => {
        console.log(resp);
        setLiked(true);
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
          setNumLikes(json.num_likes);
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
              icon={ liked
                    ? icon({name: 'bookmark'}) 
                    : icon({name: 'bookmark', style: "regular"}) } 
              style={{color: "#101010"}} 
              onClick={handleClick}
          />
        </button>
        <label for="like-btn" class="like-num">{numLikes}</label>
      </div>
    </>
  )
}

export default LikesRecipeDetail;