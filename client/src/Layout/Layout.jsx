import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import Content from "../component/content";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
};

export default Layout;
