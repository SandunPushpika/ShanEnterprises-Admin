import { createContext, useEffect, useState } from "react";
import { decodedValues, getStoredToken } from "../utils/TokenHelper";
import {login} from "../services/AuthService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenDetails, setTokenDetails] = useState();

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setTokenDetails(null);
    }

    const loginUser = async (email, password) => {
        const result = await login(email, password);
        if (result.success) {
            const values = decodedValues();
            const role = values ? values["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
            if (role === "ADMIN") {
                setIsAuthenticated(true);
                setTokenDetails(values);
            } else {
                logoutUser();
                return {
                    success: false,
                    message: "Access denied. Only administrators are allowed."
                };
            }
        } else {
            setIsAuthenticated(false);
            setTokenDetails(null);
        }

        return result;
    }

    useEffect(() => {
        const tokens = getStoredToken();
        const values = decodedValues();

        if (tokens && values) {
            const role = values["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            if (role === "ADMIN") {
                setIsAuthenticated(true);
                setTokenDetails(values);
            } else {
                logoutUser();
            }
        } else {
            logoutUser();
        }
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