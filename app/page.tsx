import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Engineering from "@/components/sections/Engineering";
import Experience from "@/components/sections/Experience";
import Toolkit from "@/components/sections/Toolkit";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import ChatbotLoader from "@/components/ChatbotLoader";

/*
  60 / 30 / 10: cream page (Hero, AI, Experience, Toolkit), ink bands (Work, Contact + footer),
  orange only on markers and primary buttons. `.band` flips the palette, so in dark mode
  the same bands turn cream on an ink page.
*/
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="h-20 md:h-28" aria-hidden />
        <Work />
        <Engineering />
        <Experience />
        <Toolkit />
      </main>
      <div className="band mx-2 mb-2 rounded-[28px] sm:mx-3 sm:mb-3 md:mx-4 md:mb-4 md:rounded-[44px]">
        <Contact />
        <Footer />
      </div>
      <ChatbotLoader />
    </>
  );
}
