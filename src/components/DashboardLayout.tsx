import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Shield, LayoutDashboard, Newspaper, Globe, Keyboard, Activity, User, LogOut, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Fake News", url: "/dashboard/fake-news", icon: Newspaper },
  { title: "Phishing", url: "/dashboard/phishing", icon: Globe },
  { title: "Keylogger", url: "/dashboard/keylogger", icon: Keyboard },
  { title: "DDoS", url: "/dashboard/ddos", icon: Activity },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cybershield_user");
    if (stored) setUser(JSON.parse(stored));
    else navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("cybershield_user");
    navigate("/");
  };

  if (!user) return null;

  const currentTitle = navItems.find((n) => n.url === location.pathname)?.title || "Dashboard";

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              Cyber<span className="text-primary">Shield</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 pt-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Platform</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
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
          <div className="flex items-center gap-3 p-2 rounded-md">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive mt-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-30 h-14 border-b border-border/60 bg-background/70 backdrop-blur-xl flex items-center px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-display font-semibold text-foreground">{currentTitle}</h2>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
