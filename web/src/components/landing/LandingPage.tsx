import { GlobalImmersiveBackground } from "../effects/GlobalImmersiveBackground";
import { ScrollProgress } from "../effects/ScrollProgress";
import { BentoFeatures } from "./BentoFeatures";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { LogoStrip } from "./LogoStrip";
import { Navbar } from "./Navbar";
import { Solutions } from "./Solutions";
import { Testimonials } from "./Testimonials";

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <GlobalImmersiveBackground />
      <ScrollProgress />
      <a
        href="#servicios"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <LogoStrip />
          <BentoFeatures />
          <Solutions />
          <Testimonials />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </div>
  );
}
