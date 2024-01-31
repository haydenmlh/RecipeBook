import React, { useState, useContext, useCallback, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import UserContext from "../../contexts/userContext";
import ShoppingListRecipeCard from '../../components/ShoppingListRecipeCard';

const ShoppingListPage = () => {

    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);
    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        let accessToken = localStorage.getItem('access-token');
        const get_shopping_list_url = `http://127.0.0.1:8000/recipes/shoppingList/info/`;

        if(isLoggedIn){
            fetch(get_shopping_list_url, {
                headers: {
                    "Authorization" : `Bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(json => {
                setIngredients(json.shopping_list);
                setRecipes(json.recipes);
                setShoppingList(json.shopping_list_objects);
            })
            .catch((e) => console.log(e))

        }
        else{
            navigate("../login", { replace: true });
        }
        
    }, []);

    return(
        <>
        
        <h1 class="fs-1 shopping-list-title">Shopping List</h1>
        <div class="d-flex justify-content-center">
            <div className="recipes-container">
                <div class="shopping-list-recipes">
      
                    {recipes.map((recipe, index) => (
                        

                        <ShoppingListRecipeCard 
                            key={recipe.id}
                            recipeId={recipe.id}
                            img={recipe.img}
                            name={recipe.name} 
                            likes={recipe.likes} 
                            rating={recipe.rating} 
                            numRatings={recipe.numRatings} 
                            duration={recipe.duration}
                            shoppingListId={shoppingList.find(keyValuePair => keyValuePair.recipe === recipe.id)["id"]}
                            servingSize={shoppingList.find(keyValuePair => keyValuePair.recipe === recipe.id)["servingSize"]}
                            setRecipes={setRecipes}
                            setIngredients={setIngredients}
                            setShoppingList={setShoppingList}
                        />
                    ))}

                </div>
            </div>

            <div className="ingredients-table-container">
                <div className="card ingredient-list">
                    <div className="signup-title"><div>Ingredients</div></div>
                    <div class="card-body" >
                        <div class="row gx-3 mb-3">
                            <div class="col-md-4">
                                <h5 class="card-title m-0">Quantity</h5>
                                <div class="divider"></div>
                                {ingredients.map((item, index) => (
                                    <div key={index}>{item[1]}</div>
                                ))}
                            </div>
                            <div class="col-md-4">
                                <h5 class="card-title m-0">Units</h5>
                                <div class="divider"></div>
                                {ingredients.map((item, index) => (
                                    <div key={index}>{item[2]}</div>
                                ))}
                            </div>
                            <div class="col-md-4">
                                <h5 class="card-title m-0">Name</h5>
                                <div class="divider"></div>
                                {ingredients.map((item, index) => (
                                    <div key={index}>{item[0]}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>
    );


}

export default ShoppingListPage