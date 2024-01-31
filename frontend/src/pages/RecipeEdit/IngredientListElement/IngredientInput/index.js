import React, { useEffect, useState } from 'react';
import BaseIngredientDropdown from './BaseIngredientDropdown';
import './style.css'

const IngredientInput = (props) => {

  var [baseIngredient, setBaseIngredient] = useState({
    id: -1, name: "", unit: "", focus: false
  });

  var [baseIngredientDropdown, setBaseIngredientDropdown] = useState([]);

  useEffect(() => {
    console.log("baseIngredient", baseIngredient)

    if (baseIngredient.name) {
        let accessToken = localStorage.getItem('access-token');
        const options = {
            method: 'GET',
            headers: {'Authorization': `Bearer ${accessToken}`}
        }

        // fetch("http://127.0.0.1:8000/recipes/api/?search=" + baseRecipe.name, options)
        fetch("http://127.0.0.1:8000/recipes/baseIngredients/getbyname/?name=" + baseIngredient.name, options)
            .then(r => r.json())
            .then(json => {
                console.log("searched", json.results);
                setBaseIngredientDropdown(json.results);
            })
    }
    else {
      setBaseIngredientDropdown([]);
        // setBaseRecipe({name: baseRecipe.name, id: baseRecipe.id, focus: false});
    }
    
  }, [baseIngredient])

  const baseIngredientOptionClicked = (id, name, unit) => {
    console.log("clicked", id, name, unit);
    setBaseIngredient({id: id, name: name, unit: unit, focus: false});
  }

  return (
    <>
      <div className="c-row">
          <div className="input-group mb-3">
              <button className="btn btn-outline-secondary delete-btn" type="button" onClick={props.handleClick}>
                  <i className="bi bi-trash"></i>
              </button>
              <input type="text" 
                className="form-control quantity" 
                placeholder="Quantity" 
                name="ingredient-1-quantity" 
                defaultValue={props.quantity} 
                onChange={props.handleQuantityChange} 
                required />
              
              { // if has id then disable
                (baseIngredient.id == -1)
                ? <input type="text" 
                className="form-control unit" 
                placeholder='Unit' 
                name="unit" 
                value={baseIngredient.unit} 
                onChange={(e) => {
                  setBaseIngredient({...baseIngredient, unit: e.target.value});
                  props.handleUnitChange(e)
                }} 
                required/>
                : <input type="text" 
                className="form-control unit" 
                placeholder='Unit' 
                name="unit" 
                value={baseIngredient.unit} 
                onChange={(e) => {
                  props.handleUnitChange(e)
                }} 
                disabled
                required/>
              }
              <input type="text" 
                className="form-control" 
                placeholder="Ingredient Name" 
                name="ingredient-1-name" 
                value={baseIngredient.name} 
                onChange={(e) => {
                  setBaseIngredient({ id: -1, name: e.target.value, unit: "", focus: true});
                  props.handleNameChange(e)
                }}
                required />
          </div>
          <div className="baseIngredientDropdown" 
            style={{display: (baseIngredient.focus && baseIngredientDropdown.length > 0) ? "" : "none"}}
            onBlur={(e) => setBaseIngredient({name: baseIngredient.name, id: baseIngredient.id, focus: false})}
          >
            {
                baseIngredientDropdown.map((x) => (
                    <BaseIngredientDropdown
                      key={x.id} 
                      name={x.name} 
                      unit={x.unit}
                      xid={x.id} 
                      optionClicked={() => baseIngredientOptionClicked(x.id, x.name, x.unit)} 
                    />
                ))
            }
          </div>
      </div>
    </>
  )
}

export default IngredientInput;