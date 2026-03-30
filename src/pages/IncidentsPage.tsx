import { useState } from "react";
import { AlertTriangle, MapPin, ChevronDown, ChevronUp, Clock, Send, Shield, Eye, EyeOff, ThumbsUp, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { type Category, type Severity, CATEGORIES, SEVERITY_CONFIG } from "@/data/incidentTypes";



interface DemoIncident {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  anonymous: boolean;
  reporter: string;
  upvotes: number;
  createdAt: string;
}

const DEMO_INCIDENTS: DemoIncident[] = [
  {
    id: "1",
    category: "harassment",
    severity: "high",
    title: "Verbal harassment near bus stop",
    description: "Group of men catcalling and following women near the main bus stop after 9 PM.",
    locationName: "MI Road Bus Stop, Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    anonymous: false,
    reporter: "Ananya S.",
    upvotes: 14,
    createdAt: "2h ago",
  },
  {
    id: "2",
    category: "poor_lighting",
    severity: "medium",
    title: "Dark alley near market",
    description: "The lane between Johari Bazaar and Tripolia Bazaar has no streetlights. Very unsafe after dark.",
    locationName: "Johari Bazaar Lane, Jaipur",
    lat: 26.9220,
    lng: 75.8235,
    anonymous: true,
    reporter: "Anonymous",
    upvotes: 23,
    createdAt: "5h ago",
  },
  {
    id: "3",
    category: "suspicious_activity",
    severity: "medium",
    title: "Unauthorized taxi drivers",
    description: "Unlicensed taxi drivers approaching solo female travelers outside the train station. Be cautious.",
    locationName: "Jaipur Junction Station",
    lat: 26.9196,
    lng: 75.7878,
    anonymous: false,
    reporter: "Meera R.",
    upvotes: 8,
    createdAt: "1d ago",
  },
  {
    id: "4",
    category: "theft",
    severity: "high",
    title: "Phone snatching on road",
    description: "Two incidents of phone snatching by bike-borne men on this stretch this week.",
    locationName: "Tonk Road, Jaipur",
    lat: 26.8800,
    lng: 75.8000,
    anonymous: true,
    reporter: "Anonymous",
    upvotes: 31,
    createdAt: "2d ago",
  },
];

const IncidentsPage = () => {
  const [view, setView] = useState<"feed" | "report">("feed");
  const [category, setCategory] = useState<Category | null>(null);
  const [severity, setSeverity] = useState<Severity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resetForm = () => {
    setCategory(null);
    setSeverity("medium");
    setTitle("");
    setDescription("");
    setLocationName("");
    setAnonymous(false);
  };

  const submitReport = () => {
    if (!category || !title.trim()) {
      toast.error("Please select a category and add a title");
      return;
    }
    toast.success("Incident reported successfully!", {
      description: "Your report helps keep the community safe.",
    });
    resetForm();
    setView("feed");
  };

  const toggleUpvote = (id: string) => {
    setUpvoted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Report form
  if (view === "report") {
    return (
      <div className="px-4 pt-4 pb-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("feed")}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-black text-foreground">Report Incident</h1>
            <p className="text-xs text-muted-foreground">Help others stay safe</p>
          </div>
        </div>

        {/* Category selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`glass-card rounded-xl p-3 text-left transition-all ${
                  category === cat.value
                    ? "border-primary/50 ring-1 ring-primary/30"
                    : "border-border/50"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <p className="text-xs font-semibold text-foreground mt-1">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Severity</label>
          <div className="flex gap-2">
            {(Object.keys(SEVERITY_CONFIG) as Severity[]).map((s) => {
              const cfg = SEVERITY_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cfg.bg} ${cfg.color} ${
                    severity === s ? "ring-1 ring-current" : "opacity-60"
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the incident"
            className="bg-muted/50 border-border/50"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Details</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, when, and any identifying details..."
            rows={3}
            className="w-full rounded-lg bg-muted/50 border border-border/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter location or use current"
              className="bg-muted/50 border-border/50 pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs w-full"
            onClick={() => {
              setLocationName("Current Location — Jaipur, India");
              toast.info("Using your current location");
            }}
          >
            <MapPin className="w-3 h-3 mr-1" /> Use Current Location
          </Button>
        </div>

        {/* Anonymous toggle */}
        <div className="glass-card rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {anonymous ? <EyeOff className="w-4 h-4 text-secondary" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
            <div>
              <p className="text-sm font-bold text-foreground">Report Anonymously</p>
              <p className="text-[10px] text-muted-foreground">Your identity won't be shown</p>
            </div>
          </div>
          <button
            onClick={() => setAnonymous(!anonymous)}
            className={`w-11 h-6 rounded-full transition-colors relative ${anonymous ? "bg-secondary" : "bg-muted"}`}
          >
            <div className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-foreground absolute top-[3px] transition-all ${anonymous ? "right-[3px]" : "left-[3px]"}`} />
          </button>
        </div>

        {/* Submit */}
        <Button className="w-full h-12 text-sm font-bold" onClick={submitReport}>
          <Send className="w-4 h-4 mr-2" /> Submit Report
        </Button>
      </div>
    );
  }

  // Feed view
  return (
    <div className="px-4 pt-4 pb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Safety Reports</h1>
          <p className="text-sm text-muted-foreground">Community-reported incidents nearby</p>
        </div>
        <Button size="sm" onClick={() => setView("report")} className="text-xs">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Report
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "This Week", value: "4", icon: Clock, color: "text-warning" },
          { label: "High Severity", value: "2", icon: AlertTriangle, color: "text-danger" },
          { label: "Resolved", value: "1", icon: Shield, color: "text-safe" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
            <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
            <p className="text-lg font-black text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Incident Feed */}
      <div className="space-y-3">
        {DEMO_INCIDENTS.map((incident, i) => {
          const catInfo = CATEGORIES.find((c) => c.value === incident.category);
          const sevCfg = SEVERITY_CONFIG[incident.severity];
          const expanded = expandedId === incident.id;
          const voted = upvoted.has(incident.id);

          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-4 space-y-2"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5 flex-1">
                  <span className="text-lg mt-0.5">{catInfo?.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground leading-tight">{incident.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge className={`text-[10px] px-1.5 py-0 border-0 ${sevCfg.bg} ${sevCfg.color}`}>
                        {sevCfg.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {incident.createdAt}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        by {incident.reporter}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setExpandedId(expanded ? null : incident.id)}>
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 text-secondary" />
                {incident.locationName}
              </div>

              {/* Expanded description */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/30 mt-1">
                      {incident.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upvote */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => toggleUpvote(incident.id)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                    voted ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {incident.upvotes + (voted ? 1 : 0)}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidentsPage;
