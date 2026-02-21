import './App.css'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import Dashboard from './components/Dashboard'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
     

      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
