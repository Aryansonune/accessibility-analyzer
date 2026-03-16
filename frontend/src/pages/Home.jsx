import Hero from "../components/Hero";
import AnalyzerCard from "../components/AnalyzerCard";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 -mt-6">
          <AnalyzerCard />
        </section>
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <Features />
        </section>
      </main>
      <Footer />
    </>
  );
}