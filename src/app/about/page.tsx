import Navbar from '@/components/home/Navbar';
import AboutSection from '@/components/home/AboutSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FinalCTA from '@/components/home/FinalCTA';

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <AboutSection />
        <WhyChooseUs />
      </div>
      <FinalCTA />
    </main>
  );
}
