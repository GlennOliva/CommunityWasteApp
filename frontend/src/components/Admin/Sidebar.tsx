import React, { useEffect, useRef, useState } from "react";
import "../../css/style.css";
import logo from "../../assets/images/CWS-LOGO.png";
import { Link, useLocation } from "react-router-dom"; // Make sure you're using 'react-router-dom'

const Sidebar: React.FC = () => {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // For getting current route

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const toggleSidebar = document.querySelector(".toggle-sidebar");

    if (!sidebar || !toggleSidebar) return;

    const handleSidebarToggle = () => {
      sidebar.classList.toggle("hide");
      setIsCollapsed((prev) => !prev);

      document.querySelectorAll<HTMLLIElement>("#sidebar .divider").forEach((item) => {
        item.textContent = sidebar.classList.contains("hide") ? "-" : item.dataset.text || "";
      });
    };

    toggleSidebar.addEventListener("click", handleSidebarToggle);

    return () => {
      toggleSidebar.removeEventListener("click", handleSidebarToggle);
    };
  }, []);

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: "bxs-dashboard" },
    { path: "/admin/manage_resident", name: "View Resident", icon: "bx-user" },
    { path: "/admin/manage_schedule", name: "Manage Schedule", icon: "bx-calendar" },
    { path: "/admin/manage_compliant", name: "View Compliants", icon: "bx-user-voice" },
    { path: "/admin/manage_pickup_request", name: "View Pickup Req", icon: "bx-package" },
  ];

  return (
    <section id="sidebar" ref={sidebarRef} className="transition-all duration-300">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center py-4 transition-all duration-300">
        <img
          src={logo}
          alt="Admin Logo"
          className={`rounded-full object-cover transition-all duration-300 ${
            isCollapsed ? "w-10 h-10" : "w-45 h-45"
          }`}
        />
        <h1 className={`mt-5 text-center ${isCollapsed ? "text-xs" : "text-lg"}`}>
          ADMIN
        </h1>
      </div>

      <ul className="side-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              <i className={`bx ${item.icon} icon`}></i> {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Sidebar;
