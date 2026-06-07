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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  
  // Active category in Skills/Experience tabs
  const [activeTab, setActiveTab] = useState<"skills" | "experience">("skills");
  
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
            Iqra<span className="text-primary font-sans font-light">.</span>
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
                className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border border-border/60 shadow-md"
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
            
             I am Iqra, a student developer focused on engineering minimal, visually stunning, and highly functional digital tools that resolve real-world tasks.
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
                <a href="#" className="p-2 rounded-full border border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors">
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
              <div className="flex border-b border-border/60 mb-8 p-1 bg-secondary/15 rounded-lg max-w-[280px]">
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
                          { name: "React", level: "Advanced", icon: <Code2 className="h-4 w-4 text-primary" /> },
                          { name: "TypeScript", level: "Intermediate", icon: <Code2 className="h-4 w-4 text-primary" /> },
                          { name: "Tailwind CSS", level: "Advanced", icon: <Code2 className="h-4 w-4 text-primary" /> },
                          { name: "Framer Motion", level: "Intermediate", icon: <Code2 className="h-4 w-4 text-primary" /> },
                          { name: "Next.js", level: "Intermediate", icon: <Code2 className="h-4 w-4 text-primary" /> },
                          { name: "HTML5 / CSS3", level: "Advanced", icon: <Code2 className="h-4 w-4 text-primary" /> }
                        ].map((skill) => (
                          <div key={skill.name} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/10 hover:border-primary/30 transition-colors">
                            {skill.icon}
                            <div>
                              <div className="text-sm font-semibold">{skill.name}</div>
                              <div className="text-xs text-muted-foreground">{skill.level}</div>
                            </div>
                          </div>
                        ))}

                        {skillCategory === "backend" && [
                          { name: "Node.js", level: "Intermediate", icon: <Database className="h-4 w-4 text-primary" /> },
                          { name: "Express.js", level: "Advanced", icon: <Database className="h-4 w-4 text-primary" /> },
                          { name: "PostgreSQL", level: "Intermediate", icon: <Database className="h-4 w-4 text-primary" /> },
                          { name: "Drizzle ORM", level: "Intermediate", icon: <Database className="h-4 w-4 text-primary" /> },
                          { name: "RESTful APIs", level: "Advanced", icon: <Database className="h-4 w-4 text-primary" /> },
                          { name: "Authentication", level: "Intermediate", icon: <Database className="h-4 w-4 text-primary" /> }
                        ].map((skill) => (
                          <div key={skill.name} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/10 hover:border-primary/30 transition-colors">
                            {skill.icon}
                            <div>
                              <div className="text-sm font-semibold">{skill.name}</div>
                              <div className="text-xs text-muted-foreground">{skill.level}</div>
                            </div>
                          </div>
                        ))}

                        {skillCategory === "tools" && [
                          { name: "Git / GitHub", level: "Advanced", icon: <Wrench className="h-4 w-4 text-primary" /> },
                          { name: "Vite", level: "Advanced", icon: <Wrench className="h-4 w-4 text-primary" /> },
                          { name: "pnpm", level: "Advanced", icon: <Wrench className="h-4 w-4 text-primary" /> },
                          { name: "VS Code", level: "Expert", icon: <Wrench className="h-4 w-4 text-primary" /> },
                          { name: "Command Line", level: "Advanced", icon: <Wrench className="h-4 w-4 text-primary" /> },
                          { name: "Figma (Design)", level: "Intermediate", icon: <Wrench className="h-4 w-4 text-primary" /> }
                        ].map((skill) => (
                          <div key={skill.name} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/10 hover:border-primary/30 transition-colors">
                            {skill.icon}
                            <div>
                              <div className="text-sm font-semibold">{skill.name}</div>
                              <div className="text-xs text-muted-foreground">{skill.level}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
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

                        {/* Item 3 */}
                        <div className="relative">
                          <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-muted-foreground" />
                          <div className="flex justify-between items-baseline gap-2 mb-1.5 flex-wrap">
                            <h4 className="text-base font-semibold text-foreground">CS Student</h4>
                            <span className="text-xs text-muted-foreground">2023 - Present</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Academic Foundation</p>
                          <p className="text-sm font-serif text-muted-foreground leading-relaxed">
                            Engaging in computer science curricula covering algorithmic efficiency, database design, software engineering methodologies, and security.
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
                    <a href="#">
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

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-xl mx-auto w-full text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">Let's Connect</span>
          <h2 className="text-3xl md:text-4xl font-semibold font-serif tracking-tight mt-2 mb-6">Start a conversation.</h2>
          <p className="text-muted-foreground font-serif leading-relaxed mb-10">
            Have an interesting opportunity or want to collaborate? Submit the form below or email me directly at <a href="mailto:hello@iqra.dev" className="text-primary hover:underline font-sans font-medium">hello@iqra.dev</a>.
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
            &copy; {new Date().getFullYear()} Iqra. Crafted with code and intent.
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
