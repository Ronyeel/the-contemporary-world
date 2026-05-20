import React from "react";
import "./Button.css";

const Button = ({ children, variant = "primary", onClick, href, className = "" }) => {
  const buttonClass = `btn btn-${variant} ${className}`;

  if (href) {
    return (
      <a href={href} className={buttonClass}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
