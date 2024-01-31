import genericImage from "../../../img/generic-dish.png"

const RecipeCardImage = ({ img }) => {
  if (img) {
    return <img src={img} class="card-img-top" alt="Dish" />
  } else {
    return <img src={genericImage} class="card-img-top" alt="Dish" />
  }
}


export default RecipeCardImage;