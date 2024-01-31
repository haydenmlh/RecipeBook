import './style.css'

const BaseIngredientDropdown = (props) => {


  return (
      <div key={props.xid} className="baseIngredientOption" onClick={props.optionClicked}>{props.name} (unit: {props.unit})</div>
  )
}

export default BaseIngredientDropdown;