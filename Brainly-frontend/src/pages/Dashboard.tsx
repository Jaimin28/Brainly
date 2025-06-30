import React, { useEffect, useState } from "react";
import { Button } from "../Components/Button";
import { IoShareSocialSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import Cardcomponent from "../Components/Cardcomponent";
import CreateContentModel from "../Components/CreateContentModel";
import Sidebarr from "../Components/Sidebarr";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../Config";

function Dashboard() {
  const [openModel,setOpenModel] = useState(false);
  const {contents,refresh} = useContent();
  const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please sign in again.");
      return;
    }
  useEffect(()=>{
    refresh();

  },[openModel])
  return (<div className="">
    <Sidebarr/>
    <div className="p-4 relative ml-72 min-h-screen border-2 bg-gray-100">
      <CreateContentModel open={openModel} onClose={()=>{
        setOpenModel(false);

      }} />
      <div className="flex  justify-end  ">
        <Button
        onClick={async()=>{
          const reponse =await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
            share:true
          },{
            headers: {
          Authorization: `Bearer ${token}`,
        }
          })
          console.log(reponse);
          
          const shareurl = `http://localhost:5173/brain${reponse.data.message}`;
          alert(shareurl);
        }}
        text={"Share Brain"}
        variant="secondary"
        startIcon={<IoShareSocialSharp />}
        size="md"
        
      />
      <Button
        text={"Add Content"}
        onClick={()=>{setOpenModel(true)}}
        variant="primary"
        startIcon={<IoIosAdd />}
        size="md"
        
      />
      </div>
      <div>
        <div className="flex flex-wrap">
        {
          contents?.map(({type,link,title})=><Cardcomponent
          title={title}
          type={type}
          link={link}
        />)
        }
        
        
        
      </div>
      </div>
    </div>

  </div>
    
  );
}

export default Dashboard;
