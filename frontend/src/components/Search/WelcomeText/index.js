import { useContext } from "react"
import UserContext from "../../../contexts/userContext"

const WelcomeText = () => {
    const { firstName, lastName, isLoggedIn } = useContext(UserContext)

    if (isLoggedIn) {  // if logged in, show name
      return (<h3 class="mb-1 pb-2">Welcome {firstName} {lastName}! Looking for a recipe?</h3>)
    } else {  // just welcome
      return (<h3 class="mb-1 pb-2">Welcome! Looking for a recipe?</h3>)
    }
  
}

export default WelcomeText