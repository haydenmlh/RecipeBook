import React, { useState } from 'react';

const CuisineDropdown = (props) => {


    return (
        <select className="form-select" name="cuisine" id="cuisine" 
          onChange={(e)=> {
            console.log(e.target.value);
            props.setCuisine(e.target.value);
          }} 
        value={props.cuisine}
        required>
            <option value={null} selected disabled hidden>Select cuisine</option>
            {
                props.cuisineList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))
            }
            
            {/* <option value="">Open this select menu</option>
            <option value="french">French</option>
            <option value="italian">Italian</option>
            <option value="japanese">Japanese</option> */}
        </select>
    )
}

export default CuisineDropdown