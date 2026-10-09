import { createContext, useContext } from "react";
const UserContext = createContext();
function App() {
  const user = "Shailaja";
  return (
    <UserContext.Provider value={user}>
      <Parent />
    </UserContext.Provider>
  );
}
function Parent() {
  return <Child />;
}
function Child() {
  const user = useContext(UserContext);
  return <h1>Hello {user}</h1>;
}
export default App;
