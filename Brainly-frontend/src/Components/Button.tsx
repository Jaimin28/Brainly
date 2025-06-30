import type { ReactElement } from "react";
type variants = "primary" | "secondary";
interface ButtonProps {
  variant: variants;
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  lodaing?:boolean

}
// for making any attribute we use ? for optional

// const variantStyles ={
//     "primary":"bg-purple-600 text-white",
//     "secondary":"bg-purple-400 text-purple-600"
// }
const sizestyles = {
  sm: "py-1 px-2",
  md: "py-2 px-4",
  lg: "py-3 px-6",
};
export const Button = (props: ButtonProps) => {
  const sizeClass = sizestyles[props.size];
  return (
    <button
      onClick={props.onClick}
      className={`rounded-md font-bold gap-2 flex m-2  
  ${props.fullWidth ? "w-full justify-center" : "justify-between"} 
  ${props.lodaing ? "opacity-50":""}
  
  items-center ${sizeClass} 
  ${
    props.variant === "primary"
      ? " bg-purple-600 text-white "
      : "bg-purple-300 text-purple-600"
  }`}
    >
      {props.startIcon}
      {props.text}
    </button>
  );
};
