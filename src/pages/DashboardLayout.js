import React from "react";
import Main from "./Main";
import { Outlet } from "react-router-dom";
import SideBar from "../components/common/SideBar";
import HeaderComponent from "../components/common/HeaderComponent.js";

export default function DashboardLayout() {

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface text-secondary flex">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1">
        <HeaderComponent isOpen={isOpen} setIsOpen={setIsOpen}/>
        <div className="overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}