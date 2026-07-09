import { useState } from "react";
import { createFlag } from "../services/api";

export default function FlagForm({ onSuccess }) {

    const [form,setForm]=useState({

        key:"",
        description:"",
        owner_team:"",
        enabled:true

    });

    const handleSubmit=async(e)=>{

        e.preventDefault();

        await createFlag(form);

        onSuccess();

    };

    return(

        <form onSubmit={handleSubmit}>

            <h2>Create Feature Flag</h2>

            <br/>

            <input
                placeholder="Feature Key"
                value={form.key}
                onChange={(e)=>setForm({...form,key:e.target.value})}
            />

            <br/><br/>

            <textarea

                placeholder="Description"

                value={form.description}

                onChange={(e)=>setForm({...form,description:e.target.value})}

            />

            <br/><br/>

            <input

                placeholder="Owner Team"

                value={form.owner_team}

                onChange={(e)=>setForm({...form,owner_team:e.target.value})}

            />

            <br/><br/>

            <label>

                <input

                    type="checkbox"

                    checked={form.enabled}

                    onChange={(e)=>setForm({...form,enabled:e.target.checked})}

                />

                Enabled

            </label>

            <br/><br/>

            <button>

                Create Flag

            </button>

        </form>

    );

}