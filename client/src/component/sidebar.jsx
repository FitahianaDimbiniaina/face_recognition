import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 text-gray-800 p-6 rounded-tl-lg shadow-md h-screen">
      <div className="space-y-6">
        <Link to="/" className="block text-lg font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
        Attendance
        </Link>
        <Link to="/User" className="block text-lg font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          user
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
