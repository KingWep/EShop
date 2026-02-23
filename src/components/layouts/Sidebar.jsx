import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from "../icons";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Products", icon: Package, to: "/products" },
  { label: "Categories", icon: Tags, to: "/categories" },
  { label: "Stock Management", icon: Layers, to: "/stock" },
  { label: "Orders", icon: ShoppingCart, to: "/orders" },
  { label: "Reports", icon: BarChart3, to: "/reports" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export const Sidebar = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out",
        "border-r border-sidebar-border",
        "bg-sidebar",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center purple-glow">
          <Boxes className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="block text-sm font-bold text-foreground leading-tight">
              StockPro
            </span>
            <span className="block text-[10px] text-muted-foreground">
              Inventory Suite
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Main Menu
          </p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "nav-item",
                isActive && "active",
                collapsed && "justify-center px-2"
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className={cn(
            "nav-item w-full",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px]" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
