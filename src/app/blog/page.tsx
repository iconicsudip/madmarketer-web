import Navbar from '@/components/home/Navbar';
import BlogSection from '@/components/home/BlogSection';
import FinalCTA from '@/components/home/FinalCTA';

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--dark-bg)' }}>
        <BlogSection />
      </div>
      <FinalCTA />
    </main>
  );
}
