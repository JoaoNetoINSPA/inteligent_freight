import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, LogOut, Users, FileSpreadsheet, Box, Menu, X } from "lucide-react";
import { authService } from "@/services/authService";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    const role = authService.getUserRole();
    const email = localStorage.getItem("userEmail");
    
    if (!role || !email) {
      navigate("/login");
      return;
    }
    
    setUserRole(role);
    setUserEmail(email);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Packages", path: "/dashboard", icon: Box },
    ...(userRole === "admin" ? [
      { name: "Audit Freight", path: "/audit", icon: FileSpreadsheet },
      { name: "Manage Team", path: "/team", icon: Users },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Intelligent Freight</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-muted-foreground">
                <div className="font-medium text-foreground">{userEmail}</div>
                <div className="text-xs capitalize">{userRole} Account</div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="hidden md:flex gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2 animate-fade-in">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                );
              })}
              <div className="pt-2 border-t">
                <div className="px-4 py-2 text-sm">
                  <div className="font-medium">{userEmail}</div>
                  <div className="text-xs text-muted-foreground capitalize">{userRole} Account</div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full gap-2 mt-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
