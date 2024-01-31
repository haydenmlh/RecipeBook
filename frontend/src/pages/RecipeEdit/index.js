import { useSearchParams } from "react-router-dom";
import './styles/colors.css';
import './styles/recipe-details.css';
import './styles/create-recipe.css';
// import './styles/colors.css';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Step from './Step';
import CuisineDropdown from './CuisineDropdown';
import DietCheckbox from './DietCheckbox';
import BaseRecipeDropdown from './BaseRecipeDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import IngredientListElement from './IngredientListElement';
import RecipeImages from './RecipeImages';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RecipeEdit = (props) => {

    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    
    var [baseRecipe, setBaseRecipe] = useState({
        name: "", id: null, focus: false
    });
    var [baseRecipeDropdown, setBaseRecipeDropdown] = useState([]);
    var [recipeName, setRecipeName] = useState("");
    var [cuisineList, setCuisineList] = useState([]);
    var [cuisine, setCuisine] = useState();
    var [dietList, setDietList] = useState([]);
    var [diets, setDiets] = useState([]);
    var [totalPrepHour, setTotalPrepHour] = useState(0);
    var [totalPrepMin, setTotalPrepMin] = useState(0);
    var [totalCookHour, setTotalCookHour] = useState(0);
    var [totalCookMin, setTotalCookMin] = useState(0);

    var [servings, setServings] = useState(1);

    var [ingredientList, setIngredientList] = useState({
        list: [{key: 0, quantity: "", unit: "", name: ""}], max_key: 0
    }, []);

    var [recipeImageList, setRecipeImageList] = useState({
      list: [{key: 0, file: null}, {key: 1, file: null}], 
      max_key: 1
    });


    const [prepStepList, setPrepStepList] = useState({
        list: [{key: 0, type: "prep", hour: 0, min: 0, desc: "", file1: null, file2: null}], max_key: 0
    }, []);


    const [cookStepList, setCookStepList] = useState({
        list: [{key: 0, type: "cook", hour: 0, min: 0, desc: "", file1: null, file2: null}], max_key: 0
    }, []);


    var [validRecipeName, setValidRecipeName] = useState(true);
    var [validCuisine, setValidCuisine] = useState(true);
    var [validPrepTime, setValidPrepTime] = useState(true);
    var [validCookTime, setValidCookTime] = useState(true);
    var [validServings, setValidServings] = useState(true);
    var [validQuantity, setValidQuantity] = useState(true);
    var [submitted, setSubmitted] = useState(false);



    // On page load fetch all diets and cuisines
    useEffect(() => {

        fetch("http://127.0.0.1:8000/recipes/cuisine/all/")
            .then(r => r.json())
            .then(json => {
                console.log("cuisine list", json.results)
                setCuisineList(json.results)
            })

        fetch("http://127.0.0.1:8000/recipes/diet/all/")
            .then(response => response.json())
            .then(json => {
                console.log("fetch diet", json.results);
                setDietList(json.results);
            })      
            
    }, [])


    // try to populate as many fields as possible
    useEffect(() => {
      // let accessToken = localStorage.getItem('access-token');
    // const headers_obj = {
    //   headers: {
    //     "Authorization" : `Bearer ${accessToken}`
    //   }
    // }
    // const url = `http://127.0.0.1:8000/recipes/long-details/${searchParams.get("id")}/`;
    
          fetch(`http://127.0.0.1:8000/recipes/details/${searchParams.get("id")}/`)
          .then(r => r.json())
          .then(r => {
            console.log("onloadedit")
            console.log(r)
              var newIngredientList = r.ingredients.map((i, index) => {
                  
                  return {
                      key: ingredientList.max_key + index + 1, 
                      quantity: i.amount, 
                      unit: i.baseIngredient_unit,
                      name: i.baseIngredient_name
                  }
              });
              
              if (r.steps){
              var newPrepList = r.steps.filter(x => x.type === false).map((x, index) => {
                  return {
                      key: prepStepList.max_key + index + 1,
                      type: "prep",
                      hour: x.hour,
                      min: x.min,
                      desc: x.description
                  }
              });

              var newCookList = r.steps.filter(x => x.type === true).map((x, index) => {
                  return {
                      key: cookStepList.max_key + index + 1,
                      type: "cook",
                      hour: x.hour,
                      min: x.min,
                      desc: x.description
                  }
              });
              }
              setBaseRecipe({name: r.base_recipe_name, id: r.base_recipe, focus: false})
              setRecipeName(r.name)
              setCuisine(r.cuisine);
              setTotalPrepHour(r.total_prep_hour);
              setTotalPrepMin(r.total_prep_min);
              setTotalCookHour(r.total_cook_hour);
              setTotalCookMin(r.total_cook_min);
              setDiets(r.diets);
              setIngredientList(
                  {list: newIngredientList, max_key: ingredientList.max_key + newIngredientList.length}
              );
              setPrepStepList({
                  list: newPrepList, max_key: prepStepList.max_key + newPrepList.length
              });
              setCookStepList({
                  list: newCookList, max_key: cookStepList.max_key + newCookList.length
              });
          
          });







    }, [])

    // Base recipe related 
    useEffect(() => {
        console.log("base recipe", baseRecipe.name)

        if (baseRecipe.name) {
            let accessToken = localStorage.getItem('access-token');
            const options = {
                method: 'GET',
                headers: {'Authorization': `Bearer ${accessToken}`}
            }

            // fetch("http://127.0.0.1:8000/recipes/api/?search=" + baseRecipe.name, options)
            fetch("http://127.0.0.1:8000/recipes/getbyname/?name=" + baseRecipe.name, options)
                .then(r => r.json())
                .then(json => {
                    console.log("searched", json.results);
                    setBaseRecipeDropdown(json.results);
                })
        }
        else {
            setBaseRecipeDropdown([]);
            // setBaseRecipe({name: baseRecipe.name, id: baseRecipe.id, focus: false});
        }
        
    }, [baseRecipe])


    const baseRecipeOptionClicked = (id, name) => {
        console.log("clicked", name, id);
        setBaseRecipe({name: name, id: id, focus: false});
    }

    const applyBaseRecipe = () => {

      if (baseRecipe.id === null) {return}
      var base_id = baseRecipe.id;
      fetch(`http://127.0.0.1:8000/recipes/details/${base_id}/`)
          .then(r => r.json())
          .then(r => {
              var newIngredientList = r.ingredients.map((i, index) => {
                  
                  return {
                      key: ingredientList.max_key + index + 1, 
                      quantity: i.amount, 
                      unit: i.baseIngredient_unit,
                      name: i.baseIngredient_name
                  }
              });

              if(r.steps){

              var newPrepList = r.steps.filter(x => x.type === false).map((x, index) => {
                  return {
                      key: prepStepList.max_key + index + 1,
                      type: "prep",
                      hour: x.hour,
                      min: x.min,
                      desc: x.description
                  }
              });

              var newCookList = r.steps.filter(x => x.type === true).map((x, index) => {
                  return {
                      key: cookStepList.max_key + index + 1,
                      type: "cook",
                      hour: x.hour,
                      min: x.min,
                      desc: x.description
                  }
              });
            }
              
              // setBaseRecipe()
              setCuisine(r.cuisine);
              setTotalPrepHour(r.total_prep_hour);
              setTotalPrepMin(r.total_prep_min);
              setTotalCookHour(r.total_cook_hour);
              setTotalCookMin(r.total_cook_min);
              setDiets(r.diets);
              setIngredientList(
                  {list: newIngredientList, max_key: ingredientList.max_key + newIngredientList.length}
              );
              setPrepStepList({
                  list: newPrepList, max_key: prepStepList.max_key + newPrepList.length
              });
              setCookStepList({
                  list: newCookList, max_key: cookStepList.max_key + newCookList.length
              });
          
          });
  }


    // Cuisine
    const changeCuisine = (id) => {
        console.log("clicked cuisine", id);
        setCuisine(id);
    }

    useEffect(() => {
        console.log("selected cuisine", cuisine);
    }, [cuisine]);



    // Diets
    useEffect(() => {
        console.log("selected diets", diets);
    }, [diets]);



    // Preparation Step functions
    const addPrepStep = (e) => {
        e.preventDefault()
        const key = prepStepList.max_key
        setPrepStepList({list: [...prepStepList.list, {key: key + 1, type: "prep", hour: 0, min: 0, desc: "", file1: null, file2: null}], max_key: key + 1})
    }

    const removePrepStep = (key) => {
        let list = [...prepStepList.list];
        let filtered_list = list.filter((x) => x.key !== key)
        setPrepStepList({list: filtered_list, max_key: prepStepList.max_key})
    }

    const prepStepChange = (e, key, field) => {
      let newValue;
      if (e.target.files){
        newValue = e.target.files[0];
      } else {
        newValue = e.target.value;
      }
      let list = [...prepStepList.list]
      list[list.findIndex((x) => x.key === key)][field] = newValue;
      setPrepStepList({list: list, max_key: prepStepList.max_key});
      console.log(prepStepList);
    }


    // Cooking Step functions
    const addCookStep = (e) => {
        e.preventDefault()
        const key = cookStepList.max_key
        setCookStepList({list: [...cookStepList.list, {key: key + 1, type: "prep", hour: 0, min: 0, desc: "", file1: null, file2: null}], max_key: key + 1})
    }

    const removeCookStep = (key) => {
        let list = [...cookStepList.list];
        let filtered_list = list.filter((x) => x.key !== key)
        setCookStepList({list: filtered_list, max_key: cookStepList.max_key})
    }

    const cookStepChange = (e, key, field) => {
      let newValue;
      if (e.target.files){
        newValue = e.target.files[0];
      } else {
        newValue = e.target.value;
      }
      let list = [...cookStepList.list]
      list[list.findIndex((x) => x.key === key)][field] = newValue;
      setCookStepList({list: list, max_key: cookStepList.max_key});
    }

    const navigate = useNavigate();
    // submit button
    const submitClicked = async (e) => {
      e.preventDefault()

      console.log("----------------");
      console.log("base recipe:", baseRecipe);
      console.log("cuisine:", cuisine);
      console.log("recipe name:", recipeName);
      console.log("total prep time", `${totalPrepHour} h ${totalPrepMin} min`);
      console.log("total cook time", `${totalCookHour} h ${totalCookMin} min`);
      console.log("diets:", diets);
      console.log("servings", servings);
      console.log("ingredients:", ingredientList);
      console.log("prep steps:", prepStepList);
      console.log("cook steps:", cookStepList);
      console.log("----------------");

      var pass = true;
      if (recipeName==="") {
          setValidRecipeName(false);
          setSubmitted(false);
          pass = false;
      }
      else {
          setValidRecipeName(true);
      }

      if (cuisine==="") {
          setValidCuisine(false);
          setSubmitted(false);
          pass = false;
      }
      else {
          setValidCuisine(true);
      }

      if (isNaN(totalPrepHour) || isNaN(totalPrepMin) || totalPrepMin === "") {
          setValidPrepTime(false);
          setSubmitted(false);
          pass = false;
      }
      else {
          setValidPrepTime(true);
      }

      if (isNaN(totalCookHour) || isNaN(totalCookMin) || totalCookMin === "") {
          setValidCookTime(false);
          setSubmitted(false);
          pass = false;
      }
      else {
          setValidCookTime(true);
      }

      if (isNaN(servings) || servings === "") {
          setValidServings(false);
          setSubmitted(false);
          pass = false;
      }
      else {
          setValidServings(true);
      }

      var passedQuantity = true
      for (var x = 0; x < ingredientList.list.length; x++) {
          if (isNaN(ingredientList.list[x].quantity) || ingredientList.list[x].quantity === "") {
              setValidQuantity(false);
              setSubmitted(false);
              passedQuantity = false;
              pass = false;
              break;
          }
      }
      if (passedQuantity)
          setValidQuantity(true)

      if (pass) {
        let form_data = new FormData();

        form_data.append("name", recipeName)
        if (baseRecipe['id']) {
          form_data.append("base_recipe", parseInt(baseRecipe['id']));
        }
        if (cuisine) {
          form_data.append("cuisine", parseInt(cuisine));
        }
        form_data.append("total_prep_hour", totalPrepHour)
        form_data.append("total_prep_min", totalPrepMin)
        form_data.append("total_cook_hour", totalCookHour)
        form_data.append("total_cook_min", totalCookMin)
        form_data.append("user", localStorage.getItem('user-id'))
        form_data.append("servings", servings)
        diets.forEach((diet) => {
          form_data.append("diets", diet)
        })
        ingredientList.list.forEach((ingredient, index) => {
          form_data.append(`ingredients[${index}]name`, ingredient["name"])
          form_data.append(`ingredients[${index}]unit`, ingredient["unit"])
          form_data.append(`ingredients[${index}]amount`, ingredient["quantity"])
        })
        recipeImageList.list.forEach((recipeImage) => {
          let file = recipeImage['file']
          if (file) {
            form_data.append("recipeImage", file)
          }          
        })
        let stepsCount = 0;
        let prepStepsCount = 1;
        prepStepList.list.forEach((prepStep, index)  => {
          form_data.append(`steps.type`, false);
          form_data.append(`steps.step_num`, prepStepsCount);
          form_data.append(`steps.hour`, parseInt(prepStep["hour"]));
          form_data.append(`steps.min`, parseInt(prepStep["min"]));
          form_data.append(`steps.description`, prepStep["desc"]);
          form_data.append(`steps.file1`, prepStep["file1"]);
          form_data.append(`steps.file2`, prepStep["file2"]);
          stepsCount++;
          prepStepsCount++;
        })

        let cookStepsCount = 1;
        cookStepList.list.forEach((cookStep, index)  => {
          form_data.append(`steps.type`, true);
          form_data.append(`steps.step_num`, cookStepsCount);
          form_data.append(`steps.hour`, parseInt(cookStep["hour"]));
          form_data.append(`steps.min`, parseInt(cookStep["min"]));
          form_data.append(`steps.description`, cookStep["desc"]);
          form_data.append(`steps.file1`, cookStep["file1"]);
          form_data.append(`steps.file2`, cookStep["file2"]);
          stepsCount++;
          cookStepsCount++;
        })
        
        for (var pair of form_data.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }

        let accessToken = localStorage.getItem('access-token');
        const url = `http://127.0.0.1:8000/recipes/create/`
        
        
        await axios.post(url, form_data, {
          headers: {
              "Authorization" : `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
          }
        })
        .then(function (response) {
            console.log("yay!!")
            setValidRecipeName(true);
            setValidCuisine(true);
            setValidPrepTime(true);
            setValidCookTime(true);
            setValidServings(true);
            setValidQuantity(true);
            setSubmitted(true);
            console.log(response.data);
            let id = response.data['id']
            navigate(`/recipe-details/?id=${id}`, {replace: true})
        })
        .catch(function(e){
            console.log(e);
        })
      }

      

    }


    return  (
        <form id="main-content">
            <h1 className="main-title text-center mb-5">Edit your Recipe</h1>
            <div className="overall-info">

                <div className="row mb-3">
                    <div className="form-group col-6" style={{position: "relative"}}>
                        <label htmlFor="base-recipe" className="form-label" >Base Recipe</label> 
                        <div>
                            <div className="input-group">
                                <input type="text" id="base-recipe" className="form-control" name="base-recipe" placeholder="Enter a Base Recipe" 
                                    value={baseRecipe.name} 
                                    onChange={(e) => setBaseRecipe({name: e.target.value, id: baseRecipe.id, focus: true})}
                                    
                                />
                                <button className="btn btn-outline-primary" type="button" id="button-addon2" onClick={() => applyBaseRecipe()}>
                                    {/* <i className="fa fa-search"></i> */}
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                            
                            <div className="baseRecipeDropdown" style={{display: (baseRecipe.focus) ? "" : "none"}}
                                onBlur={(e) => setBaseRecipe({name: baseRecipe.name, id: baseRecipe.id, focus: false})}>
                                {
                                    baseRecipeDropdown.map((x) => (
                                        <BaseRecipeDropdown key={x.id} name={x.name} xid={x.id} optionClicked={() => baseRecipeOptionClicked(x.id, x.name)} />
                                    ))
                                }
                                
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-3">
                        <label htmlFor="cuisine" className="form-label">Cuisine</label>
                        <CuisineDropdown 
                          cuisineList={cuisineList} 
                          defaultCuisine={1} 
                          cuisine={cuisine} 
                          setCuisine={setCuisine}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="form-group col-6">
                        <label htmlFor="recipe-name" className="form-label">Recipe Name</label>
                        <input type="text" className="form-control" id="recipe-name" name="recipe-name" placeholder="Recipe Name" required 
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                        />
                    </div>

                    <div className="form-group col-3">
                        <label className="form-label">Total Prep Time</label>
                        <div className="input-group" id="total-prep-time">
                            <input type="text" className="form-control" id="total-prep-hour" name="total-prep-hour" required 
                                value={totalPrepHour}
                                onChange={(e) => setTotalPrepHour(e.target.value)}
                            />
                            <span className="input-group-text">h</span>
                            <input type="text" className="form-control" id="total-prep-min" name="total-prep-min" required 
                                value={totalPrepMin}
                                onChange={(e) => setTotalPrepMin(e.target.value)}
                            />
                            <span className="input-group-text">min</span>
                        </div>
                    </div>

                    <div className="form-group col-3">
                        <label className="form-label">Total Cook Time</label>
                        <div className="input-group" id="total-cook-time">
                            <input type="text" className="form-control" id="total-cook-hour" name="total-cook-hour" required 
                                value={totalCookHour}
                                onChange={(e) => setTotalCookHour(e.target.value)}
                            />
                            <span className="input-group-text">h</span>
                            <input type="text" className="form-control" id="total-cook-min" name="total-cook-min" required 
                                value={totalCookMin}
                                onChange={(e) => setTotalCookMin(e.target.value)}
                            />
                            <span className="input-group-text">min</span>
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-12">
                        <label className="form-label">Set of diets</label>
                        <DietCheckbox dietList={dietList} diets={diets} setDiets={(newDiets) => {setDiets(newDiets)}}/>
                    </div>
                    
                </div>
                <div className="col-12">
                  <label className="form-label">Recipe Images / Videos</label>
                </div>
                <RecipeImages imageList={recipeImageList} setImageList={setRecipeImageList}/>
            </div>

            <div className="section-title">
                Ingredients
            </div>
            <div className="divider"></div>

            <div className="section-content">
                <div className="servings-container">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Servings</span>
                        <input type="text" className="form-control" id="servings" name="servings" required 
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                        />
                    </div>
                </div>

                <IngredientListElement ingredientList={ingredientList} setIngredientList={setIngredientList}/>

            </div>

            <div className="section-title">
                Preparation
            </div>
            <div className="divider"></div>

            <div className="section-content">

                {prepStepList.list.map((step, index) => (
                    <Step   key={step.key} 
                            type="prep" 
                            num={index + 1} 
                            hour={step.hour} 
                            min={step.min} 
                            desc={step.desc} 
                            handleDelete={() => removePrepStep(step.key)} 
                            handleHourChange={(e) => prepStepChange(e, step.key, "hour")}
                            handleMinChange={(e) => prepStepChange(e, step.key, "min")}
                            handleDescChange={(e) => prepStepChange(e, step.key, "desc")}
                            handleFile1Change={(e) => prepStepChange(e, step.key, "file1")}
                            handleFile2Change={(e) => prepStepChange(e, step.key, "file2")}

                    />
                ))}                
            
                <button className="btn btn-primary add-step-btn" onClick={addPrepStep}>
                    <span><i className="fa fa-plus"></i></span>
                    Add Step
                </button>
            </div>

            <div className="section-title">
                Cooking
            </div>
            <div className="divider"></div>

            <div className="section-content">

                {cookStepList.list.map((step, index) => (
                    <Step   key={step.key} 
                            type="cook" 
                            num={index + 1} 
                            hour={step.hour} 
                            min={step.min} 
                            desc={step.desc} 
                            handleDelete={() => removeCookStep(step.key)} 
                            handleHourChange={(e) => cookStepChange(e, step.key, "hour")}
                            handleMinChange={(e) => cookStepChange(e, step.key, "min")}
                            handleDescChange={(e) => cookStepChange(e, step.key, "desc")}
                            handleFile1Change={(e) => cookStepChange(e, step.key, "file1")}
                            handleFile2Change={(e) => cookStepChange(e, step.key, "file2")}

                    />
                ))}               
            
                <button className="btn btn-primary add-step-btn" onClick={addCookStep}>
                    <span><i className="fa fa-plus"></i></span>
                    Add Step
                </button>
            </div>
            
            <div className="submit-msg">
              <div className='error-msg' style={{display: (!validRecipeName) ? "block" : "none"}}>Recipe Name cannot be empty</div>
              <div className='error-msg' style={{display: (!validCuisine) ? "block" : "none"}}>Invalid Cuisine</div>
              <div className='error-msg' style={{display: (!validPrepTime) ? "block" : "none"}}>Invalid Total Prep Time</div>
              <div className='error-msg' style={{display: (!validCookTime) ? "block" : "none"}}>Invalid Total Cook Time</div>
              <div className='error-msg' style={{display: (!validServings) ? "block" : "none"}}>Invalid Servings</div>
              <div className='error-msg' style={{display: (!validQuantity) ? "block" : "none"}}>Invalid Ingredient quantity</div>
            </div>

            <div className="divider"></div>
            <div className="d-flex justify-content-center create-btn-container">
                <button type="reset" className="btn btn-outline-primary reset-btn">
                    <span><i className="fa fa-refresh"></i></span>
                    Reset
                </button>

                <button type="submit" className="btn btn-primary confirm-btn" onClick={submitClicked}>
                    <span><i className="fa fa-check"></i></span>
                    Confirm
                </button>
            </div>
        </form>
    )
}

export default RecipeEdit;