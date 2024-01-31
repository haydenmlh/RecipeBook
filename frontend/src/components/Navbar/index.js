import { Link, Outlet } from "react-router-dom";
import './style.css';
import logo from "../Common/img/easy-chef-logo-only-simple.png";
import AccountButtons from './AccountButtons/index.js';
import footerLogo from '../../components/Common/img/easy-chef-logo-only.png';
import { useContext, useEffect } from "react";
import UserContext from "../../contexts/userContext";
import axios from 'axios';

const Layout = () => {

  const { isLoggedIn, 
          setIsLoggedIn, 
          setFirstName, 
          setLastName, 
          setEmail, 
          setPhoneNumber, 
          setAvatarURL,
          setUserId } = useContext(UserContext);

  useEffect(() => {
    let accessToken = localStorage.getItem('access-token');
    const headers_obj = {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    }
    const url = `http://127.0.0.1:8000/recipes/user/likes/`;
    

    fetch(url, headers_obj)
    .then(response => response.json())
    .then(json => {
        console.log(Date(), json.results);
        if (json.results) {
          setIsLoggedIn(true)
        }
    })
    .catch((e) => {
      console.log(e)
      setIsLoggedIn(false)
    })
    .then(
      async () => {
        let user_id = localStorage.getItem('user-id');
        let accessToken = localStorage.getItem('access-token');
        const get_profile_url = `http://127.0.0.1:8000/accounts/api/${user_id}/profile`;
        await axios.get(get_profile_url, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            console.log(response);
            setUserId(user_id)
            setFirstName(response.data.user.first_name);
            setLastName(response.data.user.last_name);
            setEmail(response.data.user.email);
            setPhoneNumber(response.data.phone_number);
            setAvatarURL(response.data.avatarURL);
        })
    })
  }, []);

  return (
      <>
          <nav class="navbar navbar-expand-sm bg-body-tertiary justify-content-center" style={{padding: "5px 0px 0px 0px"}}>
            <div class="container-fluid" >
              <Link to="/" className="d-flex mx-auto" style={{ textDecoration: 'none' }}>
                <img src={logo} height='45' style={{paddingRight: '10px', }} alt="logo" />
                <p class="navbar-brand mx-auto fs-3 pb-0 title-text" to="/" >recipe book</p>
              </Link>
              
              
              <div class="d-flex w-100 ms-auto">
                <ul class="navbar-nav ms-auto">
                    <AccountButtons />
                </ul>
              </div>
            </div>
          </nav>
          <div class="container-fluid">
            <Outlet />
          </div>
          {/* <!-- Footer --> */}
          <div class="d-flex justify-content-center">
            <div class="d-flex my-2 align-items-end justify-content-end" style={{width: "min(95%, 1400px)"}}>
              <p class="my-0 mb-1">© 2023 RecipeBook</p>
              <img class="m-2" src={footerLogo} style={{height:"75px"}} />
            </div>
          </div>
      </>
  )
}

export default Layout