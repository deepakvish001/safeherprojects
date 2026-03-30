import { useState } from "react";
import { Shield, Star, MessageCircle, Phone, MapPin, ChevronLeft, Send, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Guardian {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  distance: string;
  skills: string[];
  languages: string[];
  verified: boolean;
  bio: string;
  reviewCount: number;
  online: boolean;
}

const DEMO_GUARDIANS: Guardian[] = [
  {
    id: "1",
    name: "Ananya Sharma",
    avatar: "",
    trustScore: 94,
    distance: "0.3 km",
    skills: ["First Aid", "Local Guide", "Self Defense"],
    languages: ["Hindi", "English"],
    verified: true,
    bio: "Local resident & certified first-aid responder. Happy to help solo travelers navigate safely.",
    reviewCount: 28,
    online: true,
  },
  {
    id: "2",
    name: "Priya Patel",
    avatar: "",
    trustScore: 87,
    distance: "0.8 km",
    skills: ["Translation", "Local Guide"],
    languages: ["Hindi", "English", "Gujarati"],
    verified: true,
    bio: "Tour guide with 5 years experience. I know every safe route in the city.",
    reviewCount: 15,
    online: true,
  },
  {
    id: "3",
    name: "Meera Reddy",
    avatar: "",
    trustScore: 78,
    distance: "1.2 km",
    skills: ["Medical", "Accommodation"],
    languages: ["Telugu", "English"],
    verified: false,
    bio: "Nurse at city hospital. Can provide medical guidance and safe accommodation referrals.",
    reviewCount: 9,
    online: false,
  },
  {
    id: "4",
    name: "Kavita Singh",
    avatar: "",
    trustScore: 91,
    distance: "1.5 km",
    skills: ["Self Defense", "Legal Aid"],
    languages: ["Hindi", "English", "Punjabi"],
    verified: true,
    bio: "Lawyer and self-defense instructor. Dedicated to women's safety advocacy.",
    reviewCount: 22,
    online: false,
  },
];

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

const DEMO_CHATS: Record<string, ChatMessage[]> = {
  "1": [
    { id: "m1", text: "Hi! I saw you're nearby. I'm traveling solo and feeling a bit lost.", fromMe: true, time: "2:30 PM" },
    { id: "m2", text: "Hello! Don't worry, I'm happy to help. Where are you headed?", fromMe: false, time: "2:31 PM" },
    { id: "m3", text: "I need to get to Hawa Mahal safely. Any tips?", fromMe: true, time: "2:32 PM" },
    { id: "m4", text: "Yes! Take the main road from here, avoid the back alleys. I can walk you there if you'd like.", fromMe: false, time: "2:33 PM" },
  ],
};

const getTrustColor = (score: number) => {
  if (score >= 85) return "text-safe";
  if (score >= 60) return "text-warning";
  return "text-danger";
};

const getTrustBg = (score: number) => {
  if (score >= 85) return "bg-safe/10";
  if (score >= 60) return "bg-warning/10";
  return "bg-danger/10";
};

const GuardiansPage = () => {
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const openChat = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setMessages(DEMO_CHATS[guardian.id] || []);
    setChatOpen(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      fromMe: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Thanks for reaching out! I'll be right with you 😊",
          fromMe: false,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  const requestHelp = (guardian: Guardian) => {
    toast.success(`Help request sent to ${guardian.name}!`, {
      description: "They will be notified of your location.",
    });
  };

  // Chat view
  if (chatOpen && selectedGuardian) {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        {/* Chat header */}
        <div className="glass-card border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setChatOpen(false)}>
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-secondary/20 text-secondary text-sm font-bold">
              {selectedGuardian.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">{selectedGuardian.name}</p>
            <p className="text-[10px] text-safe">Online</p>
          </div>
          <Button size="icon" variant="ghost" onClick={() => toast.info("Calling " + selectedGuardian.name + "...")}>
            <Phone className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  msg.fromMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.fromMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="glass-card border-t border-border/50 px-4 py-3 flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-muted/50 border-0 text-sm"
          />
          <Button size="icon" onClick={sendMessage} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Guardian list view
  return (
    <div className="px-4 pt-4 pb-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground">Guardian Network</h1>
        <p className="text-sm text-muted-foreground">Verified helpers nearby ready to assist</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Nearby", value: "4", icon: MapPin, color: "text-secondary" },
          { label: "Online", value: "2", icon: Shield, color: "text-safe" },
          { label: "Avg Trust", value: "88", icon: Star, color: "text-warning" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
            <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
            <p className="text-lg font-black text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Guardian Cards */}
      <div className="space-y-3">
        {DEMO_GUARDIANS.map((guardian, i) => (
          <motion.div
            key={guardian.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-4 space-y-3"
          >
            {/* Top row */}
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-secondary/20 text-secondary font-bold">
                    {guardian.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {guardian.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-safe border-2 border-card" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-foreground text-sm">{guardian.name}</p>
                  {guardian.verified && <CheckCircle className="w-3.5 h-3.5 text-safe" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-bold ${getTrustColor(guardian.trustScore)}`}>
                    {guardian.trustScore}/100
                  </span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {guardian.distance}
                  </span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-warning" /> {guardian.reviewCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-muted-foreground leading-relaxed">{guardian.bio}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {guardian.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary border-0">
                  {skill}
                </Badge>
              ))}
              {guardian.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="text-[10px] px-2 py-0.5 border-border/50 text-muted-foreground">
                  {lang}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 text-xs h-9"
                variant="outline"
                onClick={() => openChat(guardian)}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1" /> Chat
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs h-9"
                onClick={() => requestHelp(guardian)}
              >
                <Shield className="w-3.5 h-3.5 mr-1" /> Request Help
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GuardiansPage;
