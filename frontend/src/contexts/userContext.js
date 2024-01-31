import { createContext, useState } from "react";

export const useUserContext = () => {
    const [token, setToken] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarURL, setAvatarURL] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userId, setUserId] = useState(-1)
    const [pass, setPass] = useState(false);
    

    return {
        isLoggedIn, setIsLoggedIn,
        firstName, setFirstName,
        lastName, setLastName,
        email, setEmail,
        avatarURL, setAvatarURL,
        phoneNumber, setPhoneNumber,
        userId, setUserId,
        pass, setPass,
    }
} 

const UserContext = createContext({
    token: null, 
    setToken: () => {},
    isLoggedIn: null,
    setIsLoggedIn: () => {},
    firstName: null,
    setFirstName: () => {},
    lastName: null,
    setLastName: () => {},
    email: null,
    setEmail: () => {},
    avatarURL: null,
    setAvatarURL: () => {},
    phoneNumber: null,
    setPhoneNumber: () => {},
    userId: null, 
    setUserId: () => {},
    pass: null, setPass: () => {},
})

export default UserContext;