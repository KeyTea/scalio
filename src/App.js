import './App.css';
import Result from "./Result";
import React, {useState} from "react";
import Search from "./Search";
export const AppContext = React.createContext();

function App() {
    const [user, setUser] = useState(null);
  return (
      <AppContext.Provider value={{
        user,
        setUser: (user) => setUser(user)
      }}>
        <div className="App">
            { user? <Result/> : <Search/> }
        </div>
      </AppContext.Provider>
  );
}

export default App;
