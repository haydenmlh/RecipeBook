import FormInput from './FormInput';
import './style.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignUpForm = () => {

    const [values, setValues] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: ""
    });

    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const inputs = [
        {
            id: 1,
            name: "username",
            type: "text",
            placeholder: "john_smith",
            label: "Username",
            errormessage: "Username must be at least 6 characters long and should not include any special characters",
            required: true,
            pattern: "^[A-Za-z0-9]{6,}$"
        },
        {
            id: 2,
            name: "first_name",
            type: "text",
            placeholder: "John",
            label: "First Name",
            errormessage: ""
        },
        {
            id: 3,
            name: "last_name",
            type: "text",
            placeholder: "Smith",
            label: "Last Name",
            errormessage: ""
        },
        {
            id: 4,
            name: "email",
            type: "email",
            placeholder: "example@utm.com",
            label: "Email",
            errormessage: "Please enter a valid email address",
            pattern: "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
        },
        {
            id:5,
            name: "phone_number",
            type: "tel",
            placeholder: "+11111111111",
            label: "Phone Number",
            errormessage: "Please enter a valid phone number",
            pattern: "^[0-9]{10}$"
        },
        {
            id: 6,
            name: "password",
            type: "password",
            placeholder: " ",
            label: "Password",
            errormessage: "Password must be at least 8 characters long and include: at least one digit, one lowercase letter, one uppercase letter, and one special sign",
            required: true,
            pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        },
        {
            id: 7,
            name: "confirm_password",
            type: "password",
            placeholder: " ",
            label: "Confirm Password",
            errormessage: "Passwords don't match",
            pattern: values.password,
            required: true
        }
    ]

    let form_data = new FormData();
    form_data.append("user.username", values.username)
    form_data.append("user.first_name", values.first_name)
    form_data.append("user.last_name", values.last_name)
    form_data.append("user.email", values.email)
    form_data.append("user.password", values.password)
    form_data.append("phone_number", values.phone_number)
    form_data.append("avatar", avatar)


    
      

    async function handleSubmit(e){
        e.preventDefault();

        console.log(form_data.get("avatar"));

        if (!form_data.get("avatar") || form_data.get("avatar") == "null") {
            form_data.delete('avatar')
        }

        const url = "http://127.0.0.1:8000/" + "accounts/api/register/";
        
        axios.post(url, form_data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .then(function (response) {
            navigate("../login", { replace: true });
        })
        .catch(function(e){
          console.log(e);
            if(e.response.status === 400){
                setError("User with that username already exists");
            }
        })
        setError("");
    };

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const onChangeAvatar = (e) => {
        console.log(e.target.files[0]);
        setAvatar(e.target.files[0]);
    }

    
    return (
    
    <div className="container-lg">
        <div className="row justify-content-center">
            <div className="col-6">
                <div className="card">
                    <div className="signup-title"><div>Register</div></div>
                    <div className="card-body">
                        <div className='username-error'>{error}</div>
                        <form onSubmit = {handleSubmit}>
                            <FormInput 
                            key={inputs[0].id} 
                            {...inputs[0]} 
                            value={values[inputs[0].name]}
                            onChange = {onChange}/>
                            <div className="row gx-3">
                                <div className="col-md-6">
                                    <FormInput 
                                    key={inputs[1].id} 
                                    {...inputs[1]} 
                                    value={values[inputs[1].name]}
                                    onChange = {onChange}/>
                                </div>
                                <div className="col-md-6">
                                    <FormInput 
                                    key={inputs[2].id} 
                                    {...inputs[2]} 
                                    value={values[inputs[2].name]}
                                    onChange = {onChange}/>
                                </div>
                            </div>
                            <FormInput 
                            key={inputs[3].id} 
                            {...inputs[3]} 
                            value={values[inputs[3].name]}
                            onChange = {onChange}/>
                            <FormInput 
                            key={inputs[4].id} 
                            {...inputs[4]} 
                            value={values[inputs[4].name]}
                            onChange = {onChange}/>
                            <FormInput 
                            key={inputs[5].id} 
                            {...inputs[5]} 
                            value={values[inputs[5].name]}
                            onChange = {onChange}/>
                            <FormInput 
                            key={inputs[6].id} 
                            {...inputs[6]} 
                            value={values[inputs[6].name]}
                            onChange = {onChange}/>
                            <div className="mb-3">
                            <label className="form-label">Choose Avatar</label>
                                <input className="form-control" type="file" id="avatar" onChange={onChangeAvatar}/>
                            </div>
                            <div className="btn-container">
                                <button id="register-button" className="btn btn-primary" type="submit">Sign Up</button>
                                <div className="already-login">Already have an account? <Link to="/login">Login now</Link></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
    
}

export default SignUpForm
