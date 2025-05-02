import React from 'react'
import LandingPage from './Pages/LandingPage'
import {BrowserRouter, Routes,Route} from "react-router-dom"
import SignInPage from './Pages/SignInPage'
import SignUpPage from './Pages/SignUpPage'
import HomePage from './Pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/SignIn" element={<SignInPage/>}></Route>
        <Route path="/SignUp" element={<SignUpPage/>}></Route>
        <Route path='/HomePage' element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
