import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Projects from "@/components/sections/Projects";
import PerformanceHighlights from "@/components/sections/PerformanceHighlights";
import TechPhilosophy from "@/components/sections/TechPhilosophy";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="site-canvas relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/6 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[100px]" />
      </div>
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Certificates />
      <Projects />
      <PerformanceHighlights />
      <TechPhilosophy />
      <Contact />
      <Footer />
      <Chatbot />
    </main>
  );
}
