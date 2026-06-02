import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Shield, LayoutDashboard, Newspaper, Globe, Keyboard, Activity, User, LogOut, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { title: "Overview",  url: "/dashboard",            icon: LayoutDashboard },
  { title: "Fake News", url: "/dashboard/fake-news",  icon: Newspaper },
  { title: "Phishing",  url: "/dashboard/phishing",   icon: Globe },
  { title: "Keylogger", url: "/dashboard/keylogger",  icon: Keyboard },
  { title: "DDoS",      url: "/dashboard/ddos",       icon: Activity },
  { title: "Profile",   url: "/dashboard/profile",    icon: User },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/login"); }, [loading, user, navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.name || user.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user.email || "";
  const currentTitle = navItems.find((n) => n.url === location.pathname)?.title || "Dashboard";

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-5 h-20 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-foreground grid place-items-center">
              <Shield className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold tracking-tight">CyberShield</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="px-3 pb-2 pt-3 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em]">Workspace</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-foreground/5 text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
                activeClassName=""
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
                {displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive mt-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl flex items-center px-4 lg:px-8 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-medium text-foreground/80">{currentTitle}</h2>
          <div className="ml-auto"><ThemeToggle /></div>
        </header>
        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto">
          <Outlet context={{ user, profile, displayName }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
