import { createContext, useState } from "react";

export function useCreateRecipeContext() {

    var [baseRecipe, setBaseRecipe] = useState({
        name: "", id: null, focus: false
    });

    var [baseRecipeDropdown, setBaseRecipeDropdown] = useState([]);

    var [recipeName, setRecipeName] = useState("");

    var [cuisineList, setCuisineList] = useState([]);

    var [cuisine, setCuisine] = useState();

    var [dietList, setDietList] = useState([]);

    var [diets, setDiets] = useState([]);

    var [totalPrepHour, setTotalPrepHour] = useState();
    var [totalPrepMin, setTotalPrepMin] = useState();
    var [totalCookHour, setTotalCookHour] = useState();
    var [totalCookMin, setTotalCookMin] = useState();

    var [servings, setServings] = useState(1);

    var [ingredientList, setIngredientList] = useState({
        list: [{key: 0, quantity: "", unit: "", name: ""}], max_key: 0
    }, []);

    const [prepStepList, setPrepStepList] = useState({
        list: [{key: 0, type: "prep", hour: "", min: "", desc: ""}], max_key: 0
    }, []);

    const [cookStepList, setCookStepList] = useState({
        list: [{key: 0, type: "cook", hour: "", min: "", desc: ""}], max_key: 0
    }, []);


    return {
        baseRecipe,
        setBaseRecipe,
        baseRecipeDropdown,
        setBaseRecipeDropdown,
        recipeName,
        setRecipeName,
        cuisineList,
        setCuisineList,
        cuisine,
        setCuisine,
        dietList,
        setDietList,
        diets,
        setDiets,
        totalPrepHour,
        setTotalPrepHour,
        totalPrepMin,
        setTotalPrepMin,
        totalCookHour,
        setTotalCookHour,
        totalCookMin,
        setTotalCookMin,
        servings,
        setServings,
        ingredientList,
        setIngredientList,
        prepStepList,
        setPrepStepList,
        cookStepList,
        setCookStepList
    }
}

// const CreateRecipeContext = createContext({
//     baseRecipe: ,
//     setBaseRecipe,
//     baseRecipeDropdown,
//     setBaseRecipeDropdown,
//     recipeName,
//     setRecipeName,
//     cuisineList,
//     setCuisineList,
//     cuisine,
//     setCuisine,
//     dietList,
//     setDietList,
//     diets,
//     setDiets,
//     totalPrepHour,
//     setTotalPrepHour,
//     totalPrepMin,
//     setTotalPrepMin,
//     totalCookHour,
//     setTotalCookHour,
//     totalCookMin,
//     setTotalCookMin,
//     servings,
//     setServings,
//     ingredientList,
//     setIngredientList,
//     prepStepList,
//     setPrepStepList,
//     cookStepList,
//     setCookStepList
// })