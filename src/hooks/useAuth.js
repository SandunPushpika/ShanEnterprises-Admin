import { useContext } from "react"
import { AuthContext } from "../context/AuthProvider";

const useAuth = () => {
    const authContext = useContext(AuthContext);
    if(!authContext){
        throw new Error("useAuth can be used only inside the children of AuthProvider");
    }

    return authContext;
}

export default useAuth;