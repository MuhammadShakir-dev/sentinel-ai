import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <header className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-foreground grid place-items-center">
            <Shield className="h-4 w-4 text-background" />
          </div>
          <span className="text-base font-semibold tracking-tight">CyberShield</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl tracking-tight font-semibold">
              {title.split(" ").slice(0,-1).join(" ")}{" "}
              <span className="font-serif italic font-normal">{title.split(" ").slice(-1)}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 shadow-soft p-7">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
