import React from "react";
import Main from "./Main";
import { Outlet } from "react-router-dom";
import SideBar from "../components/common/SideBar";
import HeaderComponent from "../components/common/HeaderComponent.js";
import LogoutConfirmModal from "../components/common/LogoutConfirmModal";
import useAuth from "../hooks/useAuth";

export default function DashboardLayout() {

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);
  const auth = useAuth();

  return (
    <div className="min-h-screen bg-surface text-secondary flex">
      <SideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLogoutClick={() => setIsLogoutOpen(true)}
      />
      <main className="flex-1">
        <HeaderComponent isOpen={isOpen} setIsOpen={setIsOpen}/>
        <div className="overflow-x-hidden">
          <Outlet />
        </div>
      </main>

      <LogoutConfirmModal
        isOpen={isLogoutOpen}
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          auth.logoutUser();
        }}
      />
    </div>
  );
}