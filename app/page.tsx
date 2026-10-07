import { Benefits } from "@/components/benefits/Benefits";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { Flavors } from "@/components/flavors/Flavors";
import { Hero } from "@/components/hero/Hero";
import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Occasions } from "@/components/occasions/Occasions";
import { ProductExperience } from "@/components/product/ProductExperience";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <ProductExperience />
        <Benefits />
        <Flavors />
        <HowItWorks />
        <Occasions />
        <WhatsAppCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
