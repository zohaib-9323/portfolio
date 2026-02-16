import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import PerformanceHighlights from "@/components/sections/PerformanceHighlights";
import TechPhilosophy from "@/components/sections/TechPhilosophy";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <PerformanceHighlights />
      <TechPhilosophy />
      <Contact />
      <Footer />
      <Chatbot />
    </main>
  );
}
