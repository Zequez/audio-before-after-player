import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ className, ...rest }) => {
  const classes = classNames(
    "bg-saffron text-night/70 text-shadow-white uppercase px-4 py-2 rounded-md font-bold hover:bg-saffron/80",
    className
  );

  return <button {...rest} className={classes} />;
};

export default Button;
