import { useContext, useState } from "react";

import { EnvironmentContext } from "../context/EnvironmentContext";

import { AuthContext } from "../context/AuthContext";

import "./../styles/navbar.css";


export default function Navbar() {


  const {
    environment,
    setEnvironment
  } = useContext(EnvironmentContext);



  const {
    user,
    logout
  } = useContext(AuthContext);



  const [openProfile, setOpenProfile] = useState(false);



  return (

<header className="navbar">


<div className="nav-left">

<h2 className="nav-title">

🚀 Feature Governance System

</h2>

</div>





<div className="nav-right">



<input

className="search-box"

type="text"

placeholder="Search features..."

 />





<select

value={environment}

onChange={
(e)=>setEnvironment(e.target.value)
}

className="env-select"

>


<option>
Development
</option>


<option>
Testing
</option>


<option>
Production
</option>


</select>





<div className="user-section">



{/* Profile Circle */}

<div

className="profile-circle"

onClick={
()=>setOpenProfile(!openProfile)
}

>


{
user?.name
?
user.name.charAt(0).toUpperCase()
:
"A"
}


</div>






{/* Profile Dropdown */}

{

openProfile && (


<div className="profile-panel">


<h3>

{
user?.name || "User"
}

</h3>



<p>

<strong>
Actor:
</strong>

<br/>

{
user?.email || "user@email.com"
}

</p>




<p>

<strong>
Role:
</strong>

<br/>

{
user?.role || "Developer"
}

</p>




<button

className="logout-button"

onClick={logout}

>

Logout

</button>



</div>


)

}



</div>




</div>



</header>


  );

}