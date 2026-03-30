import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useLocationSharing = () => {
  const { user } = useAuth();
  const [sharing, setSharing] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const watchRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSharing = useCallback(async () => {
    if (!user || !navigator.geolocation) {
      toast.error("Geolocation not available");
      return;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast.error("Could not get your location");
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    // Broadcast position every 10 seconds via realtime channel
    intervalRef.current = setInterval(async () => {
      if (!position) return;
      const channel = supabase.channel(`location:${user.id}`);
      channel.send({
        type: "broadcast",
        event: "location_update",
        payload: { lat: position.lat, lng: position.lng, timestamp: Date.now() },
      });
    }, 10000);

    setSharing(true);
    toast.success("📍 Location sharing started");
  }, [user, position]);

  const stopSharing = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSharing(false);
    setPosition(null);
    toast.info("Location sharing stopped");
  }, []);

  useEffect(() => {
    return () => {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { sharing, position, startSharing, stopSharing };
};

// Hook to subscribe to someone's location
export const useTrackLocation = (userId: string | null) => {
  const [trackedPosition, setTrackedPosition] = useState<{ lat: number; lng: number; timestamp: number } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`location:${userId}`)
      .on("broadcast", { event: "location_update" }, (payload) => {
        setTrackedPosition(payload.payload as { lat: number; lng: number; timestamp: number });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return trackedPosition;
};
