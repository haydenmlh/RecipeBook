import './style.css';
import React, { useState } from 'react';

const FormInput = (props) => {

    const { label, onChange, id, ...inputProps} = props;

    return (
        <div className="form-floating mb-2">
            <input 
            className="form-control me-2" 
            {...inputProps} 
            onChange={onChange}/>
            <label>{label}</label>
        </div>
    );
}

export default FormInput