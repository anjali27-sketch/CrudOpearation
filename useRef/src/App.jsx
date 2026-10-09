import {useRef} from "react";
function App() {
  const inputRef = useRef();
  const handleClick =() => {
    inputRef.current.focus();
  };
  return (
    <div>
      <input ref ={inputRef}/>
      <button onClick={handleClick}>
        Focus Input
      </button>
    </div>
  );
}
export default App;