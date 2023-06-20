import { useState, useEffect, useContext } from "react";

import Map from "./component/Map";
import Navbar from "./component/Navbar";
import { AuthContext } from "./context/AuthContext";


export default function App() {

 


  return (
    <div>
   <Navbar/>
    <Map/>
    </div>
    )
}
