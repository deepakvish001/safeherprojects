import { useState, useCallback } from "react";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SOSButton = () => {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const startSOS = useCallback(() => {
    setActive(true);
    setCountdown(5);
    let count = 5;
    const id = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(id);
        triggerSOS();
      }
    }, 1000);
    setTimerId(id);
  }, []);

  const cancelSOS = useCallback(() => {
    if (timerId) clearInterval(timerId);
    setActive(false);
    setCountdown(5);
    toast.info("SOS cancelled");
  }, [timerId]);

  const triggerSOS = () => {
    toast.success("🆘 SOS Alert Sent!", {
      description: "Emergency contacts have been notified with your location.",
      duration: 5000,
    });
    // In production: send location to emergency contacts, start recording
    navigator.geolocation?.getCurrentPosition((pos) => {
      console.log("SOS Location:", pos.coords.latitude, pos.coords.longitude);
    });
    setActive(false);
    setCountdown(5);
  };

  return (
    <>
      <motion.button
        onClick={startSOS}
        className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl sos-pulse"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <Shield className="w-9 h-9" />
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-40 h-40 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center">
                <span className="text-5xl font-black text-primary-foreground">{countdown}</span>
              </div>
            </motion.div>

            <p className="text-xl font-bold text-foreground">Sending SOS in {countdown}s...</p>
            <p className="text-muted-foreground text-center px-8">
              Your location and emergency alert will be sent to all emergency contacts.
            </p>

            <button
              onClick={cancelSOS}
              className="px-8 py-3 rounded-full border-2 border-muted-foreground text-muted-foreground font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
