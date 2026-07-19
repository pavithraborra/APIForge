// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineCollection, HiOutlineCube, HiOutlineCog, HiOutlineLogout, HiOutlineMenu, HiOutlineSearch } from "react-icons/hi";
import { cn } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../context/WorkspaceContext";
import { colors } from "../../theme/theme";
import Logo from "../../assets/Logo";
import Avatar from "../ui/Avatar";

/**
 * Sidebar component – persistent navigation for authenticated routes.
 * Collapsible on mobile via a hamburger toggle.
 */
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeWorkspace } = useWorkspace();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: HiOutlineHome },
    { to: "/workspaces", label: "Workspaces", icon: HiOutlineCube },
    { to: "/collections", label: "Collections", icon: HiOutlineCollection },
    { to: "/api-builder", label: "API Builder", icon: HiOutlineSearch },
    { to: "/environments", label: "Environments", icon: HiOutlineCog },
    { to: "/history", label: "History", icon: HiOutlineCube },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const baseSidebarStyle = {
    background: "#FFF8F3",
    borderRight: `1px solid ${colors.border}`,
    width: collapsed ? "4rem" : "16rem",
    transition: "width 0.2s ease",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
    overflow: "hidden",
  };

  return (
    <aside style={baseSidebarStyle} className="p-4">
      {/* Logo & collapse toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Logo size={32} />
          {!collapsed && <span className="text-xl font-semibold" style={{ color: colors.primaryText }}>APIForge</span>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className={cn("p-1 rounded-md hover:bg-hover transition-colors")}>
          <HiOutlineMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary text-white" : "text-text-primary hover:bg-hover",
                collapsed && "justify-center"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto space-y-2">
        <button
          onClick={handleLogout}
          className={cn("w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-danger hover:bg-danger/10")}
        >
          <HiOutlineLogout className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
        {user && (
          <div 
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 p-2 rounded-lg bg-hover cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <Avatar src={user?.profilePicture} name={user?.username} size="sm" />
            {!collapsed && (
              <div className="flex flex-col text-xs">
                <span className="font-medium" style={{ color: colors.primaryText }}>{user.username || user.email}</span>
                <span className="text-text-muted">{activeWorkspace?.name || "No Workspace"}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
