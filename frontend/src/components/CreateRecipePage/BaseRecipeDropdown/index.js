import React, { useState } from 'react';

const BaseRecipeDropdown = (props) => {


    return (
        <div key={props.xid} className="baseRecipeOption" onClick={props.optionClicked}>{props.name}</div>
    )
}

export default BaseRecipeDropdown;