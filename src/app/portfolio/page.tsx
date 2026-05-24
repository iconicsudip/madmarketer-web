import Navbar from '@/components/home/Navbar';
import PortfolioSection from '@/components/home/PortfolioSection';
import FinalCTA from '@/components/home/FinalCTA';

export default function PortfolioPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--dark-bg)' }}>
        <PortfolioSection />
      </div>
      <FinalCTA />
    </main>
  );
}
