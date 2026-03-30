import { Home, Map, Shield, Phone, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Map, label: "Routes", path: "/routes" },
  { icon: Shield, label: "SOS", path: "/sos", isSOS: true },
  { icon: Phone, label: "Services", path: "/services" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path, isSOS }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
                isSOS
                  ? "relative -mt-6 bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg sos-pulse"
                  : active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(isSOS ? "w-7 h-7" : "w-5 h-5")} />
              {!isSOS && <span className="text-[10px] font-medium">{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
