import { useState } from "react";
import {
  User, Bell, Shield, Palette, Globe, Database, ChevronRight,
  Save, Eye, EyeOff, Check, Moon, Sun, Monitor,
} from "../components/icons";

const sections = [
  { id: "profile",        label: "Profile",       icon: User },
  { id: "notifications",  label: "Notifications", icon: Bell },
  { id: "appearance",     label: "Appearance",    icon: Palette },
  { id: "security",       label: "Security",      icon: Shield },
  { id: "regional",       label: "Regional",      icon: Globe },
  { id: "data",           label: "Data & Export",  icon: Database },
];

const Settings = () => {
  const [active, setActive]       = useState("profile");
  const [saved, setSaved]         = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [theme, setTheme]         = useState("dark");
  const [notifs, setNotifs]       = useState({
    email: true, sms: false, push: true, lowStock: true, orders: true, reports: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar nav */}
        <div className="glass-card p-2 h-fit lg:col-span-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === s.id
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <s.icon className="w-4 h-4 flex-shrink-0" />
                <span>{s.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="lg:col-span-3 space-y-4">

          {/* ── Profile ── */}
          {active === "profile" && (
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold text-white">
                  AD
                </div>
                <div>
                  <button className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold">
                    Upload Photo
                  </button>
                  <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG or GIF — max 2 MB</p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", placeholder: "Admin", id: "fn" },
                  { label: "Last Name",  placeholder: "User",  id: "ln" },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
                    <input
                      defaultValue={f.placeholder}
                      className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue="admin@stockpro.io"
                    className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role</label>
                  <input
                    defaultValue="Super Administrator"
                    disabled
                    className="w-full h-9 px-3 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {active === "notifications" && (
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">Notification Preferences</h2>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Channels</p>
                {(["email", "sms", "push"]).map((key) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{key === "push" ? "Push Notifications" : key.toUpperCase() + " Alerts"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {key === "email" ? "Receive updates via email" : key === "sms" ? "Receive SMS for critical alerts" : "Browser push notifications"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                      className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${notifs[key] ? "bg-primary" : "bg-secondary border border-border"}`}
                      style={{ minWidth: 40, height: 22 }}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${notifs[key] ? "left-[calc(100%-18px)]" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Alert Types</p>
                {(["lowStock", "orders", "reports"]).map((key) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {key === "lowStock" ? "Low Stock Warnings" : key === "orders" ? "New Orders" : "Weekly Reports"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {key === "lowStock" ? "Alert when items reach reorder level" : key === "orders" ? "Notify on each new order placed" : "Summary delivered every Monday"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                      className={`relative rounded-full transition-all duration-300 ${notifs[key] ? "bg-primary" : "bg-secondary border border-border"}`}
                      style={{ minWidth: 40, height: 22 }}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${notifs[key] ? "left-[calc(100%-18px)]" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Appearance ── */}
          {active === "appearance" && (
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">Appearance</h2>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Theme Mode</p>
                <div className="grid grid-cols-3 gap-3">
                  {(["dark", "light", "system"]).map((t) => {
                    const Icon = t === "dark" ? Moon : t === "light" ? Sun : Monitor;
                    return (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex flex-col items-center gap-2.5 py-4 rounded-xl border transition-all ${
                          theme === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium capitalize">{t}</span>
                        {theme === t && <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Accent Color</p>
                <div className="flex gap-2.5">
                  {[
                    "hsl(262 83% 58%)",
                    "hsl(200 80% 50%)",
                    "hsl(142 71% 45%)",
                    "hsl(38 92% 50%)",
                    "hsl(0 84% 60%)",
                    "hsl(280 83% 60%)",
                  ].map((color) => (
                    <button
                      key={color}
                      className="w-7 h-7 rounded-full border-2 border-transparent hover:border-white/50 transition-all"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Sidebar Style</p>
                <div className="flex gap-2">
                  {["Collapsed by default", "Expanded by default"].map((opt) => (
                    <button
                      key={opt}
                      className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {active === "security" && (
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">Security</h2>

              <div className="space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Change Password</p>
                {[
                  { label: "Current Password", id: "cur" },
                  { label: "New Password",     id: "new" },
                  { label: "Confirm Password", id: "conf" },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full h-9 px-3 pr-10 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      <button
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-5 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Two-Factor Authentication</p>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Authenticator App</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Use Google Authenticator or similar</p>
                  </div>
                  <button className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold">Enable 2FA</button>
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Sessions</p>
                {[
                  { device: "Chrome · macOS", ip: "192.168.1.1", time: "Now (current)" },
                  { device: "Safari · iPhone 15", ip: "10.0.0.4", time: "2 days ago" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-xs font-medium text-foreground">{s.device}</p>
                      <p className="text-[10px] text-muted-foreground">{s.ip} · {s.time}</p>
                    </div>
                    {i !== 0 && (
                      <button className="text-xs text-destructive hover:underline">Revoke</button>
                    )}
                    {i === 0 && (
                      <span className="badge-in-stock">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Regional ── */}
          {active === "regional" && (
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">Regional Settings</h2>
              {[
                { label: "Language", options: ["English (US)", "Spanish", "French", "German", "Japanese"] },
                { label: "Timezone", options: ["UTC-5 (Eastern Time)", "UTC+0 (GMT)", "UTC+1 (CET)", "UTC+9 (JST)"] },
                { label: "Currency", options: ["USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)"] },
                { label: "Date Format", options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
                  <div className="relative">
                    <select className="appearance-none w-full h-9 pl-3 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all">
                      {f.options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Data ── */}
          {active === "data" && (
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">Data & Export</h2>

              <div className="space-y-3">
                {[
                  { label: "Export Products", desc: "Download all product data as CSV", btn: "Export CSV" },
                  { label: "Export Orders", desc: "Download order history as CSV", btn: "Export CSV" },
                  { label: "Export Reports", desc: "Download analytics data as PDF", btn: "Export PDF" },
                  { label: "Backup Database", desc: "Create a full database backup", btn: "Create Backup" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-secondary border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Danger Zone</p>
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  <p className="text-sm font-medium text-foreground">Delete All Data</p>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-3">This will permanently erase all products, orders, and settings.</p>
                  <button className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-colors">
                    Delete Everything
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved ? "bg-success text-white" : "btn-primary"
              }`}
            >
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
