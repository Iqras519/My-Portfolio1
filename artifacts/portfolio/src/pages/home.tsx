import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Github,
  Linkedin,
  ArrowRight,
  Sun,
  Moon,
  ExternalLink,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Code2,
  Database,
  Wrench,
  Mail,
  Menu,
  X,
  Play,
  Pause,
  RotateCcw,
  CloudSun,
  Compass,
  Wind,
  Check,
  ChevronRight,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Camera,
  Cpu,
  Eye,
  Layers,
  Upload,
  Leaf,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Brand icons for the skills section
import { FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaLock, FaTerminal, FaFigma, FaGithub } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiFramer, SiNextdotjs, SiExpress, SiPostgresql, SiVite, SiPnpm, SiPostman } from "react-icons/si";
import { VscCode } from "react-icons/vsc";

// Zod validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Weather Mockup type definitions
interface CityWeather {
  temp: number;
  aqi: number;
  condition: string;
  label: string;
  desc: string;
  icon: string;
}

const weatherData: Record<string, CityWeather> = {
  sf: { temp: 72, aqi: 45, condition: "Sunny", label: "San Francisco, CA", desc: "Good", icon: "sunny" },
  tokyo: { temp: 64, aqi: 85, condition: "Cloudy", label: "Tokyo, Japan", desc: "Moderate", icon: "cloudy" },
  london: { temp: 58, aqi: 28, condition: "Rainy", label: "London, UK", desc: "Good", icon: "rainy" }
};

interface CoinData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  color: string;
  trend: number[];
}

const cryptoData: Record<string, CoinData> = {
  btc: {
    name: "Bitcoin",
    symbol: "BTC",
    price: 65240,
    change: 4.85,
    color: "#F7931A",
    trend: [61200, 62500, 61800, 63400, 64200, 63800, 65240]
  },
  eth: {
    name: "Ethereum",
    symbol: "ETH",
    price: 3420,
    change: 3.12,
    color: "#627EEA",
    trend: [3150, 3210, 3080, 3290, 3250, 3310, 3420]
  },
  sol: {
    name: "Solana",
    symbol: "SOL",
    price: 168.5,
    change: 8.42,
    color: "#14F195",
    trend: [142, 149, 145, 158, 162, 155, 168.5]
  }
};

interface Recommendation {
  chemical: string[];
  organic: string[];
  cultural: string[];
}

interface CropDetail {
  name: string;
  scientificName: string;
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "critical" | "normal";
  inferenceSpeed: string;
  pathogen: string;
  symptoms: string;
  description: string;
  recommendations: Recommendation;
}

const cropDataRecords: Record<string, CropDetail> = {
  tomato: {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    disease: "Early Blight (Fungal Infection)",
    confidence: 94.6,
    severity: "medium",
    inferenceSpeed: "42ms",
    pathogen: "Alternaria solani",
    symptoms: "Concentric ring spots (target spots) surrounded by chlorotic halos, starting on older leaves.",
    description: "A common fungal disease thriving in warm, damp conditions. If left untreated, it defoliates leaves, exposing fruit to sunscald and decreasing yield.",
    recommendations: {
      chemical: ["Apply copper-based fungicides or mancozeb at 7-14 day intervals."],
      organic: ["Spray liquid copper soap or Bacillus subtilis bio-fungicides.", "Apply neem oil to slow spore germination."],
      cultural: ["Prune lower leaves to improve air circulation.", "Water only at the base (drip) to keep foliage dry.", "Mulch to prevent spores splashing from soil."]
    }
  },
  potato: {
    name: "Potato",
    scientificName: "Solanum tuberosum",
    disease: "Late Blight (Oomycete Decay)",
    confidence: 98.1,
    severity: "critical",
    inferenceSpeed: "38ms",
    pathogen: "Phytophthora infestans",
    symptoms: "Large, dark water-soaked lesions on leaf margins that quickly turn necrotic, often with a white fuzzy mold under damp conditions.",
    description: "A highly aggressive pathogen famous for the Irish Potato Famine. It can destroy an entire crop field within days under cool, wet climates.",
    recommendations: {
      chemical: ["Apply systemic fungicides like metalaxyl or protective chlorothalonil immediately."],
      organic: ["Apply copper sulfate solutions as a preventative measure.", "Deploy Serenade ASO bio-fungicide."],
      cultural: ["Immediately remove and bury/burn infected plants.", "Avoid overhead irrigation completely.", "Plant certified disease-free tubers."]
    }
  },
  corn: {
    name: "Corn (Maize)",
    scientificName: "Zea mays",
    disease: "Common Rust (Fungal Infection)",
    confidence: 92.3,
    severity: "low",
    inferenceSpeed: "45ms",
    pathogen: "Puccinia sorghi",
    symptoms: "Elongated, powdery golden-brown pustules on both upper and lower leaf surfaces, leading to yellowing of surrounding tissue.",
    description: "A windborne rust fungal infection. Usually, it causes minor yield losses unless infection occurs early in the crop development cycle.",
    recommendations: {
      chemical: ["Triazole or strobilurin-based fungicides (only recommended if infestation covers >10% leaf area early in the season)."],
      organic: ["Apply dusting sulfur early in the morning when dew is present."],
      cultural: ["Sow rust-resistant hybrid varieties.", "Rotate crops with non-grass species next season.", "Remove crop residues post-harvest."]
    }
  },
  wheat: {
    name: "Wheat",
    scientificName: "Triticum aestivum",
    disease: "Healthy Leaf (No Disease Detected)",
    confidence: 99.2,
    severity: "normal",
    inferenceSpeed: "40ms",
    pathogen: "None",
    symptoms: "Uniform dark green pigmentation, strong linear leaf venation, no necrotic spots or pustules detected.",
    description: "The specimen displays optimal cell structures with rich chlorophyll distribution. No pathogenic signatures were detected by the computer vision classification layers.",
    recommendations: {
      chemical: ["No chemical application needed. Monitor weather alerts for rust or powdery mildew spreads."],
      organic: ["Maintain standard organic nutrient treatments."],
      cultural: ["Ensure proper nitrogen fertilization levels.", "Maintain scheduled drip irrigation cycles.", "Clear weeds surrounding the field."]
    }
  },
  custom: {
    name: "Uploaded Leaf",
    scientificName: "Specimen: Custom Upload",
    disease: "Healthy Specimen (Simulated)",
    confidence: 91.5,
    severity: "normal",
    inferenceSpeed: "56ms",
    pathogen: "None (Specimen Normal)",
    symptoms: "Leaf contours parsed successfully. No visible necrotic patches or lesions detected above safety threshold.",
    description: "The uploaded leaf was analyzed by the custom pipeline. Features indicate standard cell density with uniform reflectance matching healthy foliage criteria.",
    recommendations: {
      chemical: ["No fungicide or pesticide treatments required based on the current scan."],
      organic: ["Apply general seaweed extract foliar spray to boost natural immunity."],
      cultural: ["Monitor irrigation schedule.", "Observe leaf growth patterns over the next 7 days."]
    }
  }
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Mounted state to handle hydration safety
  const [mounted, setMounted] = useState(false);
  
  // Header scroll detection
  const [scrolled, setScrolled] = useState(false);
  
  // Active section spy state
  const [activeSection, setActiveSection] = useState("hero");
  
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mouse cursor spotlight pos
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Active category in Skills/Experience/Education tabs
  const [activeTab, setActiveTab] = useState<"skills" | "experience" | "education">("skills");
  
  // Active skills category
  const [skillCategory, setSkillCategory] = useState<"frontend" | "backend" | "tools">("frontend");

  // Project 1 state (Weather)
  const [selectedCity, setSelectedCity] = useState<"sf" | "tokyo" | "london">("sf");
  const weather = weatherData[selectedCity];

  // Project 2 state (Study tracker)
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes
  const [timerRunning, setTimerRunning] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Revise React Hooks", done: true },
    { id: 2, text: "Plan portfolio styling", done: false },
    { id: 3, text: "Implement contact form", done: false },
  ]);

  // Project 3 state (Crypto Tracker)
  const [selectedCoin, setSelectedCoin] = useState<"btc" | "eth" | "sol">("btc");
  const [cryptoBalance, setCryptoBalance] = useState(12500); // USD
  const [cryptoHoldings, setCryptoHoldings] = useState<Record<string, number>>({
    btc: 0.08,
    eth: 0.75,
    sol: 12.0
  });

  const activeCoin = cryptoData[selectedCoin];

  // Project 4 state (Crop Disease Predictor)
  const [selectedCrop, setSelectedCrop] = useState<"tomato" | "potato" | "corn" | "wheat" | "custom">("tomato");
  const [cropViewMode, setCropViewMode] = useState<"original" | "cv" | "cnn">("original");
  const [cropScanning, setCropScanning] = useState(false);
  const [cropScanProgress, setCropScanProgress] = useState(100);
  const [cropScanText, setCropScanText] = useState("Scan Idle");
  const [cropShowResults, setCropShowResults] = useState(true);
  const [customCropImage, setCustomCropImage] = useState<string | null>(null);
  const [customCropName, setCustomCropName] = useState<string | null>(null);

  const activeCropData = cropDataRecords[selectedCrop];

  const runCropAnalysis = (cropKey: "tomato" | "potato" | "corn" | "wheat" | "custom") => {
    setSelectedCrop(cropKey);
    setCropScanning(true);
    setCropShowResults(false);
    setCropScanProgress(0);
    setCropScanText("Initializing scan...");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCropScanProgress(progress);

      if (progress < 25) {
        setCropScanText("CV: Applying RGB-to-HSV color extraction...");
      } else if (progress < 50) {
        setCropScanText("CV: Running Canny edge contour detection...");
      } else if (progress < 75) {
        setCropScanText("CNN: Extracting convolutional feature maps (Conv2D)...");
      } else if (progress < 90) {
        setCropScanText("CNN: Generating spatial attention heatmap (Grad-CAM)...");
      } else if (progress < 100) {
        setCropScanText("ML: Evaluating Softmax disease class probabilities...");
      } else {
        setCropScanText("Diagnosis completed.");
        clearInterval(interval);
        setCropScanning(false);
        setCropShowResults(true);
        toast({
          title: "Diagnostic Scan Complete",
          description: `Analysis completed for ${cropKey === 'custom' ? 'Custom Upload' : cropDataRecords[cropKey].name} with ${(cropDataRecords[cropKey].confidence).toFixed(1)}% confidence.`
        });
      }
    }, 100);
  };

  const handleCropImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomCropImage(result);
        setCustomCropName(file.name);
        runCropAnalysis("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  // Contact form submission success state
  const [contactSuccess, setContactSuccess] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  // Handle Hydration mismatch safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor Scroll for Navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Active Section Scrollspy
  useEffect(() => {
    const sections = ["hero", "about", "projects", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3 }
      );
      
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  // Track Mouse Movements for Spotlight Glow Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Project 2: Pomodoro timer handler
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
      toast({
        title: "Session Completed!",
        description: "Great work! Take a short break.",
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft, toast]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(1500);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const doneCount = tasks.filter(t => t.done).length;
  const progressPercent = Math.round((doneCount / tasks.length) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCryptoTrade = (type: "buy" | "sell") => {
    const tradeAmount = 500;
    const coinPrice = activeCoin.price;
    const coinQty = tradeAmount / coinPrice;

    if (type === "buy") {
      if (cryptoBalance < tradeAmount) {
        toast({
          title: "Insufficient Funds",
          description: `You need at least $${tradeAmount} in cash to buy ${activeCoin.name}.`,
          variant: "destructive"
        });
        return;
      }
      setCryptoBalance(prev => prev - tradeAmount);
      setCryptoHoldings(prev => ({
        ...prev,
        [selectedCoin]: prev[selectedCoin] + coinQty
      }));
      toast({
        title: "Trade Executed",
        description: `Successfully bought ${coinQty.toFixed(4)} ${activeCoin.symbol} for $${tradeAmount}.`
      });
    } else {
      if (cryptoHoldings[selectedCoin] < coinQty) {
        toast({
          title: "Insufficient Holdings",
          description: `You do not own enough ${activeCoin.name} to sell $${tradeAmount} worth.`,
          variant: "destructive"
        });
        return;
      }
      setCryptoBalance(prev => prev + tradeAmount);
      setCryptoHoldings(prev => ({
        ...prev,
        [selectedCoin]: prev[selectedCoin] - coinQty
      }));
      toast({
        title: "Trade Executed",
        description: `Successfully sold ${coinQty.toFixed(4)} ${activeCoin.symbol} for $${tradeAmount}.`
      });
    }
  };

  // Handle Contact Form Submit
  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    console.log("Contact submission data:", data);
    toast({
      title: "Message Sent!",
      description: `Thanks for reaching out, ${data.name}. I'll get back to you shortly!`,
    });
    setContactSuccess(true);
    reset();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased relative selection:bg-primary/20 selection:text-primary">
      
      {/* Interactive spotlight radial background */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-0 md:opacity-100" 
        style={{
          background: `radial-gradient(500px at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.07), transparent 85%)`
        }}
      />

      {/* Floating Header / Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/40 py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <a href="#hero" className="font-bold tracking-wide text-xl font-serif text-foreground hover:opacity-85 transition-opacity">
            Iqra Shamim<span className="text-primary font-sans font-light">.</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-muted-foreground">
            {["about", "projects", "contact"].map((sec) => (
              <a 
                key={sec}
                href={`#${sec}`} 
                className={`capitalize transition-colors hover:text-foreground relative py-1 ${activeSection === sec ? "text-foreground font-semibold" : ""}`}
              >
                {sec}
                {activeSection === sec && (
                  <motion.span 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Action buttons (Theme Toggle & Menu Toggle) */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-9 h-9" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-foreground" />}
            </Button>

            {/* Mobile Hamburger menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full w-9 h-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 py-8 px-6 flex flex-col gap-6 md:hidden shadow-lg"
          >
            {["about", "projects", "contact"].map((sec) => (
              <a 
                key={sec}
                href={`#${sec}`} 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg capitalize font-medium ${activeSection === sec ? "text-primary" : "text-muted-foreground"}`}
              >
                {sec}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="min-h-[100dvh] flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Soft background glow circles */}
        <div className="absolute top-[20%] left-[10%] w-[350px] height-[350px] bg-primary/5 rounded-full filter blur-[80px] animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[10%] w-[450px] height-[450px] bg-chart-2/5 rounded-full filter blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto w-full text-center md:text-left relative z-10"
        >
                <motion.div variants={fadeIn} className="flex flex-col items-center md:items-start gap-6 mb-6">
            <div className="relative">
              <img
                src="/Linkdin-pr.jpg"
                alt="Profile"
                className="w-36 h-36 md:w-44 md:h-44 object-cover object-[center_20%] rounded-full border border-border/60 shadow-md"
                loading="eager"
              />
              <span
                className="glow-light"
                style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
              />
            </div>

            <motion.h1
              variants={fadeIn}
              className="font-sans text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-[1]"
            >
              Designing &<br />
              Building <span className="text-primary italic font-serif font-light">thoughtful apps.</span>
            </motion.h1>
          </motion.div>
          
          <motion.p 
            variants={fadeIn} 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-serif leading-relaxed mb-10 mx-auto md:mx-0"
          >
            
             I am Iqra Shamim, a student developer focused on engineering minimal, visually stunning, and highly functional digital tools that resolve real-world tasks.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Button size="lg" className="rounded-full shadow-sm hover:shadow-md transition-shadow group px-6" asChild>
              <a href="#projects">
                See Selected Work <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-6" asChild>
              <a href="#contact">Let's Talk</a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* About & Skills / Experience Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Side: Short Pitch */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary font-sans">About Me</span>
              <h2 className="text-3xl md:text-4xl font-semibold font-serif tracking-tight">
                Software is the convergence of design and intent.
              </h2>
              <p className="text-base font-serif text-muted-foreground leading-relaxed">
                I believe that software should be beautiful, clean, and highly intuitive. As a computer science student, I bridge core software foundations with modern web technologies, always looking to code products that elevate workflows.
              </p>
              
              <div className="pt-4 flex gap-4">
                <a
                  href="https://github.com/Iqras519"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2 rounded-full border border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/iqra-s-87b91a284"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2 rounded-full border border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right Side: Tab Switcher (Skills vs Experience) */}
            <div className="lg:col-span-7">
              {/* Tab Selector */}
              <div className="flex border-b border-border/60 mb-8 p-1 bg-secondary/15 rounded-lg max-w-[360px]">
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all relative ${activeTab === "skills" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Skills
                  {activeTab === "skills" && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-background rounded-md shadow-xs border border-border/40 z-[-1]"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all relative ${activeTab === "experience" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Journey
                  {activeTab === "experience" && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-background rounded-md shadow-xs border border-border/40 z-[-1]"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("education")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all relative ${activeTab === "education" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Education
                  {activeTab === "education" && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-background rounded-md shadow-xs border border-border/40 z-[-1]"
                    />
                  )}
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  {activeTab === "skills" ? (
                    <motion.div
                      key="skills-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Skills Sub-navigation */}
                      <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/30 pb-2">
                        {["frontend", "backend", "tools"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSkillCategory(cat as any)}
                            className={`pb-2 transition-colors relative hover:text-foreground ${skillCategory === cat ? "text-primary border-b border-primary font-bold" : ""}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Render Skill Badges Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {skillCategory === "frontend" && [
                          { name: "React", level: "Advanced", icon: <FaReact className="h-5 w-5" />, color: "#61DAFB" },
                          { name: "TypeScript", level: "Intermediate", icon: <SiTypescript className="h-5 w-5" />, color: "#3178C6" },
                          { name: "Tailwind CSS", level: "Advanced", icon: <SiTailwindcss className="h-5 w-5" />, color: "#38BDF8" },
                          { name: "Framer Motion", level: "Intermediate", icon: <SiFramer className="h-5 w-5" />, color: "#F024B6" },
                          { name: "Next.js", level: "Intermediate", icon: <SiNextdotjs className="h-5 w-5" />, color: "#808080" },
                          { name: "HTML5 / CSS3", level: "Advanced", icon: <div className="flex gap-1.5"><FaHtml5 className="h-5 w-5" /><FaCss3Alt className="h-5 w-5" /></div>, color: "#E34F26" }
                        ].map((skill) => (
                          <div 
                            key={skill.name} 
                            style={{ "--brand-color": skill.color } as React.CSSProperties}
                            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/5 hover:bg-[var(--brand-color)]/[0.04] hover:border-[var(--brand-color)]/30 transition-all duration-300 group relative overflow-hidden shadow-2xs hover:shadow-xs"
                          >
                            <div className="p-2.5 rounded-lg bg-background/80 border border-border/40 group-hover:border-[var(--brand-color)]/20 transition-colors shadow-2xs" style={{ color: skill.color }}>
                              {skill.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold tracking-wide text-foreground group-hover:text-[var(--brand-color)] transition-colors">{skill.name}</div>
                              <div className="text-xs text-muted-foreground">{skill.level}</div>
                            </div>
                            
                            <div 
                              className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                              style={{
                                background: `radial-gradient(120px at 40px 40px, ${skill.color}15, transparent)`
                              }}
                            />
                          </div>
                        ))}

                        {skillCategory === "backend" && [
                          { name: "Node.js", level: "Intermediate", icon: <FaNodeJs className="h-5 w-5" />, color: "#339933" },
                          { name: "Express.js", level: "Advanced", icon: <SiExpress className="h-5 w-5" />, color: "#808080" },
                          { name: "PostgreSQL", level: "Intermediate", icon: <SiPostgresql className="h-5 w-5" />, color: "#4169E1" },
                          { name: "Drizzle ORM", level: "Intermediate", icon: <Database className="h-5 w-5" />, color: "#C5F74F" },
                          { name: "RESTful APIs", level: "Advanced", icon: <SiPostman className="h-5 w-5" />, color: "#FF6C37" },
                          { name: "Authentication", level: "Intermediate", icon: <FaLock className="h-5 w-5" />, color: "#FFB020" }
                        ].map((skill) => (
                          <div 
                            key={skill.name} 
                            style={{ "--brand-color": skill.color } as React.CSSProperties}
                            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/5 hover:bg-[var(--brand-color)]/[0.04] hover:border-[var(--brand-color)]/30 transition-all duration-300 group relative overflow-hidden shadow-2xs hover:shadow-xs"
                          >
                            <div className="p-2.5 rounded-lg bg-background/80 border border-border/40 group-hover:border-[var(--brand-color)]/20 transition-colors shadow-2xs" style={{ color: skill.color }}>
                              {skill.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold tracking-wide text-foreground group-hover:text-[var(--brand-color)] transition-colors">{skill.name}</div>
                              <div className="text-xs text-muted-foreground">{skill.level}</div>
                            </div>
                            
                            <div 
                              className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                              style={{
                                background: `radial-gradient(120px at 40px 40px, ${skill.color}15, transparent)`
                              }}
                            />
                          </div>
                        ))}

                        {skillCategory === "tools" && [
                          { name: "Git / GitHub", level: "Advanced", icon: <div className="flex gap-1.5"><FaGithub className="h-5 w-5" /></div>, color: "#F05032" },
                          { name: "Vite", level: "Advanced", icon: <SiVite className="h-5 w-5" />, color: "#646CFF" },
                          { name: "pnpm", level: "Advanced", icon: <SiPnpm className="h-5 w-5" />, color: "#F69220" },
                          { name: "VS Code", level: "Expert", icon: <VscCode className="h-5 w-5" />, color: "#007ACC" },
                          { name: "Command Line", level: "Advanced", icon: <FaTerminal className="h-5 w-5" />, color: "#4AF626" },
                          { name: "Figma (Design)", level: "Intermediate", icon: <FaFigma className="h-5 w-5" />, color: "#F24E1E" }
                        ].map((skill) => (
                          <div 
                            key={skill.name} 
                            style={{ "--brand-color": skill.color } as React.CSSProperties}
                            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/5 hover:bg-[var(--brand-color)]/[0.04] hover:border-[var(--brand-color)]/30 transition-all duration-300 group relative overflow-hidden shadow-2xs hover:shadow-xs"
                          >
                            <div className="p-2.5 rounded-lg bg-background/80 border border-border/40 group-hover:border-[var(--brand-color)]/20 transition-colors shadow-2xs" style={{ color: skill.color }}>
                              {skill.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold tracking-wide text-foreground group-hover:text-[var(--brand-color)] transition-colors">{skill.name}</div>
                              <div className="text-xs text-muted-foreground">{skill.level}</div>
                            </div>
                            
                            <div 
                              className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                              style={{
                                background: `radial-gradient(120px at 40px 40px, ${skill.color}15, transparent)`
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : activeTab === "experience" ? (
                    <motion.div
                      key="experience-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Timeline */}
                      <div className="border-l border-border/80 pl-6 space-y-8 relative">
                        
                        {/* Item 1 */}
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary" />
                          <div className="flex justify-between items-baseline gap-2 mb-1.5 flex-wrap">
                            <h4 className="text-base font-semibold text-foreground">Student Developer</h4>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">Present</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Learning & Building Tools</p>
                          <p className="text-sm font-serif text-muted-foreground leading-relaxed">
                            Crafting modular web applications, contributing to local community repositories, and polishing full-stack features using PostgreSQL and React ecosystems.
                          </p>
                        </div>

                        {/* Item 2 */}
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary" />
                          <div className="flex justify-between items-baseline gap-2 mb-1.5 flex-wrap">
                            <h4 className="text-base font-semibold text-foreground">Freelance Developer</h4>
                            <span className="text-xs text-muted-foreground">2025 - Present</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Independent Work</p>
                          <p className="text-sm font-serif text-muted-foreground leading-relaxed">
                            Delivering optimized static landing sites and online portfolios. Setting up responsive grids, web analytics, and SEO best practices.
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="education-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Timeline */}
                      <div className="border-l border-border/80 pl-6 space-y-8 relative">
                        
                        {/* Education Item 1 */}
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary" />
                          <div className="flex justify-between items-baseline gap-2 mb-1.5 flex-wrap">
                            <h4 className="text-base font-semibold text-foreground">B.Tech in Computer Science</h4>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">2023 - 2027</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Shri Ramswaroop Memorial College of Engineering and Management, Lucknow</p>
                          <p className="text-sm font-serif text-muted-foreground leading-relaxed">
                            Focusing on core computer science foundations, engineering mathematics, database management, software development principles, and active system design projects.
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-secondary/10 border-y border-border/40 relative">
        <div className="max-w-5xl mx-auto w-full">
          
          <div className="mb-16 text-center md:text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Selected Work</span>
            <h2 className="text-3xl md:text-4xl font-semibold font-serif tracking-tight mt-2">Projects built with intent.</h2>
            <p className="text-muted-foreground font-serif mt-2 max-w-lg">
              Explore live functional previews directly below. Interact with the widgets to experience the code.
            </p>
          </div>

          <div className="space-y-28">
            
            {/* Project 1 (Weather) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Image / Live Widget Container */}
              <div className="lg:col-span-7 order-1">
                <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-md relative group">
                  
                  {/* Browser Frame Header */}
                  <div className="h-10 border-b border-border/40 flex items-center justify-between px-4 bg-secondary/35">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>
                    <div className="text-[10px] font-mono tracking-wide text-muted-foreground bg-background/50 px-4 py-0.5 rounded-sm">
                      weather-aqi.iqra.dev
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Widget Body */}
                  <div className="p-6 md:p-8 bg-background/40 min-h-[300px] flex flex-col justify-between">
                    
                    {/* Cities Switcher Toggles */}
                    <div className="flex gap-2 mb-6 border-b border-border/30 pb-4">
                      {["sf", "tokyo", "london"].map((city) => (
                        <button
                          key={city}
                          onClick={() => setSelectedCity(city as any)}
                          className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${selectedCity === city ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}
                        >
                          {city === "sf" ? "San Francisco" : city === "tokyo" ? "Tokyo" : "London"}
                        </button>
                      ))}
                    </div>

                    {/* Animated Content Grid */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedCity}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-1"
                      >
                        {/* Stats Panel */}
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs text-muted-foreground uppercase font-semibold font-sans tracking-wide">Selected Location</span>
                            <div className="text-xl font-bold font-serif">{weather.label}</div>
                          </div>
                          
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter font-sans">{weather.temp}°F</span>
                            <span className="text-sm font-serif text-muted-foreground capitalize">{weather.condition}</span>
                          </div>
                        </div>

                        {/* AQI Panel */}
                        <div className="p-4 rounded-xl border border-border/40 bg-secondary/15 flex flex-col justify-between h-full min-h-[120px]">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Compass className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "12s" }} />
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AQI Status</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${weather.aqi < 50 ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                              {weather.desc}
                            </span>
                          </div>
                          
                          <div className="mt-4">
                            <div className="text-3xl font-black text-foreground">{weather.aqi}</div>
                            <div className="w-full bg-border/40 h-2 rounded-full mt-2 overflow-hidden">
                              <motion.div 
                                className={`h-full ${weather.aqi < 50 ? "bg-emerald-500" : "bg-yellow-500"}`}
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.min(weather.aqi, 100)}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Footer decoration */}
                    <div className="flex justify-between items-center border-t border-border/30 pt-4 mt-6 text-xs text-muted-foreground font-serif">
                      <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> Real-time feed simulated</span>
                      <span>Chart.js render active</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className="lg:col-span-5 order-2 flex flex-col justify-center space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Featured Project</span>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight font-serif">Weather & Air Quality dashboard</h3>
                <p className="text-muted-foreground font-serif leading-relaxed">
                  A minimal dashboard showcasing local air quality index metrics and real-time weather alerts. Built with the focus of streamlining complex API payload parameters into a clean, typographic reading experience.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "OpenWeather API", "CSS variables", "Framer Motion"].map((tag) => (
                    <span key={tag} className="text-xs bg-secondary/35 px-3 py-1 rounded-full text-muted-foreground border border-border/30">{tag}</span>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="rounded-full hover:bg-primary hover:text-primary-foreground group" asChild>
                    <a href="https://github.com/Iqras519/aqi_project" target="_blank" rel="noreferrer noopener">
                      View GitHub Repository <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>

            </div>

            {/* Project 2 (Study Tracker / Pomodoro) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Text Description */}
              <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Featured Project</span>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight font-serif">Productivity & Pomodoro Hub</h3>
                <p className="text-muted-foreground font-serif leading-relaxed">
                  An interactive task organizer and study timer that helps students maintain deep-focus intervals. Users can customize sessions, checklist key task milestones, and track session logs.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "Local Storage", "Framer Motion", "Tailwind CSS"].map((tag) => (
                    <span key={tag} className="text-xs bg-secondary/35 px-3 py-1 rounded-full text-muted-foreground border border-border/30">{tag}</span>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="rounded-full hover:bg-primary hover:text-primary-foreground group" asChild>
                    <a href="#">
                      View Live Version <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Image / Live Widget Container */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-md relative group">
                  
                  {/* Browser Frame Header */}
                  <div className="h-10 border-b border-border/40 flex items-center justify-between px-4 bg-secondary/35">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>
                    <div className="text-[10px] font-mono tracking-wide text-muted-foreground bg-background/50 px-4 py-0.5 rounded-sm">
                      focus-hub.iqra.dev
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Widget Body */}
                  <div className="p-6 md:p-8 bg-background/40 min-h-[300px] grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left: Pomodoro Timer Widget */}
                    <div className="flex flex-col justify-between items-center p-4 rounded-xl border border-border/40 bg-background/35 text-center">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Pomodoro Timer</span>
                      
                      <div className="my-6">
                        <div className="text-4xl font-black font-sans tracking-tight tabular-nums">
                          {formatTime(timeLeft)}
                        </div>
                        <span className="text-[10px] text-primary tracking-wide uppercase font-semibold">
                          {timerRunning ? "Focus Session Active" : "Session Paused"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={toggleTimer}
                          className="rounded-full h-8 px-4"
                        >
                          {timerRunning ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                          {timerRunning ? "Pause" : "Start"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={resetTimer}
                          className="rounded-full h-8 px-3"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Right: Checklists Tracker */}
                    <div className="flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                          <span>Focus Checklist</span>
                          <span className="tabular-nums">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-border/30 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {tasks.map((task) => (
                          <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/25 border border-transparent hover:border-border/30 cursor-pointer transition-all"
                          >
                            <span className="flex-shrink-0 text-primary">
                              {task.done ? (
                                <CheckCircle2 className="h-4 w-4 fill-primary/10" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-muted-foreground/60 hover:border-primary transition-colors" />
                              )}
                            </span>
                            <span className={`text-xs font-medium transition-all ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Project 3 (Crypto Tracker) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Image / Live Widget Container */}
              <div className="lg:col-span-7 order-1">
                <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-md relative group">
                  
                  {/* Browser Frame Header */}
                  <div className="h-10 border-b border-border/40 flex items-center justify-between px-4 bg-secondary/35">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>
                    <div className="text-[10px] font-mono tracking-wide text-muted-foreground bg-background/50 px-4 py-0.5 rounded-sm">
                      crypto-hub.iqra.dev
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Widget Body */}
                  <div className="p-6 md:p-8 bg-background/40 min-h-[300px] flex flex-col justify-between">
                    
                    {/* Coin Selector Toggles */}
                    <div className="flex gap-2 mb-6 border-b border-border/30 pb-4">
                      {["btc", "eth", "sol"].map((coinKey) => (
                        <button
                          key={coinKey}
                          onClick={() => setSelectedCoin(coinKey as any)}
                          className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1.5 ${selectedCoin === coinKey ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cryptoData[coinKey].color }} />
                          {cryptoData[coinKey].name}
                        </button>
                      ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-1">
                      
                      {/* Left Side: Stats and Chart */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">Live Price</span>
                            <div className="text-2xl font-black font-sans tracking-tight">${activeCoin.price.toLocaleString()}</div>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center gap-0.5">
                            <ArrowUpRight className="h-3 w-3" />
                            {activeCoin.change}%
                          </span>
                        </div>

                        {/* Interactive Dynamic SVG Area Chart */}
                        <div className="py-2">
                          {(() => {
                            const trend = activeCoin.trend;
                            const min = Math.min(...trend);
                            const max = Math.max(...trend);
                            const range = max - min || 1;
                            const points = trend.map((val, index) => {
                              const x = (index / (trend.length - 1)) * 260 + 20;
                              const y = 80 - ((val - min) / range) * 60;
                              return { x, y };
                            });

                            const linePath = `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                            const areaPath = `${linePath} L ${points[points.length - 1].x} 90 L ${points[0].x} 90 Z`;

                            return (
                              <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 100">
                                <defs>
                                  <linearGradient id={`gradient-${selectedCoin}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={activeCoin.color} stopOpacity={0.2} />
                                    <stop offset="100%" stopColor={activeCoin.color} stopOpacity={0.0} />
                                  </linearGradient>
                                </defs>
                                <path d={areaPath} fill={`url(#gradient-${selectedCoin})`} />
                                <path d={linePath} fill="none" stroke={activeCoin.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                {points.map((p, i) => (
                                  <circle key={i} cx={p.x} cy={p.y} r="3.5" className="fill-background stroke-current" style={{ color: activeCoin.color }} strokeWidth="1.5" />
                                ))}
                              </svg>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Right Side: Wallet Holdings Simulation */}
                      <div className="p-4 rounded-xl border border-border/40 bg-secondary/15 flex flex-col justify-between h-full min-h-[140px] space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-primary" />
                            Mock Wallet
                          </span>
                          <span className="text-xs font-bold tabular-nums text-foreground">
                            USD: ${cryptoBalance.toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">Your Holdings</div>
                          <div className="flex justify-between items-baseline mt-1">
                            <span className="text-lg font-black font-sans text-foreground tabular-nums">
                              {cryptoHoldings[selectedCoin].toFixed(4)} {activeCoin.symbol}
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              ≈ ${(cryptoHoldings[selectedCoin] * activeCoin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleCryptoTrade("buy")}
                            className="flex-1 rounded-full text-xs h-8"
                          >
                            Buy $500
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCryptoTrade("sell")}
                            className="flex-1 rounded-full text-xs h-8"
                          >
                            Sell $500
                          </Button>
                        </div>
                      </div>

                    </div>

                    {/* Footer decoration */}
                    <div className="flex justify-between items-center border-t border-border/30 pt-4 mt-6 text-xs text-muted-foreground font-serif">
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Interactive balance simulation</span>
                      <span>Real-time price feed mockup</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className="lg:col-span-5 order-2 flex flex-col justify-center space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Featured Project</span>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight font-serif">Crypto Holdings & Market Analytics</h3>
                <p className="text-muted-foreground font-serif leading-relaxed">
                  A cryptocurrency dashboard and wallet simulator. Built to demonstrate live SVG vector chart plotting, dynamic mock portfolio updates, and stateful wallet transactions with custom validation systems.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "SVG Rendering", "Lucide Icons", "Tailwind CSS"].map((tag) => (
                    <span key={tag} className="text-xs bg-secondary/35 px-3 py-1 rounded-full text-muted-foreground border border-border/30">{tag}</span>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="rounded-full hover:bg-primary hover:text-primary-foreground group" asChild>
                    <a href="https://github.com/Iqras519/crypto-holdings" target="_blank" rel="noreferrer noopener">
                      View GitHub Repository <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>

            </div>

            {/* Project 4 (Crop Disease Predictor) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Text Description */}
              <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Featured ML & Computer Vision Project</span>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight font-serif">AgroShield AI: Crop Disease Predictor</h3>
                <p className="text-muted-foreground font-serif leading-relaxed">
                  An end-to-end plant pathology diagnostics tool. It simulates crop leaf disease detection using a ResNet-based Convolutional Neural Network (CNN) and Computer Vision contour maps. Users can load standard crop leaf samples (Tomato, Potato, Corn, Wheat) or upload their own images to extract CV edge maps, trigger attention heatmaps (Grad-CAM), and receive detailed machine learning-powered treatment recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["CNN (ResNet-50)", "Grad-CAM Heatmaps", "OpenCV Contours", "React"].map((tag) => (
                    <span key={tag} className="text-xs bg-secondary/35 px-3 py-1 rounded-full text-muted-foreground border border-border/30">{tag}</span>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="rounded-full hover:bg-primary hover:text-primary-foreground group" asChild>
                    <a href="https://github.com/Iqras519/agroshield-ai" target="_blank" rel="noreferrer noopener">
                      View GitHub Repository <ExternalLink className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Image / Live Widget Container */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-md relative group">
                  
                  {/* Browser Frame Header */}
                  <div className="h-10 border-b border-border/40 flex items-center justify-between px-4 bg-secondary/35">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>
                    <div className="text-[10px] font-mono tracking-wide text-muted-foreground bg-background/50 px-4 py-0.5 rounded-sm">
                      agroshield.iqra.dev
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Widget Body */}
                  <div className="p-6 md:p-8 bg-background/40 min-h-[300px] flex flex-col justify-between">
                    
                    {/* Crop Selector Toggles */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-6 border-b border-border/30 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {["tomato", "potato", "corn", "wheat"].map((cropKey) => (
                          <button
                            key={cropKey}
                            onClick={() => runCropAnalysis(cropKey as any)}
                            className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1.5 ${selectedCrop === cropKey ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {cropDataRecords[cropKey].name}
                          </button>
                        ))}
                      </div>
                      
                      {/* Hidden File Input */}
                      <input 
                        type="file" 
                        id="leaf-upload-input" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleCropImageUpload}
                      />
                      
                      <button
                        onClick={() => {
                          if (selectedCrop === 'custom' && customCropImage) {
                            runCropAnalysis('custom');
                          } else {
                            setSelectedCrop('custom');
                            document.getElementById('leaf-upload-input')?.click();
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1.5 ${selectedCrop === "custom" ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}
                      >
                        <Camera className="h-3 w-3" />
                        {customCropImage ? "Re-upload" : "Upload Specimen"}
                      </button>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch flex-1">
                      
                      {/* Left Side: Viewfinder Visualizer */}
                      <div 
                        className="relative min-h-[240px] bg-black/10 dark:bg-black/35 rounded-xl border border-border/40 flex items-center justify-center cursor-pointer group/uploader overflow-hidden"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setCustomCropImage(event.target?.result as string);
                              setCustomCropName(file.name);
                              runCropAnalysis("custom");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        onClick={() => {
                          if (selectedCrop === 'custom') {
                            document.getElementById('leaf-upload-input')?.click();
                          }
                        }}
                      >
                        {/* Scan Line Overlay */}
                        {cropScanning ? (
                          <div className="absolute inset-0 z-10 bg-background/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-4">
                            <motion.div 
                              className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10B981,0_0_15px_#10B981] z-20"
                              animate={{ top: ["0%", "100%", "0%"] }}
                              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            />
                            <Cpu className="h-8 w-8 text-emerald-500 animate-pulse mb-3" />
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500 text-center mb-1">
                              Analyzing Specimen
                            </div>
                            <div className="text-[9px] font-mono text-muted-foreground text-center tabular-nums max-w-[180px] truncate">
                              {cropScanProgress}% - {cropScanText}
                            </div>
                            <div className="w-[100px] bg-border/40 h-1 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${cropScanProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* View Mode controls */}
                            {(selectedCrop !== 'custom' || customCropImage) && (
                              <div className="absolute bottom-2 right-2 z-10 flex border border-border/60 bg-background/85 backdrop-blur-xs p-0.5 rounded-lg shadow-2xs">
                                {(["original", "cv", "cnn"] as const).map((mode) => (
                                  <button
                                    key={mode}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCropViewMode(mode);
                                    }}
                                    className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-md transition-all font-semibold ${cropViewMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                  >
                                    {mode === "original" ? "Original" : mode === "cv" ? "CV Edge" : "CNN CAM"}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Leaf Content Rendering */}
                            {selectedCrop === 'custom' && !customCropImage ? (
                              <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground select-none">
                                <Camera className="h-10 w-10 text-muted-foreground/60 mb-2 group-hover/uploader:text-primary transition-colors" />
                                <p className="text-xs font-semibold text-foreground mb-0.5">Upload Custom Leaf</p>
                                <p className="text-[9px] text-muted-foreground max-w-[160px]">Drag & drop leaf image here, or click to upload</p>
                              </div>
                            ) : selectedCrop === 'custom' && customCropImage ? (
                              <div className="w-full h-full relative flex items-center justify-center p-4">
                                <img 
                                  src={customCropImage} 
                                  alt={customCropName || "Custom crop"} 
                                  className={`max-w-full max-h-[180px] object-contain rounded-lg transition-all ${
                                    cropViewMode === "cv" ? "filter grayscale contrast-[3] brightness-[0.7]" : 
                                    cropViewMode === "cnn" ? "opacity-45" : ""
                                  }`}
                                />
                                {cropViewMode === "cv" && (
                                  <>
                                    <div className="absolute inset-[15%] border-2 border-dashed border-red-500 animate-pulse rounded pointer-events-none flex items-start justify-start p-1">
                                      <span className="bg-red-500 text-white font-mono text-[7px] px-1 rounded">Spot Detected: 91.5%</span>
                                    </div>
                                    <div className="absolute inset-[30%] border border-orange-500 rounded-full animate-ping opacity-25 pointer-events-none" />
                                  </>
                                )}
                                {cropViewMode === "cnn" && (
                                  <div 
                                    className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-80 rounded-lg"
                                    style={{
                                      background: `radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.7) 0%, rgba(245, 158, 11, 0.45) 40%, rgba(59, 130, 246, 0.15) 75%, transparent 100%)`
                                    }}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-full h-[180px] max-w-[180px] overflow-visible" viewBox="0 0 200 200">
                                  <defs>
                                    <radialGradient id="cam-tomato-1" cx="40%" cy="35%" r="22%">
                                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                                      <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
                                      <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.3" />
                                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </radialGradient>
                                    <radialGradient id="cam-tomato-2" cx="60%" cy="50%" r="25%">
                                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
                                      <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </radialGradient>
                                    
                                    <radialGradient id="cam-potato-1" cx="30%" cy="40%" r="30%">
                                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                                      <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </radialGradient>
                                    <radialGradient id="cam-potato-2" cx="70%" cy="55%" r="28%">
                                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                                      <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </radialGradient>
                                    
                                    <radialGradient id="cam-corn" cx="50%" cy="50%" r="35%">
                                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.7" />
                                      <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.5" />
                                      <stop offset="80%" stopColor="#3B82F6" stopOpacity="0.25" />
                                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </radialGradient>

                                    <radialGradient id="cam-wheat" cx="50%" cy="45%" r="40%">
                                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
                                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </radialGradient>
                                  </defs>

                                  {selectedCrop === "tomato" && (
                                    <g>
                                      <path 
                                        d="M 100 25 C 65 55, 45 100, 100 165 C 155 100, 135 55, 100 25 Z" 
                                        fill={cropViewMode === "original" ? "#22C55E" : cropViewMode === "cv" ? "rgba(34,197,94,0.03)" : "#334155"} 
                                        stroke={cropViewMode === "cv" ? "#10B981" : "#166534"} 
                                        strokeWidth="2"
                                        strokeDasharray={cropViewMode === "cv" ? "3,3" : "none"}
                                        className="transition-colors duration-300"
                                      />
                                      <path d="M 100 25 L 100 165" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.3)" : "#166534"} strokeWidth="1.5" />
                                      <path d="M 100 55 Q 75 70 55 85" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 55 Q 125 70 145 85" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 95 Q 70 115 50 135" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 95 Q 130 115 150 135" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 165 L 100 185" stroke="#78350F" strokeWidth="3" />

                                      {cropViewMode === "original" && (
                                        <g>
                                          <circle cx={80} cy={70} r={9} className="fill-yellow-400/40" />
                                          <circle cx={80} cy={70} r={5} fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
                                          <circle cx={80} cy={70} r={2} fill="#451A03" />
                                          
                                          <circle cx={120} cy={100} r={11} className="fill-yellow-400/40" />
                                          <circle cx={120} cy={100} r={7} fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
                                          <circle cx={120} cy={100} r={3.5} fill="#451A03" />
                                          
                                          <circle cx={70} cy={120} r={7} className="fill-yellow-400/35" />
                                          <circle cx={70} cy={120} r={4} fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
                                          <circle cx={70} cy={120} r={2} fill="#451A03" />
                                        </g>
                                      )}

                                      {cropViewMode === "cv" && (
                                        <g>
                                          <path d="M 72 70 Q 75 60 88 68 Q 90 75 80 80 Q 70 78 72 70 Z" stroke="#F97316" strokeWidth="1.2" fill="none" />
                                          <rect x={66} y={56} width={28} height={28} stroke="#EF4444" strokeWidth="1" fill="none" className="animate-pulse" />
                                          <text x={66} y={52} fill="#EF4444" fontSize="6" className="font-mono">Early Blight: 94.6%</text>

                                          <path d="M 110 98 Q 112 88 128 92 Q 132 108 120 112 Q 108 108 110 98 Z" stroke="#F97316" strokeWidth="1.2" fill="none" />
                                          <rect x={106} y={86} width={30} height={30} stroke="#EF4444" strokeWidth="1" fill="none" className="animate-pulse" />
                                          <text x={106} y={82} fill="#EF4444" fontSize="6" className="font-mono">Early Blight: 95.8%</text>
                                        </g>
                                      )}

                                      {cropViewMode === "cnn" && (
                                        <g style={{ mixBlendMode: "color-dodge" }}>
                                          <circle cx={80} cy={70} r={32} fill="url(#cam-tomato-1)" />
                                          <circle cx={120} cy={100} r={38} fill="url(#cam-tomato-2)" />
                                          <circle cx={70} cy={120} r={25} fill="url(#cam-tomato-1)" />
                                        </g>
                                      )}
                                    </g>
                                  )}

                                  {selectedCrop === "potato" && (
                                    <g>
                                      <path 
                                        d="M 100 25 C 45 48, 30 100, 100 168 C 170 100, 155 48, 100 25 Z" 
                                        fill={cropViewMode === "original" ? "#15803D" : cropViewMode === "cv" ? "rgba(16,185,129,0.03)" : "#334155"} 
                                        stroke={cropViewMode === "cv" ? "#10B981" : "#166534"} 
                                        strokeWidth="2"
                                        strokeDasharray={cropViewMode === "cv" ? "3,3" : "none"}
                                        className="transition-colors duration-300"
                                      />
                                      <path d="M 100 25 L 100 168" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.3)" : "#166534"} strokeWidth="1.5" />
                                      <path d="M 100 48 Q 70 68 42 88" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 48 Q 130 68 158 88" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 95 Q 65 115 38 135" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 95 Q 135 115 162 135" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.2)" : "#166534"} strokeWidth="1" />
                                      <path d="M 100 168 L 100 185" stroke="#78350F" strokeWidth="3.5" />

                                      {cropViewMode === "original" && (
                                        <g>
                                          <path d="M 38 72 C 30 80 28 95 48 90 C 58 82 52 75 38 72 Z" fill="#2E251E" stroke="#450A0A" strokeWidth="0.8" />
                                          <path d="M 39 74 C 33 80 32 90 45 87" stroke="#84CC16" strokeWidth="0.8" fill="none" opacity="0.6" />
                                          
                                          <path d="M 152 105 C 165 115 160 130 142 122 C 138 115 145 110 152 105 Z" fill="#2E251E" stroke="#450A0A" strokeWidth="0.8" />
                                          <path d="M 150 107 C 158 114 155 125 144 119" stroke="#84CC16" strokeWidth="0.8" fill="none" opacity="0.6" />
                                        </g>
                                      )}

                                      {cropViewMode === "cv" && (
                                        <g>
                                          <rect x={26} y={66} width={28} height={28} stroke="#EF4444" strokeWidth="1" fill="none" className="animate-pulse" />
                                          <text x={26} y={62} fill="#EF4444" fontSize="6" className="font-mono">Late Blight: 98.1%</text>

                                          <rect x={134} y={96} width={32} height={32} stroke="#EF4444" strokeWidth="1" fill="none" className="animate-pulse" />
                                          <text x={134} y={92} fill="#EF4444" fontSize="6" className="font-mono">Late Blight: 97.4%</text>
                                        </g>
                                      )}

                                      {cropViewMode === "cnn" && (
                                        <g style={{ mixBlendMode: "color-dodge" }}>
                                          <circle cx={40} cy={82} r={32} fill="url(#cam-potato-1)" />
                                          <circle cx={150} cy={114} r={30} fill="url(#cam-potato-2)" />
                                        </g>
                                      )}
                                    </g>
                                  )}

                                  {selectedCrop === "corn" && (
                                    <g>
                                      <path 
                                        d="M 30 165 C 60 125 120 65 180 25 C 145 65 90 115 30 165 Z" 
                                        fill={cropViewMode === "original" ? "#84CC16" : cropViewMode === "cv" ? "rgba(16,185,129,0.03)" : "#334155"} 
                                        stroke={cropViewMode === "cv" ? "#10B981" : "#4D7C0F"} 
                                        strokeWidth="2"
                                        strokeDasharray={cropViewMode === "cv" ? "3,3" : "none"}
                                        className="transition-colors duration-300"
                                      />
                                      <path d="M 30 165 C 85 105 140 55 180 25" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.3)" : "#4D7C0F"} strokeWidth="1.5" />
                                      <path d="M 35 160 C 80 108 130 63 170 33" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.15)" : "#65A30D"} strokeWidth="0.8" />
                                      <path d="M 28 168 C 75 115 120 70 160 40" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.15)" : "#65A30D"} strokeWidth="0.8" />

                                      {cropViewMode === "original" && (
                                        <g fill="#A16207" stroke="#EA580C" strokeWidth="0.5">
                                          <circle cx={75} cy={125} r={1.5} />
                                          <circle cx={82} cy={118} r={2} />
                                          <circle cx={92} cy={115} r={1.5} />
                                          <circle cx={100} cy={102} r={2.5} fill="#78350F" />
                                          <circle cx={108} cy={95} r={1.5} />
                                          <circle cx={120} cy={88} r={2} />
                                          <circle cx={126} cy={76} r={2.5} fill="#78350F" />
                                          <circle cx={138} cy={72} r={1.5} />
                                          <circle cx={145} cy={60} r={2} />
                                        </g>
                                      )}

                                      {cropViewMode === "cv" && (
                                        <g>
                                          <rect x={70} y={55} width={80} height={80} stroke="#EF4444" strokeWidth="1" fill="none" className="animate-pulse" />
                                          <text x={70} y={50} fill="#EF4444" fontSize="6" className="font-mono">Pustules: 92.3%</text>
                                          <circle cx={100} cy={102} r={5} stroke="#F97316" strokeWidth="0.8" fill="none" />
                                          <circle cx={126} cy={76} r={5} stroke="#F97316" strokeWidth="0.8" fill="none" />
                                        </g>
                                      )}

                                      {cropViewMode === "cnn" && (
                                        <g style={{ mixBlendMode: "color-dodge" }}>
                                          <circle cx={110} cy={95} r={45} fill="url(#cam-corn)" />
                                        </g>
                                      )}
                                    </g>
                                  )}

                                  {selectedCrop === "wheat" && (
                                    <g>
                                      <path 
                                        d="M 100 170 C 80 125 80 50 100 15 C 120 50 120 125 100 170 Z" 
                                        fill={cropViewMode === "original" ? "#22C55E" : cropViewMode === "cv" ? "rgba(16,185,129,0.03)" : "#334155"} 
                                        stroke={cropViewMode === "cv" ? "#10B981" : "#166534"} 
                                        strokeWidth="2"
                                        strokeDasharray={cropViewMode === "cv" ? "3,3" : "none"}
                                        className="transition-colors duration-300"
                                      />
                                      <path d="M 100 170 L 100 15" stroke={cropViewMode === "cv" ? "rgba(16,185,129,0.3)" : "#166534"} strokeWidth="1.5" />
                                      <path d="M 100 170 L 100 185" stroke="#78350F" strokeWidth="2.5" />

                                      {cropViewMode === "cv" && (
                                        <g>
                                          <rect x={76} y={12} width={48} height={160} stroke="#10B981" strokeWidth="1" fill="none" />
                                          <text x={100} y={8} textAnchor="middle" fill="#10B981" fontSize="6" className="font-mono">Healthy: 99.2%</text>
                                        </g>
                                      )}

                                      {cropViewMode === "cnn" && (
                                        <g style={{ mixBlendMode: "color-dodge" }}>
                                          <ellipse cx={100} cy={92} rx={18} ry={60} fill="url(#cam-wheat)" />
                                        </g>
                                      )}
                                    </g>
                                  )}
                                </svg>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Right Side: Diagnostics HUD Card */}
                      <div className="flex flex-col justify-between h-full space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> ResNet CNN Inference</span>
                          <span className="font-mono tabular-nums text-foreground">{cropScanning ? "Scanning..." : activeCropData.inferenceSpeed}</span>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-0.5">
                            <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Classification Result</div>
                            <div className="text-base font-bold font-serif text-foreground leading-tight">
                              {cropScanning ? "Analyzing features..." : (selectedCrop === 'custom' && !customCropImage) ? "Specimen Upload Needed" : activeCropData.disease}
                            </div>
                            {selectedCrop === 'custom' && customCropImage && !cropScanning && (
                              <div className="text-[9px] text-muted-foreground italic truncate">Source: {customCropName}</div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2.5 rounded-xl border border-border/40 bg-secondary/10 flex flex-col justify-between">
                              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Confidence</span>
                              <div className="flex items-baseline gap-0.5 mt-0.5">
                                <span className="text-lg font-black font-sans text-foreground tabular-nums leading-none">
                                  {cropScanning ? "--.-" : (selectedCrop === 'custom' && !customCropImage) ? "0.0" : activeCropData.confidence.toFixed(1)}
                                </span>
                                <span className="text-[10px] text-muted-foreground">%</span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl border border-border/40 bg-secondary/10 flex flex-col justify-between">
                              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Severity</span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1.5 text-center leading-none ${
                                cropScanning ? 'bg-secondary/40 text-muted-foreground' :
                                activeCropData.severity === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                activeCropData.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                activeCropData.severity === 'low' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              }`}>
                                {cropScanning ? "Scanning" : (selectedCrop === 'custom' && !customCropImage) ? "None" : activeCropData.severity}
                              </span>
                            </div>
                          </div>
                        </div>

                        {cropScanning ? (
                          <div className="p-3 rounded-lg border border-dashed border-border/30 text-center text-[10px] text-muted-foreground py-8 animate-pulse">
                            Convolutional feature maps are being generated. Extracting color histogram values and contour edge coordinates...
                          </div>
                        ) : (selectedCrop === 'custom' && !customCropImage) ? (
                          <div className="p-3 rounded-lg border border-dashed border-border/30 text-center text-[10px] text-muted-foreground py-8">
                            Please select a predefined crop or upload a leaf image to start the machine learning pathology analysis.
                          </div>
                        ) : (
                          <div className="space-y-2 text-xs">
                            <div className="border-t border-border/20 pt-2">
                              <span className="font-semibold text-foreground uppercase tracking-wide text-[8px] block mb-0.5">Identified Pathogen:</span>
                              <span className="font-serif text-muted-foreground italic text-[11px] leading-tight block">{activeCropData.scientificName} ({activeCropData.pathogen})</span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground uppercase tracking-wide text-[8px] block mb-0.5">Symptom Summary:</span>
                              <p className="font-serif text-muted-foreground leading-tight text-[11px]">{activeCropData.symptoms}</p>
                            </div>
                            
                            <div className="border-t border-border/20 pt-2">
                              <span className="font-semibold text-foreground uppercase tracking-wide text-[8px] block mb-1 flex items-center gap-1">
                                <ShieldAlert className="h-2.5 w-2.5 text-primary animate-pulse" /> ML Recommendation Engine
                              </span>
                              <div className="space-y-1 max-h-[85px] overflow-y-auto pr-1">
                                {activeCropData.recommendations.chemical.map((rec, i) => (
                                  <div key={i} className="flex gap-1.5 text-[9px] leading-normal">
                                    <span className="text-primary font-bold text-[7px] uppercase px-1 rounded bg-primary/10 h-fit mt-0.5 flex-shrink-0">Chem</span>
                                    <span className="text-muted-foreground font-serif">{rec}</span>
                                  </div>
                                ))}
                                {activeCropData.recommendations.organic.map((rec, i) => (
                                  <div key={i} className="flex gap-1.5 text-[9px] leading-normal">
                                    <span className="text-emerald-500 font-bold text-[7px] uppercase px-1 rounded bg-emerald-500/10 h-fit mt-0.5 flex-shrink-0">Bio</span>
                                    <span className="text-muted-foreground font-serif">{rec}</span>
                                  </div>
                                ))}
                                {activeCropData.recommendations.cultural.map((rec, i) => (
                                  <div key={i} className="flex gap-1.5 text-[9px] leading-normal">
                                    <span className="text-blue-500 font-bold text-[7px] uppercase px-1 rounded bg-blue-500/10 h-fit mt-0.5 flex-shrink-0">Cult</span>
                                    <span className="text-muted-foreground font-serif">{rec}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Footer decoration */}
                    <div className="flex justify-between items-center border-t border-border/30 pt-4 mt-6 text-xs text-muted-foreground font-serif">
                      <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> Grad-CAM map overlays enabled</span>
                      <span>Dataset: PlantVillage v2</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-xl mx-auto w-full text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">Let's Connect</span>
          <h2 className="text-3xl md:text-4xl font-semibold font-serif tracking-tight mt-2 mb-6">Start a conversation.</h2>
          <p className="text-muted-foreground font-serif leading-relaxed mb-10">
            Have an interesting opportunity or want to collaborate? Submit the form below or email me directly at <a href="mailto:iqrashamim8546@gmail.com" className="text-primary hover:underline font-sans font-medium">iqrashamim8546@gmail.com</a>.
          </p>

          <AnimatePresence mode="wait">
            {!contactSuccess ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 text-left p-6 md:p-8 rounded-2xl glass-card border border-border/50 shadow-sm"
              >
                {/* Name field */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className={`rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className={`rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Tell me about your project, timeline, or details..."
                    className={`rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary resize-none ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("message")}
                  />
                  {errors.message && <p className="text-xs text-destructive font-medium">{errors.message.message}</p>}
                </div>

                {/* Submit button */}
                <Button 
                  type="submit" 
                  className="w-full rounded-xl py-6 font-semibold shadow-sm hover:shadow transition-all flex justify-center items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>

              </motion.form>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 rounded-2xl glass-card border border-border/50 shadow-sm text-center flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/25">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif">Message Received!</h3>
                  <p className="text-muted-foreground text-sm font-serif mt-2 leading-relaxed max-w-sm">
                    Thank you for writing! Your email has been parsed. I will review and reply within 24 hours.
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setContactSuccess(false)}
                  className="rounded-full"
                >
                  Send another message
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30 bg-secondary/5 font-sans relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground font-serif">
            &copy; {new Date().getFullYear()} Iqra Shamim. Crafted with code and intent.
          </div>
          <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
