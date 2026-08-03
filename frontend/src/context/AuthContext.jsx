import {
    createContext,
    useState,
    useEffect
}
from "react";


import {
    getCurrentUser
}
from "../services/auth";


export const AuthContext =
createContext();



export function AuthProvider({children}){


    const [user,setUser]=useState(null);

    const [token,setToken]=useState(
        localStorage.getItem("token")
    );


    useEffect(()=>{

        if(token){

            getCurrentUser(token)
            .then(data=>{
                setUser(data);
            })
            .catch(()=>{

                logout();

            });

        }

    },[token]);




    function login(token){

        localStorage.setItem(
            "token",
            token
        );

        setToken(token);

    }




    function logout(){

        localStorage.removeItem(
            "token"
        );

        setToken(null);

        setUser(null);

    }



    return(

        <AuthContext.Provider
        value={{
            user,
            token,
            login,
            logout
        }}
        >

        {children}

        </AuthContext.Provider>

    );

}