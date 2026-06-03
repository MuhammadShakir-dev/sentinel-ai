import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Newspaper, Globe, Keyboard, Activity, ArrowRight, ArrowUpRight,
  Check, Plus, Minus, Sparkles, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import heroImg from "@/assets/hero-sculpture.jpg";
import featureNetwork from "@/assets/feature-network.jpg";
import featureFlow from "@/assets/feature-flow.jpg";
import insight1 from "@/assets/insight-1.jpg";
import insight2 from "@/assets/insight-2.jpg";

/* ────────── data ────────── */

const solutions = [
  { kicker: "01", title: "AI-first detection", body: "Behavioral models that learn the rhythm of your network and flag what doesn't belong." },
  { kicker: "02", title: "Calm by design",     body: "A workspace that respects your attention. Every alert is signal, never noise." },
  { kicker: "03", title: "Built for teams",     body: "One platform for four threat surfaces — share verdicts and history across the team." },
];

const services = [
  { title: "Fake news analysis",     desc: "Source bias, factual checks and emotional pattern detection on any article.", icon: Newspaper },
  { title: "Phishing URL scanning",  desc: "Real-time URL reputation, domain age and SSL anomaly checks.",               icon: Globe },
  { title: "Keylogger forensics",    desc: "Process-level behavioral review to surface hidden keystroke loggers.",      icon: Keyboard },
  { title: "DDoS pattern analysis",  desc: "Traffic anomaly detection for volumetric, protocol and layer-7 attacks.",  icon: Activity },
];

const insights = [
  { tag: "Article",  img: insight1, title: "The shape of a modern phishing campaign — and how AI sees it first.",  meta: "8 min read · Research" },
  { tag: "Guide",    img: insight2, title: "Reading a process list like a security analyst: a short field guide.", meta: "6 min read · Practice" },
];

const faqs = [
  { q: "How is CyberShield different from a traditional SIEM?", a: "We're not trying to replace your SIEM. CyberShield gives non-specialist teams a calm, focused workspace for four specific threats with AI-generated verdicts you can act on in seconds." },
  { q: "What AI models power the platform?",                    a: "We use leading hosted models from Google and OpenAI through the Lovable AI Gateway — Gemini 3 Flash for fast classification, with GPT-5 fall-backs for ambiguous cases." },
  { q: "Is my data used to train models?",                      a: "No. Inputs are sent for inference only and are stored in your own private workspace. We never train on your content." },
  { q: "Can I try it before paying?",                           a: "Yes — every account starts on the free Starter plan with no credit card required. Upgrade only when your usage grows." },
];

const plans = [
  { name: "Starter",   price: "Free",  desc: "For individuals exploring the platform.", cta: "Get started",      features: ["Up to 50 scans per month", "All 4 detection tools", "7-day history"] },
  { name: "Team",      price: "$29",   desc: "For small security teams.",                cta: "Start free trial", features: ["Unlimited scans", "Shared workspace", "Priority AI models", "90-day history"], featured: true },
  { name: "Business",  price: "$99",   desc: "For organisations that need more.",        cta: "Contact sales",    features: ["Everything in Team", "SSO & audit log", "Custom retention", "Dedicated support"] },
];

/* ────────── small components ────────── */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
    <span className="h-px w-6 bg-foreground/30" />
    {children}
  </div>
);

const SectionLabel = ({ n, label }: { n: string; label: string }) => (
  <div className="hidden md:flex absolute right-6 top-6 items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
    <span>{label}</span>
    <span>—</span>
    <span>{n}</span>
  </div>
);

/* ────────── page ────────── */

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ───────── Nav ───────── */}
      <header className="absolute top-0 inset-x-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-base font-semibold tracking-tight">CyberShield</span>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-sm text-foreground/70">
            <a href="#solutions" className="hover:text-foreground transition-colors">Solutions</a>
            <a href="#services"  className="hover:text-foreground transition-colors">Services</a>
            <a href="#insights"  className="hover:text-foreground transition-colors">Insights</a>
            <a href="#pricing"   className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq"       className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="rounded-full">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="relative bg-hero pt-32 pb-28 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div className="max-w-xl animate-fade-in-up">
            <h1 className="text-[44px] sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight font-semibold">
              Envision with <span className="font-serif italic font-normal text-foreground/90">AI</span>.<br/>
              Secure with <span className="font-serif italic font-normal text-brand">us</span>.
            </h1>
            <p className="mt-7 text-lg text-muted-foreground max-w-md leading-relaxed">
              A calm, modern cybersecurity workspace. Four AI-powered tools that detect fake news, phishing, keyloggers and DDoS attacks — before they reach the people you protect.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="rounded-full h-12 px-6 bg-foreground text-background hover:bg-foreground/90 shadow-soft">
                  Start free <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="ghost" className="rounded-full h-12 px-5 text-foreground/80 hover:bg-background/60">
                  See the dashboard <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-5 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["A","M","S","K"].map((c,i)=>(
                  <div key={i} className="h-7 w-7 rounded-full ring-2 ring-background bg-gradient-to-br from-primary/70 to-accent/70 grid place-items-center text-[10px] font-medium text-primary-foreground">{c}</div>
                ))}
              </div>
              <span>Trusted by security teams at fast-moving companies</span>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] max-w-[520px] mx-auto rounded-[2rem] overflow-hidden bg-card-grad ring-soft shadow-soft animate-fade-in">
              <img src={heroImg} alt="" className="w-full h-full object-cover" width={1024} height={1024} />
            </div>
            <div className="hidden md:flex absolute -left-6 bottom-10 h-16 px-5 rounded-full glass items-center gap-3 shadow-soft animate-float">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">Real-time AI verdicts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Solutions ───────── */}
      <section id="solutions" className="relative border-t border-border/60">
        <SectionLabel n="01" label="Solutions" />
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Eyebrow>Cybersecurity for the next decade</Eyebrow>
            <h2 className="mt-5 text-4xl md:text-5xl tracking-tight font-semibold">
              Cybersecurity solutions <br className="hidden md:block"/>
              <span className="font-serif italic font-normal text-muted-foreground">for future threats.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl">
              Threats are evolving faster than checklists can keep up. We pair behavioral AI with a focused, opinionated workspace so your team can move at the speed of the problem.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {solutions.map((s) => (
              <div key={s.title} className="rounded-2xl bg-card border border-border/60 p-7 shadow-card-soft hover:shadow-soft transition-shadow">
                <div className="text-xs font-mono text-muted-foreground">{s.kicker}</div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Stay Ahead (two-up) ───────── */}
      <section className="relative border-t border-border/60 bg-soft">
        <SectionLabel n="02" label="Capabilities" />
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-2xl">
            <Eyebrow>Always one step ahead</Eyebrow>
            <h2 className="mt-5 text-4xl md:text-5xl tracking-tight font-semibold">
              Stay ahead of every <br className="hidden md:block"/>
              <span className="font-serif italic font-normal">security challenge.</span>
            </h2>
          </div>

          <div className="mt-14 grid lg:grid-cols-2 gap-6">
            {[
              { img: featureNetwork, title: "Accelerate detection and response to cyber threats", body: "Our models cut through noise to surface the few alerts that actually matter — with confidence scores and reasoning attached." },
              { img: featureFlow,    title: "Secure your hybrid, multi-cloud environment",      body: "From inbox links to network edge, CyberShield watches the surfaces that legacy tools quietly miss." },
            ].map((b) => (
              <article key={b.title} className="group rounded-3xl overflow-hidden bg-card border border-border/60 shadow-card-soft">
                <div className="aspect-[16/9] overflow-hidden bg-muted/40">
                  <img src={b.img} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl tracking-tight font-semibold leading-snug">{b.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{b.body}</p>
                  <a href="#services" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Services / Industries ───────── */}
      <section id="services" className="relative border-t border-border/60">
        <SectionLabel n="03" label="Services" />
        <div className="container mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-[1fr_0.9fr] gap-14 items-start">
          <div>
            <Eyebrow>Built for your work</Eyebrow>
            <h2 className="mt-5 text-4xl md:text-5xl tracking-tight font-semibold">
              Security services <br/>
              <span className="font-serif italic font-normal">for every team.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              Four focused tools that work together. Switch between them in the sidebar; every scan is saved to your history, ready to share.
            </p>
            <div className="mt-10 relative aspect-square max-w-md rounded-[2rem] overflow-hidden bg-hero ring-soft">
              <img src={heroImg} alt="" loading="lazy" className="w-full h-full object-cover opacity-90" />
            </div>
          </div>

          <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card shadow-card-soft">
            {services.map((s) => (
              <li key={s.title} className="flex items-start gap-5 p-6">
                <div className="h-11 w-11 rounded-xl bg-secondary grid place-items-center shrink-0">
                  <s.icon className="h-5 w-5 text-foreground/70" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground mt-1" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Insights ───────── */}
      <section id="insights" className="relative border-t border-border/60 bg-soft">
        <SectionLabel n="04" label="Insights" />
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div className="max-w-xl">
              <Eyebrow>Reading material</Eyebrow>
              <h2 className="mt-5 text-4xl md:text-5xl tracking-tight font-semibold">
                In-depth cybersecurity <br/>
                <span className="font-serif italic font-normal">insights and analysis.</span>
              </h2>
            </div>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground inline-flex items-center gap-1.5">
              All articles <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="space-y-5">
            {insights.map((p) => (
              <article key={p.title} className="grid sm:grid-cols-[280px_1fr] gap-6 p-5 rounded-2xl bg-card border border-border/60 shadow-card-soft hover:shadow-soft transition-shadow group">
                <div className="aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden bg-muted/40">
                  <img src={p.img} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{p.tag}</span>
                  <h3 className="mt-2 text-xl md:text-2xl tracking-tight font-semibold leading-snug max-w-xl">{p.title}</h3>
                  <p className="mt-3 text-xs text-muted-foreground">{p.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Testimonial ───────── */}
      <section className="relative border-t border-border/60">
        <SectionLabel n="05" label="Testimonial" />
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <Eyebrow>Trusted in production</Eyebrow>
          <h2 className="mt-5 text-4xl md:text-5xl tracking-tight font-semibold max-w-2xl">
            Helping companies <br/>
            <span className="font-serif italic font-normal">stay ahead of threats.</span>
          </h2>

          <div className="mt-14 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
            <figure className="rounded-3xl bg-card border border-border/60 p-10 shadow-card-soft">
              <Quote className="h-7 w-7 text-primary mb-6" />
              <blockquote className="text-2xl leading-snug font-serif italic text-foreground/90">
                "CyberShield turned a sprawling problem into a daily, ten-minute practice. Our analysts trust the verdicts, and our PMs finally understand the reports."
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-sm font-medium text-primary-foreground">SC</div>
                <div>
                  <div className="text-sm font-medium">Sarah Chen</div>
                  <div className="text-xs text-muted-foreground">Head of Security, Northwind</div>
                </div>
              </figcaption>
            </figure>
            <div className="rounded-3xl overflow-hidden bg-hero ring-soft min-h-[320px] relative">
              <img src={insight2} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="relative border-t border-border/60 bg-soft">
        <SectionLabel n="06" label="FAQ" />
        <div className="container mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
          <div>
            <Eyebrow>Common questions</Eyebrow>
            <h2 className="mt-5 text-4xl md:text-5xl tracking-tight font-semibold">
              Frequently <br/>
              <span className="font-serif italic font-normal">asked questions.</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-sm">Couldn't find what you were looking for? Email us anytime at <a href="mailto:hello@cybershield.ai" className="text-foreground underline underline-offset-4">hello@cybershield.ai</a>.</p>
          </div>
          <div className="divide-y divide-border/60 border-t border-b border-border/60">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button onClick={() => setOpenFaq(open ? null : i)} className="w-full flex items-center justify-between gap-6 py-6 text-left">
                    <span className="text-lg tracking-tight font-medium">{f.q}</span>
                    <span className="shrink-0 h-8 w-8 rounded-full border border-border/60 grid place-items-center text-muted-foreground">
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {open && <p className="pb-6 -mt-2 text-muted-foreground max-w-2xl leading-relaxed">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pricing" className="relative border-t border-border/60">
        <SectionLabel n="07" label="Pricing" />
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-2xl">
            <Eyebrow>Simple pricing</Eyebrow>
            <h2 className="mt-5 text-4xl md:text-5xl tracking-tight font-semibold">
              Pricing plans <br/>
              <span className="font-serif italic font-normal">for every business.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">Start free. Upgrade when your scans, your team or your retention needs grow.</p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {plans.map((p) => (
              <div key={p.name}
                className={`relative rounded-2xl border p-7 flex flex-col ${
                  p.featured
                    ? "bg-foreground text-background border-foreground shadow-glow"
                    : "bg-card border-border/60 shadow-card-soft"
                }`}>
                {p.featured && (
                  <span className="absolute -top-3 left-7 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full bg-primary text-primary-foreground">Most popular</span>
                )}
                <div className="text-sm font-medium opacity-80">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                  {p.price !== "Free" && <span className="text-sm opacity-70">/mo</span>}
                </div>
                <p className={`mt-2 text-sm ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>{p.desc}</p>

                <ul className="mt-7 space-y-3 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`h-4 w-4 mt-0.5 ${p.featured ? "text-primary" : "text-foreground/60"}`} />
                      <span className={p.featured ? "opacity-90" : "text-foreground/80"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="mt-7">
                  <Button className={`w-full rounded-full ${
                    p.featured
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}>
                    {p.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="relative border-t border-border/60 bg-soft">
        <div className="container mx-auto px-6 py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-end mb-12">
            <h2 className="text-4xl md:text-5xl tracking-tight font-semibold max-w-xl">
              Start your journey <br/>
              <span className="font-serif italic font-normal">with CyberShield today.</span>
            </h2>
            <p className="text-muted-foreground max-w-md">Two ways to begin — both free, both instant.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-card border border-border/60 p-8 shadow-card-soft">
              <h3 className="text-xl font-semibold tracking-tight">Get in touch with our team</h3>
              <p className="mt-2 text-sm text-muted-foreground">Walk us through what you're protecting and we'll help you map it to the right tools.</p>
              <Link to="/signup"><Button className="mt-6 rounded-full bg-foreground text-background hover:bg-foreground/90">Contact us</Button></Link>
            </div>
            <div className="rounded-2xl bg-card border border-border/60 p-8 shadow-card-soft">
              <h3 className="text-xl font-semibold tracking-tight">Enjoy a free trial of our services</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create an account and try all four detection tools. No credit card required.</p>
              <Link to="/signup"><Button variant="outline" className="mt-6 rounded-full">Start free trial</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-border/60">
        <div className="container mx-auto px-6 py-14 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Logo size={32} />
              <span className="text-base font-semibold tracking-tight">CyberShield</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">A modern, AI-first cybersecurity workspace — designed for humans.</p>
          </div>

          {[
            { h: "Product", links: ["Solutions","Services","Insights","Pricing"] },
            { h: "Company", links: ["About","Customers","Blog","Contact"] },
            { h: "Legal",   links: ["Privacy","Terms","Security","Status"] },
          ].map((col) => (
            <div key={col.h}>
              <div className="text-sm font-medium mb-4">{col.h}</div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links.map((l) => <li key={l}><a href="#" className="hover:text-foreground transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between text-xs text-muted-foreground">
            <span>© 2026 CyberShield AI — Final Year Project.</span>
            <span>Designed with care.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
