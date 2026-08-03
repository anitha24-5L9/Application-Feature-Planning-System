import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";

import {registerUser} from "../services/auth";

import "../styles/auth.css";


export default function Register(){

const navigate=useNavigate();


const [form,setForm]=useState({

name:"",
email:"",
password:""

});


const [error,setError]=useState("");



function handleChange(e){

setForm({

...form,

[e.target.name]:e.target.value

});


}



async function handleSubmit(e){

e.preventDefault();


try{


await registerUser(form);


navigate("/login");


}

catch(err){

setError(err.message);

}


}



return(

<div className="auth-page">


<div className="auth-box">



<div className="auth-left">


<h2>
Application Feature Planning and Release Governance System
</h2>


<p>
Create your account and start managing releases
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


<Link to="/login">
Sign In
</Link>


<Link className="active">
Sign Up
</Link>


</div>


<h1>
Create Account
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

name="name"

placeholder="Full Name"

onChange={handleChange}

/>



<input

className="auth-input"

name="email"

placeholder="Email"

type="email"

onChange={handleChange}

/>



<input

className="auth-input"

name="password"

placeholder="Password"

type="password"

onChange={handleChange}

/>




<button className="auth-button">

Sign Up →

</button>


</form>


</div>


</div>


</div>

)

}