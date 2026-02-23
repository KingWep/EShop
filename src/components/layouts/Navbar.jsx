import { useState } from "react";
import { Bell, Search, ChevronDown, Menu } from "../icons";

export const Navbar = ({ sidebarCollapsed, onMenuToggle }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header
      className="fixed top-0 right-0 z-40 h-16 flex items-center gap-4 px-6 border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300"
      style={{ left: sidebarCollapsed ? "70px" : "240px" }}
    >
      {/* Mobile menu */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products, orders..."
          className="w-full h-9 pl-9 pr-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-primary animate-pulse-glow" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Profile */}
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-secondary transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-xs font-bold text-white purple-glow">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-foreground leading-tight">Admin User</p>
            <p className="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        {/* Dropdown */}
        {showProfile && (
          <div className="absolute top-[68px] right-4 glass-card w-44 py-1 animate-scale-in z-50">
            {["Profile", "Account Settings", "Sign Out"].map((item) => (
              <button
                key={item}
                onClick={() => setShowProfile(false)}
                className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
