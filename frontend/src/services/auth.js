const API_URL = "http://127.0.0.1:8000";


// ================================
// Register
// ================================

export async function registerUser(data) {

    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(data)
        }
    );


    const result = await response.json();


    if(!response.ok){
        throw new Error(
            result.detail || "Registration failed"
        );
    }


    return result;
}



// ================================
// Login
// ================================

export async function loginUser(
    email,
    password
){

    const formData = new URLSearchParams();

    formData.append(
        "username",
        email
    );

    formData.append(
        "password",
        password
    );


    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method:"POST",
            headers:{
                "Content-Type":
                "application/x-www-form-urlencoded"
            },
            body:formData
        }
    );


    const result = await response.json();


    if(!response.ok){

        throw new Error(
            result.detail || "Login failed"
        );

    }


    return result;
}



// ================================
// Current User
// ================================

export async function getCurrentUser(token){

    const response = await fetch(
        `${API_URL}/auth/me`,
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );


    if(!response.ok){

        throw new Error(
            "Failed to fetch user"
        );

    }


    return response.json();

}