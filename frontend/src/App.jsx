import './App.css'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import Dashboard from './components/Dashboard'
import CreatePost from './components/CreatePost'
import AllPosts from './components/AllPosts'
import SinglePost from './pages/SinglePost'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
     

      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-post" element={<CreatePost/>}/>
        <Route path="/posts" element={<AllPosts/>}/>
        <Route path="/posts/:id" element={<SinglePost/>}/>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
