import React from "react";
import "./Select.scss";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  name,
  id,
  required = false,
}) => {
  return (
    <div className={`select-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={id || name} className="select-label">
          {label}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="custom-select"
        >
          <option value="" disabled>
            --
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Select;
