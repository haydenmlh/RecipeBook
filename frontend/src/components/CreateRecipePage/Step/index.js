import React, { useState } from 'react';

const Step = (props) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)

  return (
    <>
    <div className="step-container form-group mb-3" data-steptype={props.type} data-stepnum={props.num}>
      <label for="prep-1-desc" className="form-label step-title">Step {props.num}</label>
      <button className="btn step-delete-btn" onClick={props.handleDelete}><i className="bi bi-trash"></i> </button> 
      
      <div className="input-group step-time-input" id="prep-time">
        <span className="input-group-text">Time</span>
        <input type="text" className="form-control" id="step-hour" name="step-hour" defaultValue={props.hour} onChange={props.handleHourChange} required />
        <span className="input-group-text">h</span>
        <input type="text" className="form-control" id="step-min" name="step-min" defaultValue={props.min} onChange={props.handleMinChange} required />
        <span className="input-group-text">min</span>
      </div>

      <textarea className="form-control" id="step-desc" name="step-desc" rows="5" defaultValue={props.desc} onChange={props.handleDescChange} required></textarea>
      
      
      
    
    </div>
    <div className="row mb-3">
          <div>
          { (image1)
          ? <>
              <img src={image1} className="recipe-image" style={{height: "100px"}}/>
              <div 
                class="custom-file-upload" 
                onClick={(e) => {
                  e.target.files = [null]
                  setImage1(null);
                  props.handleFile1Change(e);
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
              setImage1(URL.createObjectURL(e.target.files[0]));
            }            
            props.handleFile1Change(e);
          }} 
          />
          Upload File1
        </label>
        </div>

        <div>
        { (image2)
          ? <>
              <img src={image2} className="recipe-image" style={{height: "100px"}}/>
              <div 
                class="custom-file-upload" 
                onClick={(e) => {
                  e.target.files = [null]
                  setImage2(null);
                  props.handleFile2Change(e);
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
              setImage2(URL.createObjectURL(e.target.files[0]));
            }            
            props.handleFile2Change(e);
          }} 
          />
          Upload File2
        </label>
        </div>

      </div>
    </>
  )
}

export default Step;