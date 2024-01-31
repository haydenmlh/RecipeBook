import IngredientInput from "./IngredientInput";
import './style.css'

const IngredientListElement = ( {ingredientList, setIngredientList}) => {
  
  const addIngredient = (e) => {
    e.preventDefault()
    // console.log("last key", ingredientList.max_key);
    const key = ingredientList.max_key
    setIngredientList({list: [...ingredientList.list, {key: key + 1, quantity: "", unit: "", name: ""}], max_key: key + 1})
    // setIngredientList([...ingredientList.list, ({key: 4, quantity: "", unit: "", name: "", }, 0)]);
  };

  const removeIngredient = (key) => {
    // console.log("index", index);
    
    let list = [...ingredientList.list];
    let filtered_list = list.filter((x) => x.key !== key)
    setIngredientList({list: filtered_list, max_key: ingredientList.max_key})

  }

  const changeIngredient = (e, key, field) => {
    
    const newValue = e.target.value;
    let list = [...ingredientList.list]
    list[list.findIndex((x) => x.key === key)][field] = newValue;
    setIngredientList({list: list, max_key: ingredientList.max_key});

  }
  
  return (
    <>
      <div className="ingredients-container">
        
        {ingredientList.list.map(({key, quantity, unit, name}, index) => (
            // ingredientKey = ingredientKey + 1;
            // console.log("ingredient key", ingredientKey);
            <IngredientInput
              key={key}
              ingredient_key={key}
              index={index} 
              quantity={quantity} 
              unit={unit} 
              name={name} 
              handleClick={() => removeIngredient(key)}
              handleQuantityChange={(e) => changeIngredient(e, key, "quantity")}
              handleUnitChange={(e) => changeIngredient(e, key, "unit")}
              handleNameChange={(e) => changeIngredient(e, key, "name")}
            />
        ))}
        
      </div>

    <button className="btn dark-button" onClick={addIngredient}>
        <span><i className="fa fa-plus"></i></span>
        Add Ingredient
    </button>
    </>
  )
};

export default IngredientListElement;