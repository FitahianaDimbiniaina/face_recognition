import React from "react";

const Content = ({ children }) => {
  return (
    <div className="p-4 bg-gray-50 w-full">
      {children}
    </div>
  );
};

export default Content;
