import axiosInstance from "../utils/RequestHelper"
import { storeToken } from "../utils/TokenHelper";

export const login = async (username, password) => {

    try {
        const response = await axiosInstance.post("/api/Auth/login", {
            email: username,
            password: password
        });

        if (response?.status === 200 && response.data.data.accessToken && response.data.data.refreshToken && response.data.success) {
            if(response.data.data.userRole !== 0){
                return {
                    success: false,
                    message: "Unauthorized access"
                };
            }

            storeToken(response.data.data.accessToken, response.data.data.refreshToken);
            return {
                success: true,
                message: "Successfully logged in"
            };
        }

        return {
            success: false,
            message: "Invalid Credentials"
        };
    } catch (error) {
        console.log("Login error:", error);
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || "Login failed"
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred"
        };
    }
}

export const register = async (firstname,lastname,email,password, keycode) => {

    try {
        const response = await axiosInstance.post("/api/Auth/register", {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            keycode: keycode,
            role: 0
        });

        if (response?.status === 201 || response?.status === 200) {
            return {
                success: true,
                message: ""
            }
        }

        return {
            success: false,
            message: "Invalid response from server"
        };
    } catch (error) {
        console.log("Registration error:", error);
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || "Registration failed"
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred"
        };
    }
}

export const verifyUser = async (email, code) => {

    try{

        const response = await axiosInstance.get(`/api/Auth/verify-code?code=${code}`);
        if(response.status == 200){
            return {
                success: true,
                message: "User verified"
            }
        }


        return {
            success: false,
            message: "Invalid response from server"
        };
    }catch(error){
        
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || "Verification failed"
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred"
        };

    }

}