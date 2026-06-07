import { createContext, useEffect, useState } from "react";
import { decodedValues, getStoredToken } from "../utils/TokenHelper";
import {login} from "../services/AuthService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenDetails, setTokenDetails] = useState();

    const loginUser = async (email, password) => {

        const result = await login(email, password);
        if (result.success) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        return result;
    }

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    }

    useEffect(() => {

        const tokens = getStoredToken();
        setIsAuthenticated(!!tokens);

        const values = decodedValues();
        setTokenDetails(values);
        setIsLoading(false);

    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                tokenDetails,
                loginUser,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;