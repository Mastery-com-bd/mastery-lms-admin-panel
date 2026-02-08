"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full border-2 border-border bg-card p-8 md:p-12 space-y-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 bg-red-50 border-2 border-red-200 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            An unexpected error occurred while processing your request. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground opacity-50">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-none h-14 font-black uppercase tracking-widest transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="w-full border-2 border-border rounded-none h-14 font-black uppercase tracking-widest hover:bg-muted transition-all"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back Home
            </Link>
          </Button>
        </div>

        {/* Footer Support */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pt-4">
          Need help? <Link href="/support" className="text-red-600 hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
