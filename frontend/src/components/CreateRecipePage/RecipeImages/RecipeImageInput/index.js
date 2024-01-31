import { useState } from 'react'
import './style.css'

const RecipeImageInput = (props) => {
  const [image, setImage] = useState(null)
  const [imageDeleted, setImageDeleted] = useState(false)

  if (props.recipe_image_key == 0) {
    return (
      <>
      <div>
        <div>Main Image</div>
        { (image)
          ? <>
              <img src={image} className="recipe-image" style={{height: "100px"}}/>
              <div 
                class="custom-file-upload" 
                onClick={(e) => {
                  e.target.files = [null]
                  setImage(null);
                  setImageDeleted(true);
                  props.handleFileChange(e);
                }}
              >
                  Delete image
              </div>
            </>
          : <></>
        }
        
        <label for={props.recipe_image_key} class="custom-file-upload">
          <input 
          type="file" 
          id={props.recipe_image_key}
          className="file-button recipe-image-button" 
          placeholder="Quantity" 
          name="ingredient-1-quantity" 
          defaultValue={props.quantity} 
          onChange={(e) => {
            if (e.target.files) {
              setImage(URL.createObjectURL(e.target.files[0]));
              setImageDeleted(false);
            }            
            props.handleFileChange(e);
          }} 
          />
          { (imageDeleted)
          ? "Upload another file"
          : "Upload a file"
          }
        </label>

      </div>
      <div>Secondary Image(s)</div>
      </>
    )
  } else if (props.recipe_image_key == 1){
    return (
      <div>
        { (image)
          ? <>
              <img src={image} className="recipe-image" style={{height: "100px"}}/>
              <div 
                class="custom-file-upload" 
                onClick={(e) => {
                  e.target.files = [null]
                  setImage(null);
                  setImageDeleted(true);
                  props.handleFileChange(e);
                }}
              >
                  Delete image
              </div>
            </>
          : <></>
        }
        
        <label for={props.recipe_image_key} class="custom-file-upload">
          <input 
          type="file" 
          id={props.recipe_image_key}
          className="file-button recipe-image-button" 
          placeholder="Quantity" 
          name="ingredient-1-quantity" 
          defaultValue={props.quantity} 
          onChange={(e) => {
            if (e.target.files) {
              setImage(URL.createObjectURL(e.target.files[0]));
              setImageDeleted(false);
            }            
            props.handleFileChange(e);
          }} 
          />
          { (imageDeleted)
          ? "Upload another file"
          : "Upload a file"
          }
        </label>
      </div>
    )
  } else {
    return (
      <div>
        { (image)
          ? <>
              <img src={image} className="recipe-image" style={{height: "100px"}}/>
              <div 
                class="custom-file-upload" 
                onClick={(e) => {
                  e.target.files = [null]
                  setImage(null);
                  setImageDeleted(true);
                  props.handleFileChange(e);
                }}
              >
                  Delete image
              </div>
            </>
          : <></>
        }
        
        <label for={props.recipe_image_key} class="custom-file-upload">
          <input 
          type="file" 
          id={props.recipe_image_key}
          className="file-button" 
          placeholder="Quantity" 
          name="ingredient-1-quantity" 
          defaultValue={props.quantity} 
          onChange={(e) => {
            if (e.target.files) {
              setImage(URL.createObjectURL(e.target.files[0]));
              setImageDeleted(false);
            }            
            props.handleFileChange(e);
          }} />
          { (imageDeleted)
          ? "Upload another file"
          : "Upload a file"
          }
        </label>
        <div class="custom-file-upload" onClick={props.handleClick}>Cancel</div>
      </div>
  )};
  
}

export default RecipeImageInput;