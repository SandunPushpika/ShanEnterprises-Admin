import { jwtDecode } from "jwt-decode";

export const getStoredToken = () => {
    var accessToken = localStorage.getItem("accessToken");
    var refreshToken = localStorage.getItem("refreshToken");

    if(!accessToken || !refreshToken){
        return null;
    }

    return {
        accessToken,
        refreshToken
    }
}

export const storeToken = (accessToken, refreshToken) => {

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

export const decodedValues = () => {
    
    if(!getStoredToken()){
        return null;
    }
    
    const decodedValues = jwtDecode(getStoredToken().accessToken);
    return decodedValues;
}