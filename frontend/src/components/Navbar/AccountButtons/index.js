import genericImg from "../../../img/generic_profile.png";
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import "./style.css";
import { useContext } from "react";
import UserContext from "../../../contexts/userContext";

const AccountButtons = () => {

  const { isLoggedIn, firstName, lastName, email, phoneNumber, avatarURL } = useContext(UserContext);

  console.log("isLoggedIn: " + isLoggedIn)

  {/* show this if logged in */}
  if ( isLoggedIn ) {
    return (
      <>
      <Link to="create-recipe"><button class="btn btn-outline-primary me-2 mb-2 light-button" type="button" >Create Recipe</button></Link>
      <Dropdown align="end" className="my-recipes-dropdown">
        <Dropdown.Toggle variant="success" style={{color: "#ffffff", backgroundColor: "#5c3802", borderColor: "#5c3802"}} id="dropdown-basic">
          My Recipes
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <li><Link className="dropdown-item" to="/my-recipes">My Recipes</Link></li>
          <li><Link className="dropdown-item" to="/my-fav-recipes">My Likes</Link></li>
          <li><Link className="dropdown-item" to="/my-com-recipes">My Comments</Link></li>
          <li><Link className="dropdown-item" to="/my-rate-recipes">My Ratings</Link></li>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown align="end">
        <Dropdown.Toggle variant="success" style={{color: "#ffffff", backgroundColor: "#5c3802", borderColor: "#5c3802"}} id="dropdown-basic">
          Account
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div class="profile-img-wrapper d-flex justify-content-center">
            {
              avatarURL
                ? <img class="profile-img" src={avatarURL} width="100" />
                : <img class="profile-img" src={genericImg} width="100" />
            }
          </div>
          
          <div class="d-flex justify-content-center">
            <ul style={{listStyle: "none", padding: "0px"}}>
              <li><a class="dropdown-item disabled">{firstName} {lastName}</a></li>
            </ul>
          </div>
          <li><hr class="dropdown-divider" /></li>
          <li><Link className="dropdown-item" to="/shopping-list">Shopping List</Link></li>
          <li><Link className="dropdown-item" to="/edit">Edit Profile</Link></li>
          <li><hr class="dropdown-divider" /></li>
          <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
        </Dropdown.Menu>
      </Dropdown>
      </>
    )
  } else {
    {/* show a login button and register button if not logged in */}
    return(
      <>
      <Link to="signup"><button class="btn btn-outline-primary register-button me-2 mb-2 dark-button" type="button" >Register</button></Link>
      <Link to="login"><button class="btn btn-outline-primary me-2 mb-2 light-button" type="button" >Login</button></Link>
      </>
    )
  }
  
}


export default AccountButtons;