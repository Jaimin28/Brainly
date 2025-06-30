import React, { useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Button } from "./Button";
import Input from "../Components/Input";
import axios from "axios";
import { BACKEND_URL } from "../Config";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}
// controlled component
function CreateContentModel({ open, onClose }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value.trim();
    const link = linkRef.current?.value.trim();

    if (!title || !link) {
      alert("Both title and link are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if(!token){
        alert("No token Found,please login first");
        return;

      }
      const response = await axios.post(`${BACKEND_URL}/api/v1/content`, {
        title,
        link,
        type,
      },{
        headers:{
          "Authorization": `Bearer ${token}`,
        }
      });

      console.log("Content created:", response.data);
      alert("Content added successfully!");

      // Optional: clear fields after adding
      if (titleRef.current) titleRef.current.value = "";
      if (linkRef.current) linkRef.current.value = "";

      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to create content:", error);
      alert("Something went wrong. Please try again!");
    }
  }
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      {open && (
        <div>
          <div className="w-screen h-screen flex justify-center  bg-slate-500 fixed top-0 left-0 opacity-60 "></div>
          <div className="w-screen h-screen flex justify-center   fixed left-0  ">
            <div className="flex flex-col justify-center items-center">
              <span className="bg-white opacity-100 p-4 rounded-md">
                <div className="flex justify-end">
                  <IoIosClose
                    className="text-3xl cursor-pointer"
                    onClick={onClose}
                  />
                </div>
                <div>
                  <Input ref={titleRef} placeholder={"Title"}></Input>
                  <Input ref={linkRef} placeholder={"Link"}></Input>
                </div>
                <div>
                  <h1>Type</h1>
                  <div className="flex gap-2 justify-center  ">
                    <Button
                      text="youtube"
                      variant={
                        type === ContentType.Youtube ? "primary" : "secondary"
                      }
                      size="sm"
                      onClick={() => {
                        setType(ContentType.Youtube);
                      }}
                    />
                    <Button
                      text="Twitter"
                      variant={
                        type === ContentType.Twitter ? "primary" : "secondary"
                      }
                      size="sm"
                      onClick={() => {
                        setType(ContentType.Twitter);
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={addContent}
                    variant="primary"
                    text="Submit"
                    size="lg"
                  ></Button>
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateContentModel;
