import { useEffect, useState } from "react";
import { getFlags } from "../services/api";
import "../styles/dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


export default function Dashboard() {


  const COLORS = ["#10b981", "#ef4444"];

  const [flags, setFlags] = useState([]);


  useEffect(() => {

    loadFlags();

  }, []);



  async function loadFlags(){

    try{

      const data = await getFlags();

      setFlags(data);

    }
    catch(error){

      console.error(
        "Error loading flags:",
        error
      );

    }

  }




  // Statistics

  const totalFlags = flags.length;


  const enabledFlags =
    flags.filter(
      flag => flag.enabled
    ).length;


  const disabledFlags =
    totalFlags - enabledFlags;



  const teams =
    new Set(
      flags
      .map(flag => flag.owner_team)
      .filter(Boolean)
    ).size;



  // Pie chart data

  const statusData = [

    {
      name:"Enabled",
      value:enabledFlags
    },

    {
      name:"Disabled",
      value:disabledFlags
    }

  ];




  // Team bar chart data

  const teamMap = {};


  flags.forEach(flag=>{


    const team =
      flag.owner_team || "Unknown";


    teamMap[team] =
      (teamMap[team] || 0) + 1;


  });



  const teamData =
    Object.entries(teamMap)
    .map(([team,count])=>({

      team,
      flags:count

    }));




return (

<div className="dashboard">


{/* Header */}

<div className="dashboard-header">

<div>

<h1>
Feature Flag Dashboard
</h1>


<p>
Welcome to the Feature Flag Management System
</p>


</div>

</div>




{/* Statistics */}

<div className="stats-grid">


<div className="stat-card">

<div className="stat-title">
Total Flags
</div>

<div className="stat-number">
{totalFlags}
</div>

</div>




<div className="stat-card">

<div className="stat-title">
Enabled
</div>

<div className="stat-number">
{enabledFlags}
</div>

</div>




<div className="stat-card">

<div className="stat-title">
Disabled
</div>

<div className="stat-number">
{disabledFlags}
</div>

</div>




<div className="stat-card">

<div className="stat-title">
Teams
</div>

<div className="stat-number">
{teams}
</div>

</div>


</div>






{/* Charts */}

<div className="dashboard-charts">



<div className="chart-card">

<h3>
Feature Status
</h3>


<ResponsiveContainer
width="100%"
height={300}
>


<PieChart>


<Pie

data={statusData}

dataKey="value"

innerRadius={60}

outerRadius={100}

paddingAngle={5}

label

>


{
statusData.map(
(entry,index)=>(

<Cell

key={index}

fill={COLORS[index]}

/>

)

)
}


</Pie>


<Tooltip/>


</PieChart>


</ResponsiveContainer>


</div>







<div className="chart-card">


<h3>
Flags by Team
</h3>


<ResponsiveContainer

width="100%"

height={300}

>


<BarChart data={teamData}>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="team"
/>


<YAxis/>


<Tooltip/>


<Bar

dataKey="flags"

fill="#6366f1"

radius={[8,8,0,0]}

/>


</BarChart>


</ResponsiveContainer>


</div>



</div>









{/* Bottom Section */}


<div className="dashboard-grid">





{/* Recent Activity */}


<div className="panel">


<h2>
Recent Activity
</h2>



{

flags.length===0 ?

<p>
No feature flags found.
</p>


:


flags.slice(0,5)
.map(flag=>(


<div

className="activity-item"

key={flag.key}

>


<span className="activity-text">


{
flag.enabled
?
"🟢 Enabled"
:
"🔴 Disabled"
}

{" - "}

{flag.key}


</span>


</div>


))


}



</div>









{/* Right Side */}


<div>



<div className="panel">


<h2>
Quick Actions
</h2>


<button className="quick-btn">

➕ Create Feature

</button>



<button className="quick-btn">

⚡ Evaluate Flag

</button>



<button className="quick-btn">

📋 Audit Logs

</button>



</div>






<br></br>

<div className="panel status-panel">


<h2>
System Status
</h2>



<div className="status-item">

<span>
Backend
</span>

<span className="online">
🟢 Online
</span>

</div>





<div className="status-item">

<span>
Database
</span>

<span className="online">
🟢 Connected
</span>

</div>





<div className="status-item">

<span>
API
</span>

<span className="online">
🟢 Healthy
</span>

</div>




</div>



</div>





</div>





</div>


);


}