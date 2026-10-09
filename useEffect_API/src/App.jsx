import {useEffect} from "react";
function App() {
  useEffect(() =>{
    fetch("https://jsonplaceholder.typicode.com/users")
    .then(response =>response.json())
    .then(data => {
      console.log(data);
    });
  },[]);
  return (
    <div>
      <h1>Users</h1>
    </div>
  );
}
export default App;