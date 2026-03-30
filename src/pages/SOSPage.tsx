import { Shield, Volume2, Phone } from "lucide-react";
import SOSButton from "@/components/SOSButton";
import FakeCall from "@/components/FakeCall";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useNavigate } from "react-router-dom";

const SOSPage = () => {
  const [alarmActive, setAlarmActive] = useState(false);
  const { data: contacts, isLoading } = useEmergencyContacts();
  const navigate = useNavigate();

  const triggerAlarm = () => {
    setAlarmActive(true);
    toast.warning("🔊 Alarm activated! Playing loud siren.");
    setTimeout(() => setAlarmActive(false), 5000);
  };

  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeCount = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const deltaX = Math.abs((acc.x || 0) - lastX);
      const deltaY = Math.abs((acc.y || 0) - lastY);
      const deltaZ = Math.abs((acc.z || 0) - lastZ);
      if (deltaX + deltaY + deltaZ > 30) {
        shakeCount++;
        if (shakeCount >= 3) {
          toast.error("🆘 Shake detected! SOS triggered.");
          shakeCount = 0;
        }
      }
      lastX = acc.x || 0;
      lastY = acc.y || 0;
      lastZ = acc.z || 0;
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return (
    <div className="pt-4 px-4 space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 text-primary mx-auto" />
        <h1 className="text-2xl font-black text-foreground">Emergency SOS</h1>
        <p className="text-sm text-muted-foreground">Press the button below or shake your phone</p>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex justify-center py-8"
      >
        <SOSButton />
      </motion.div>

      {/* Tools */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Safety Tools</h3>
        <FakeCall />
        <button
          onClick={triggerAlarm}
          className="flex items-center gap-3 w-full p-4 rounded-xl glass-card hover:border-warning/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-warning" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground">Loud Alarm</p>
            <p className="text-xs text-muted-foreground">Scare threats with a loud siren</p>
          </div>
        </button>
      </div>

      {/* Emergency Contacts from DB */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">Emergency Contacts</h3>
          <button onClick={() => navigate("/profile")} className="text-xs text-primary font-semibold">Manage</button>
        </div>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : contacts && contacts.length > 0 ? (
          contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.relationship} • {c.phone}</p>
                </div>
              </div>
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-xs bg-safe/10 text-safe font-bold px-3 py-1.5 rounded-full">
                Call
              </a>
            </div>
          ))
        ) : (
          <button onClick={() => navigate("/onboarding")} className="w-full py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors">
            + Set Up Emergency Contacts
          </button>
        )}
      </div>
    </div>
  );
};

export default SOSPage;
