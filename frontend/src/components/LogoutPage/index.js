import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../contexts/userContext';

const LogoutPage = () => {

    const navigate = useNavigate();
    const {setIsLoggedIn} = useContext(UserContext);

    useEffect(() => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("../", { replace: true });
    }, []);
}

export default LogoutPage
