import React from 'react'
import { IoShareSocialSharp } from "react-icons/io5";
interface CardProps {
    title:String,
    link:string,
    type:"twitter" | "youtube"
}
function Cardcomponent({title,link,type}:CardProps) {
  return (
    <div className='rounded-md m-4 min-h-48 min-w-72   max-w-72 p-4 border border-gray-200   bg-white'>
        <div className='flex justify-between'>
            <div className='flex justify-between gap-3  items-center'>
                <IoShareSocialSharp className='text-gray-500' />
                {title}
            </div>
            <div className='flex text-gray-500 items-center justify-between gap-3'>
                <div>
                    <a href={link} target='_blank'>
                            <IoShareSocialSharp />
                    </a>
                    
                </div>
                <div>
                    <IoShareSocialSharp />
                </div>
                
                
            </div>
        </div>
        <div className='mt-3 '>
            {type==="youtube" && <iframe className="w-full h-auto  rounded-md"     src={link.replace("watch","embed").replace("?v=","/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
        {type==="twitter" && <blockquote className="twitter-tweet "><a href={link.replace("x.com","twitter.com")}/></blockquote>  }
        </div>
        
        
    </div>
  )
}

export default Cardcomponent