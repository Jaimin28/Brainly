import React, { useState } from "react";
import { Button } from "./Components/Button";
import { IoShareSocialSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import Cardcomponent from "./Components/Cardcomponent";
import CreateContentModel from "./Components/CreateContentModel";
import Sidebarr from "./Components/Sidebarr";
import Dashboard from "./pages/dashboard";
import SIgnUp from "./pages/SIgnUp";
import Signin from "./pages/Signin";
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/signup"  element={<SIgnUp/>} ></Route>
        <Route path="/signin"  element={<Signin/>} ></Route>
        <Route path="/dashboard"  element={<Dashboard/>} ></Route>
      </Routes>
  </BrowserRouter>
 
}

export default App;
