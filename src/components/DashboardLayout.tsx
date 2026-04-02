import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Shield, LayoutDashboard, Newspaper, Globe, Keyboard, Activity, User, LogOut, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Fake News Detection", url: "/dashboard/fake-news", icon: Newspaper },
  { title: "Phishing Detection", url: "/dashboard/phishing", icon: Globe },
  { title: "Keylogger Detection", url: "/dashboard/keylogger", icon: Keyboard },
  { title: "DDoS Detection", url: "/dashboard/ddos", icon: Activity },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cybershield_user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("cybershield_user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-mono font-bold text-foreground">
              Cyber<span className="text-primary">Shield</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                activeClassName=""
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">{user.name[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-14 border-b border-border/50 glass flex items-center px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-mono text-foreground font-semibold">
            {navItems.find((n) => n.url === location.pathname)?.title || "CyberShield AI"}
          </h2>
        </header>
        <main className="flex-1 p-4 lg:p-6 grid-pattern">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
