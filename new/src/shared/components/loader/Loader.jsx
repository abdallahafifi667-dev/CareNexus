import React from "react";
import "./Loader.scss";

const Loader = ({ loading }) => {
  return (
    <div className={`loader-overlay ${!loading ? "fade-out" : ""}`}>
      <div className="loader-content">
        <div className="pulse-logo">
          <svg viewBox="0 0 100 100" className="pulse-svg">
            <circle cx="50" cy="50" r="48" className="outer-circle" />
            <circle cx="50" cy="50" r="35" className="inner-circle" />
            <path
              d="M20,50 L40,50 L45,30 L55,70 L60,50 L80,50"
              className="pulse-line"
            />
          </svg>
          <h1 className="brand-text">CareNexus</h1>
        </div>
      </div>
    </div>
  );
};

export default Loader;
