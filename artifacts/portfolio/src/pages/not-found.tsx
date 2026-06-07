import { Link } from "wouter";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-hidden px-6">
      
      {/* Background glow circle */}
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-primary/5 rounded-full filter blur-[70px] animate-pulse-glow" />

      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6 relative z-10">
        
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <FileQuestion className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-serif tracking-tight text-foreground">404 — Lost Page</h1>
          <p className="text-sm font-serif text-muted-foreground leading-relaxed">
            The page you are looking for does not exist or has been relocated. Let's get you back.
          </p>
        </div>

        <Button className="w-full rounded-xl py-6 font-semibold shadow-sm hover:shadow transition-all group" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Homepage
          </Link>
        </Button>
        
      </div>
    </div>
  );
}
