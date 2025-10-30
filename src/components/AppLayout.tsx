import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-gray-100">
      <HeaderBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}