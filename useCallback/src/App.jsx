import {useCallback,useState} from "react";
function App () {
  const[count,setCount] = useState(0);
  const handleClick = useCallback(()=> {
    console.log("Clicked");
  },[]);
return (
 <div>
  <h1>Count:{count}</h1>
  <button onClick={()=>setCount(count+1)}>
    Increase
  </button>
  <button onClick={()=>setCount(count-1)}>
    Decrease
  </button>
  <button onClick={()=>setCount(0)}>
    Reset
  </button>
 <button onClick={handleClick}>
    Click Me
  </button>
 </div>
);
}
export default App;