import { useState, useEffect } from "react";
function AddFlagForm({
  onAdd,
  onUpdate,
  editFlag,
  onCancel
}) {
  const initialState = {
    key: "",
    owner_team: "",
    description: "",
    default_value: "",
    type: "boolean",
    enabled: true,
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {

  if (editFlag) {

    setForm({
      key: editFlag.key,
      owner_team: editFlag.owner_team,
      description: editFlag.description || "",
      default_value: editFlag.default_value,
      type: editFlag.type,
      enabled: editFlag.enabled,
    });

  } else {

    setForm(initialState);

  }

}, [editFlag]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

 function handleSubmit(e) {

  e.preventDefault();

  if (editFlag) {

    onUpdate(form);

  } else {

    onAdd(form);

    setForm(initialState);

  }

}

  return (
    <form className="flag-form" onSubmit={handleSubmit}>

      <div className="form-grid">

        <div className="form-group">

          <label>Feature Key</label>

          <input
type="text"
name="key"
readOnly={!!editFlag}
            value={form.key}
            onChange={handleChange}
            placeholder="payment_gateway"
            required
          />

        </div>

        <div className="form-group">

          <label>Owner Team</label>

          <input
            type="text"
            name="owner_team"
            value={form.owner_team}
            onChange={handleChange}
            placeholder="Platform Team"
            required
          />

        </div>

        <div className="form-group">

          <label>Flag Type</label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="boolean">Boolean</option>
            <option value="string">String</option>
            <option value="number">Number</option>
          </select>

        </div>

        <div className="form-group">

          <label>Default Value</label>

          <input
            type="text"
            name="default_value"
            value={form.default_value}
            onChange={handleChange}
            placeholder="true"
          />

        </div>

      </div>

      <div className="form-group">

        <label>Description</label>

        <textarea
          rows="4"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe this feature..."
        />

      </div>

      <div className="toggle-row">

        <label className="toggle-label">

          <input
            type="checkbox"
            name="enabled"
            checked={form.enabled}
            onChange={handleChange}
          />

          <span>Enable Feature</span>

        </label>

      </div>

      <div className="button-row">

<button
className="primary-btn"
type="submit"
>
{editFlag ? "Update Feature" : "Create Feature"}
</button>

{editFlag && (

<button
type="button"
className="secondary-btn"
onClick={onCancel}
>

Cancel

</button>

)}

</div>

    </form>
  );
}

export default AddFlagForm;