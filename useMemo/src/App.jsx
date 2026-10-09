import { useMemo,useState } from "react";
function App() {
    const[number,setNumber]=useState(5);
    const[count,setCount]=useState(0);
    const result = useMemo(()=> {
        console.log("Calculation running...");
        return number*number;
    },[number]);
    return (
        <div>
            <h2>Result:{result}</h2>
            <button onClick={()=> { setNumber(number+1)}}>
                Change Number
            </button>
            <button onClick={()=>{setCount(count+1)}}>
                Change Count
            </button>
            <p>Count:{count}</p>
        </div>
    );
}
export default App;