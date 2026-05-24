import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import ServicesEcosystem from '@/components/home/ServicesEcosystem';
import AboutSection from '@/components/home/AboutSection';
import ProductsSection from '@/components/home/ProductsSection';
import InfrastructureMarquee from '@/components/home/InfrastructureMarquee';
import ProcessRoadmap from '@/components/home/ProcessRoadmap';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ReviewsSection from '@/components/home/ReviewsSection';
import BlogSection from '@/components/home/BlogSection';
import PortfolioSection from '@/components/home/PortfolioSection';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesEcosystem />
      <AboutSection />
      <ProductsSection />
      <InfrastructureMarquee />
      <PortfolioSection />
      <ProcessRoadmap />
      <WhyChooseUs />
      <ReviewsSection />
      <BlogSection />
    </main>
  );
}
