import "./App.css";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import AuthPage from "./views/auth/AuthPage";
import HomePage from "./views/user/HomePage";


function App() {
  return ( 
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      }/>
    </Routes>
  )
}

export default App;
