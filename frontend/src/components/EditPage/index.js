import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import FormInput from './FormInput';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../contexts/userContext';

const EditPage = () => {

    const {setFirstName, setLastName, setAvatarURL, setPhoneNumber, setEmail} = useContext(UserContext)

    const [values, setValues] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    });

    const [avatar, setAvatar] = useState(null);
    const [profileID, setProfileID] = useState();

    useEffect(() => {
        const user_id = localStorage.getItem('user-id');
        let accessToken = localStorage.getItem('access-token');
        const get_profile_url = `http://127.0.0.1:8000/accounts/api/${user_id}/profile`;

        fetch(get_profile_url, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setValues({
                first_name: json.user.first_name,
                last_name: json.user.last_name,
                email: json.user.email,
                phone_number: json.phone_number
            });
            setAvatar(json.avatar);
            setProfileID(json.id);
        })
    }, []);

    const navigate = useNavigate();

    const inputs = [
        {
            id: 1,
            name: "first_name",
            type: "text",
            placeholder: "John",
            label: "First Name",
            errormessage: ""
        },
        {
            id: 2,
            name: "last_name",
            type: "text",
            placeholder: "Smith",
            label: "Last Name",
            errormessage: ""
        },
        {
            id: 3,
            name: "email",
            type: "email",
            placeholder: "example@utm.com",
            label: "Email",
            errormessage: "Please enter a valid email address",
            pattern: "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
        },
        {
            id: 4,
            name: "phone_number",
            type: "text",
            placeholder: "+11111111111",
            label: "Phone Number",
            errormessage: "Please enter a valid phone number",
            pattern: "^[0-9]{10}$"
        }
    ]

    let form_data = new FormData();
    form_data.append("user.first_name", values.first_name)
    form_data.append("user.last_name", values.last_name)
    form_data.append("user.email", values.email)
    form_data.append("phone_number", values.phone_number)
    form_data.append("avatar", "")

    async function handleSubmit(e){
        e.preventDefault();

        form_data.set("avatar", avatar)

        console.log(form_data.get("avatar"))

        if (!form_data.get("avatar") 
              || form_data.get("avatar") == "null" 
              || typeof(form_data.get("avatar")) == "string") {
          form_data.delete('avatar')
        }

        for (var pair of form_data.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
        }
        

        let accessToken = localStorage.getItem('access-token');
        const url = `http://127.0.0.1:8000/accounts/api/update/${profileID}`

        await axios.patch(url, form_data, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            }
        })
        .then(function (response) {
            console.log(response.data)
            setAvatarURL(response.data.avatarURL);
            setFirstName(values.first_name);
            setLastName(values.last_name);
            setEmail(values.email);
            setPhoneNumber(values.phone_number);
            navigate("../", { replace: true });
        })
        .catch(function(e){
            console.log(e);
        })
    };

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const onChangeAvatar = (e) => {
        setAvatar(e.target.files[0])
    }

    return (
        <div className="container-lg">
            <div className="row justify-content-center">
                <div className="col-6">
                    <div className="card">
                        <div className="edit-title"><div>Edit Information</div></div>
                        <div className="card-body">
                            <form onSubmit = {handleSubmit}>
                            <div className="row gx-3">
                                <div className="col-md-6">
                                    <FormInput 
                                    key={inputs[0].id} 
                                    {...inputs[0]} 
                                    value={values[inputs[0].name]}
                                    onChange = {onChange}/>
                                </div>
                                <div className="col-md-6">
                                    <FormInput 
                                    key={inputs[1].id} 
                                    {...inputs[1]} 
                                    value={values[inputs[1].name]}
                                    onChange = {onChange}/>
                                </div>
                                </div>
                                <FormInput 
                                    key={inputs[2].id} 
                                    {...inputs[2]} 
                                    value={values[inputs[2].name]}
                                    onChange = {onChange}/>
                                <FormInput 
                                    key={inputs[3].id} 
                                    {...inputs[3]} 
                                    value={values[inputs[3].name]}
                                    onChange = {onChange}/>
                                <div className="mb-3">
                                    <label className="form-label">Choose Avatar</label>
                                    <input className="form-control" type="file" id="avatar" onChange={onChangeAvatar}/>
                                </div>
                                <div className="btn-container">
                                    <button id="register-button" className="btn btn-primary" type="submit">Save</button>
                                    <div className="already-login">Changed your mind? <Link to="/">Cancel</Link></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditPage;
