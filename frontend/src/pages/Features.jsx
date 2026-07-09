import { useEffect, useState } from "react";

import AddFlagForm from "../components/AddFlagForm";
import FlagTable from "../components/FlagTable";
import FlagModal from "../components/FlagModal";

import { getFlags, createFlag } from "../services/api";

import "../styles/flag.css";

function Features() {

  const [flags,setFlags]=useState([]);

  const [open,setOpen]=useState(false);

  useEffect(()=>{

    loadFlags();

  },[]);

async function loadFlags() {
  console.log("loadFlags() called");

  try {
    const data = await getFlags();

    console.log("Received data:", data);

    setFlags(data);
  } catch (error) {
    console.error("Error while loading flags:", error);
  }
}

  async function handleAdd(flag){

    await createFlag(flag);

    loadFlags();

    setOpen(false);

  }

  const enabled=flags.filter(f=>f.enabled).length;

  const disabled=flags.length-enabled;

  return(

<div className="feature-page">

<div className="feature-top">

<div>

<p style={{ fontSize: '40px', fontWeight: '500' }}>Feature Flags</p>
<br></br>
<p>

Manage your application features professionally.

</p>

</div>

<button

className="create-btn"

onClick={()=>setOpen(true)}

>

+ Create Feature

</button>

</div>

<div className="stats-grid">

<div className="stat-card">

<h2>{flags.length}</h2>

<span>Total Flags</span>

</div>

<div className="stat-card">

<h2>{enabled}</h2>

<span>Enabled</span>

</div>

<div className="stat-card">

<h2>{disabled}</h2>

<span>Disabled</span>

</div>

<div className="stat-card">

<h2>

{new Set(flags.map(f=>f.owner_team)).size}

</h2>

<span>Teams</span>

</div>

</div>

<div className="card">

<div className="table-header">

<h2>Feature Flags</h2>

</div>

<FlagTable flags={flags}/>

</div>

<FlagModal

isOpen={open}

onClose={()=>setOpen(false)}

>

<AddFlagForm

onAdd={handleAdd}

/>

</FlagModal>

</div>

  );

}

export default Features;