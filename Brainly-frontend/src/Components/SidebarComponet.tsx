import React, { type ReactElement } from 'react'

function SidebarComponet({text,icon}:{text:string,icon:ReactElement}) {
  return (
    <div className='flex items-center pl-4  hover:bg-gray-200 text-gray-700 rounded max-w-48 transition-all duration-150   text-xl ml-2 py-2  '>
      <div className='pr-2 cursor-pointer hover:bg-gray-200 '>
          {icon}
      </div>
      <div className='cursor-pointer hover:bg-gray-200'>
          {text }
      </div>
      
      

    </div>
  )
}

export default SidebarComponet