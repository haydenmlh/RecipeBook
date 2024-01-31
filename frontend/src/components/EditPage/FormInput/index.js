import './style.css';
import React, { useState } from 'react';

const FormInput = (props) => {

    const { errormessage, label, onChange, id, ...inputProps } = props;
    const [focused, setFocused] = useState(false);

    const handleFocused = (e) => {
        setFocused(true);
    };

    return (
        <div className="form-floating mb-2">
            <input 
            className="form-control me-2" 
            {...inputProps} 
            onChange={onChange}
            onBlur={handleFocused}
            focused={focused.toString()}/>
            <label>{label}</label>
            <span className="error"> <i className="bi bi-bug red"> </i> {errormessage}</span>
        </div>
    );
}

export default FormInput