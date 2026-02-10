import { Button } from "@/components/ui/button";
import { FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full border-2 border-border bg-card p-8 md:p-12 space-y-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
        {/* 404 Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary/20 rotate-6 translate-x-1" />
          <div className="relative w-full h-full bg-white border-2 border-primary flex items-center justify-center">
            <span className="text-4xl font-black text-primary">404</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Page Not Found
          </h1>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-14 font-black uppercase tracking-widest transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="w-full border-2 border-border rounded-none h-14 font-black uppercase tracking-widest hover:bg-muted transition-all"
          >
            <Link href="/courses">
              <Search className="mr-2 h-5 w-5" />
              Browse Courses
            </Link>
          </Button>
        </div>

        {/* Help Link */}
        <div className="pt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <FileQuestion className="w-3 h-3" />
          <span>Lost? <Link href="/support" className="text-primary hover:underline">Visit Support</Link></span>
        </div>
      </div>
    </div>
  );
}
