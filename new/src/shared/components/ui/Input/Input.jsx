import React from "react";
import "./Input.scss";

const Input = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  name,
  id,
  icon,
  required = false,
}) => {
  return (
    <div className={`input-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={id || name} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={id || name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="custom-input"
        />
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
