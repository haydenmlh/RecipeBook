import React, { useState } from 'react';

const DietCheckbox = (props) => {

    const changeDiets = (id) => {
        if (props.diets.includes(id)) {
            var d = props.diets;
            d.splice(d.indexOf(id), 1);
            props.setDiets(d);
        }
        else {
            props.setDiets([...props.diets, id]);
        }
    }

    return (
        <div className="form-check form-check-inline diet-tag-container" id="diet-tag-container">

            {
                props.dietList.map((d) => (
                    <div className="diet-tag" key={d.id}>
                        <input type="checkbox" className="btn-check diet-pill" id={"diet_" + d.id} name={d.name} onChange={() => changeDiets(d.id)} checked={props.diets.includes(d.id)}/>
                        <label className="btn diet-pill " for={"diet_" + d.id}>
                            {d.name}
                        </label>
                    </div>
                ))
            }
        </div>
    )
}

export default DietCheckbox