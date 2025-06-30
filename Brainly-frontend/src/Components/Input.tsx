function Input({  placeholder,ref }: {placeholder:string; ref?:any}) {
  return (
    <div>
      <input
        ref={ref}
        placeholder={placeholder}
        type="text"
        className="px-4 border rounded-md m-2 py-2"
        
      ></input>
    </div>
  );
}
export default Input;