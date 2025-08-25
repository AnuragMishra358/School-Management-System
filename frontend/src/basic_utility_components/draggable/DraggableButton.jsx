import React, { useContext, useRef } from "react";
import Draggable from "react-draggable";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

export const DraggableButton = () => {
  const { dark, modeChange } = useContext(AuthContext);
  // console.log("value of dark",dark);
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} bounds="body" cancel="button">
      <div
        ref={nodeRef}
        className="fixed top-0 right-0 cursor-move z-[9999] w-fit h-fit"
      >
        <button
          onClick={modeChange}
          className={`p-2 sm:p-3 lg:p-5 shadow-xl rounded-full transition-all duration-300 
          ${
            dark
              ? "bg-yellow-700 text-white hover:bg-yellow-800"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          {dark ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
      </div>
    </Draggable>
  );
};
