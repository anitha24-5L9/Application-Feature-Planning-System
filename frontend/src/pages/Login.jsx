import {useState,useContext} from "react";
import {Link,useNavigate} from "react-router-dom";

import {loginUser} from "../services/auth";
import {AuthContext} from "../context/AuthContext";

import "../styles/auth.css";


export default function Login(){

const navigate = useNavigate();

const {login}=useContext(AuthContext);


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [error,setError]=useState("");



async function handleSubmit(e){

e.preventDefault();


try{

const data=await loginUser(
email,
password
);


login(data.access_token);


navigate("/");


}

catch(err){

setError(err.message);

}


}



return (

<div className="auth-page">


<div className="auth-box">


<div className="auth-left">

<h2>
Application Feature Planning and Release Governance System
</h2>


<p>
Plan, manage and release features safely
</p>


<div className="welcome-card">
    <h3>🚀 Welcome</h3>

    <p>
        Manage feature flags, releases, environments,
        and audit logs from one place.
    </p>
</div>


</div>



<div className="auth-right">


<div className="switch">

<Link className="active">
Sign In
</Link>

<Link to="/register">
Sign Up
</Link>

</div>



<h1>
Sign In
</h1>



{
error &&
<p className="error-message">
{error}
</p>
}



<form onSubmit={handleSubmit}>


<input

className="auth-input"

type="email"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>



<input

className="auth-input"

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



<p className="forgot">
Forgot Password?
</p>



<button className="auth-button">

Sign In →

</button>



</form>



<div className="social">

<span>G</span>
<span>f</span>
<span>𝕏</span>
<span>◉</span>

</div>



</div>


</div>


</div>


)

}