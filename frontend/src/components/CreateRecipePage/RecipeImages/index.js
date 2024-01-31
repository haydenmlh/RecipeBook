import { useState } from "react";
import RecipeImageInput from "./RecipeImageInput";
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const RecipeImages = ( { imageList, setImageList }) => {
  
  const addRecipeImage = (e) => {
    e.preventDefault()
    const key = imageList.max_key
    setImageList({list: [...imageList.list, {key: key + 1, file: null}], max_key: key + 1})
  };

  const removeRecipeImage = (key) => {
    // console.log("index", index);
    
    let list = [...imageList.list];
    let filtered_list = list.filter((x) => x.key !== key)
    setImageList({list: filtered_list, max_key: imageList.max_key})

  }

  const changeRecipeImage = (e, key, field) => {
    if (e.target.files) {
      const newValue = e.target.files[0];
      let list = [...imageList.list]
      list[list.findIndex((x) => x.key === key)][field] = newValue;
      setImageList({list: list, max_key: imageList.max_key});
    }
    console.log(imageList)

  }


  // const handleFileChange = (e) => {
  //   if (e.target.files) {
  //     setrecipeFiles([...recipeFiles, e.target.files[0]]);
  //   }
  //   console.log(recipeFiles);
  // };

  return (
    <>
    <div className="row mb-3">
    
    <div>
      {/* <img src={image} style={{width: "100px"}}/> */}
      {/* <input type="file" onChange={(e) => changeRecipeImage(e, 0, "file")} /> */}
      {imageList.list.map(({key, quantity, unit, name}, index) => (
            // ingredientKey = ingredientKey + 1;
            // console.log("ingredient key", ingredientKey);
            <RecipeImageInput
              key={key}
              recipe_image_key={key}
              index={index}
              name={name} 
              handleClick={() => removeRecipeImage(key)}
              handleFileChange={(e) => changeRecipeImage(e, key, "file")}
            />
        ))}
        <label className="add-more" onClick={addRecipeImage}>
          <FontAwesomeIcon icon={icon({name: 'plus'})} style={{color: "#5c3802"}} /> 
          {" "}Add more files
        </label>
    </div>
    
    </div>
    </>
  )
}

export default RecipeImages;