import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import Layout from "./Layout/Layout";
import FaceRecognition from "./pages/verification _page";
import AddUser from "./pages/AddUser";
import User from "./pages/User";

import "./App.css";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}> 
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<FaceRecognition />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="user" element={<User />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
