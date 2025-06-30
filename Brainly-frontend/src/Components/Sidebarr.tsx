import React from 'react'
import { CiTwitter } from "react-icons/ci";

import { FaYoutube } from "react-icons/fa";
import SidebarComponet from './SidebarComponet';
import { FaBrain } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";


function Sidebarr() {
  return (
    <div className='h-screen bg-white border-r w-72  absolute fixed left-0 top-0'>
        <div className='flex items-center gap-2 text-2xl pl-6 pt-4'>
          <GiBrain className='text-purple-600 ' />
          Brainly

        </div>
        <div className='pt-4 pl-4 flex flex-col justify-center '>
            <SidebarComponet text='Twitter' icon={<CiTwitter />}/>
            <SidebarComponet text='Youtube' icon={<FaYoutube />}/>


        </div>

    </div>
  )
}

export default Sidebarr