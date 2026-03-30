import { Shield, MapPin, Clock, Plus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const [sharing, setSharing] = useState(false);

  const toggleSharing = () => {
    setSharing(!sharing);
    toast.success(sharing ? "Location sharing stopped" : "Location sharing started with trusted contacts");
  };

  return (
    <div className="px-4 pt-4 pb-4 space-y-4">
      {/* Profile Header */}
      <div className="glass-card rounded-2xl p-6 text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto text-4xl">
          👩
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground">Sarah Johnson</h2>
          <p className="text-sm text-muted-foreground">Solo Traveler • Verified ✓</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-safe" />
          <span className="text-sm font-bold text-safe">Trust Score: 92/100</span>
        </div>
      </div>

      {/* Live Location Toggle */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className={`w-5 h-5 ${sharing ? "text-safe" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-bold text-foreground">Live Location Sharing</p>
              <p className="text-xs text-muted-foreground">{sharing ? "Active • 2 contacts" : "Off"}</p>
            </div>
          </div>
          <button
            onClick={toggleSharing}
            className={`w-12 h-7 rounded-full transition-colors relative ${sharing ? "bg-safe" : "bg-muted"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-foreground absolute top-1 transition-all ${sharing ? "right-1" : "left-1"}`} />
          </button>
        </div>
      </div>

      {/* Trip Plans */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            Active Trips
          </h3>
          <button className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-secondary" />
          </button>
        </div>

        <div className="bg-secondary/5 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">Delhi → Jaipur</p>
            <span className="text-xs bg-safe/10 text-safe px-2 py-0.5 rounded-full font-semibold">Active</span>
          </div>
          <p className="text-xs text-muted-foreground">Mar 30 – Apr 2, 2026</p>
          <div className="flex items-center gap-2">
            <Share2 className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Shared with Mom, Best Friend</span>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">Emergency Contacts</h3>
          <button className="text-xs text-primary font-semibold">+ Add</button>
        </div>
        {[
          { name: "Mom", phone: "+91 98765 43210", relation: "Parent" },
          { name: "Priya", phone: "+91 87654 32109", relation: "Friend" },
        ].map((c) => (
          <div key={c.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div>
              <p className="text-sm font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.relation} • {c.phone}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Reports */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-foreground">My Reports</h3>
        <button className="w-full py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors">
          + Report an Incident
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
