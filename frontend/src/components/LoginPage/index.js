import React, { useContext, useState } from 'react';
import './style.css';
import FormInput from './FormInput';
import logo from "./img/easy-chef-logo.png"
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../contexts/userContext';

const LoginPage = () => {

    const [values, setValues] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
    const {setFirstName, setLastName, setAvatarURL, setPhoneNumber, setEmail, avatarURL} = useContext(UserContext)

    const inputs = [
        {
            id: 1,
            name: "username",
            type: "text",
            placeholder: "john_smith",
            label: "Username",
            required: true
        },
        {
            id: 2,
            name:"password",
            type: "password",
            placeholder: " ",
            label: "Password",
            required: true
        }
    ]

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

    let form_data = new FormData();
    form_data.append("username", values.username)
    form_data.append("password", values.password)

    async function handleSubmit(e) {
        e.preventDefault();
        const url = "http://127.0.0.1:8000/" + "accounts/api/login/";
        
        axios.post(url, form_data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .then(function (response) {
            localStorage.setItem('access-token', response.data.access);
            localStorage.setItem('user-id', response.data.id);
            setIsLoggedIn(true);
            navigate("../", { replace: true });
        })
        .catch(function(e){
            if(e.response.status === 401){
                setError("Username or password is incorrect");
            }
        })
        .then(async () => {
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
                setFirstName(response.data.user.first_name);
                setLastName(response.data.user.last_name);
                setEmail(response.data.user.email);
                setPhoneNumber(response.data.phone_number);
                setAvatarURL(response.data.avatarURL);
            })
        })
        setError("");
    };

    return (
        <div className="container-lg">
            <div className="row justify-content-center">
                <img id="logo-img" src={logo} alt="Logo"/>
            </div>
            <div className="row justify-content-center">
                <div className="col-6">
                    <div className="card">
                        <div className="login-title"><div>Login</div></div>
                        <div className="card-body">
                            <div className='login-error'>{error}</div>
                            <form onSubmit = {handleSubmit}>
                                <FormInput 
                                key={inputs[0].id} 
                                {...inputs[0]} 
                                value={values[inputs[0].name]}
                                onChange = {onChange}/>
                                <FormInput 
                                key={inputs[1].id} 
                                {...inputs[1]} 
                                value={values[inputs[1].name]}
                                onChange = {onChange}/>
                                <div className="btn-container">
                                    <button id="login-button" className="btn btn-primary" type="submit">Login</button>
                                </div>
                            </form>
                            <div className="btn-container">
                                <div className="not-register">Don't have an account yet? <Link to="/signup">Sign Up</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default LoginPage;
