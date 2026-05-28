import BlogSection from '@/components/home/BlogSection';
import FinalCTA from '@/components/home/FinalCTA';
import PageRenderer from '@/components/PageRenderer';
import { getBlogPosts } from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: 'blog' } });
  if (!page) return { title: 'Blog' };
  return { title: page.title, description: page.metaDescription };
}

export default async function BlogPage(props: { searchParams: Promise<{ category?: string, q?: string }> }) {
  const searchParams = await props.searchParams;
  const category = searchParams.category;
  const q = searchParams.q?.toLowerCase();

  let allPosts = await getBlogPosts();

  // Extract unique categories from all active posts
  const categoriesRaw = await prisma.blogPost.groupBy({
    by: ['category']
  });
  const categories = categoriesRaw.map(c => c.category).sort();

  let posts = allPosts;
  if (category) {
    posts = allPosts.filter(p => p.category === category);
  }

  if (q) {
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.content && p.content.toLowerCase().includes(q)) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
      (p.tags && p.tags.toLowerCase().includes(q))
    );
  }

  const page = await prisma.page.findUnique({
    where: { slug: 'blog' },
    include: { sections: true },
  });
  const hasCmsSections = (page?.sections.length ?? 0) > 0;
  const hasWidget = page?.sections.some(s => s.type === 'widget' && s.content.includes('blog_grid'));

  const BlogGridWidget = (
    <div style={{ paddingBottom: '100px', backgroundColor: 'var(--dark-bg)' }}>
      {/* Category Filters */}
      <div className="container" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        <a href="/blog" style={{
          padding: '8px 20px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
          background: !category ? '#ED1C24' : 'rgba(255,255,255,0.05)',
          color: !category ? '#fff' : '#aaa',
          border: `1px solid ${!category ? '#ED1C24' : 'rgba(255,255,255,0.1)'}`
        }}>
          All Posts
        </a>
        {categories.map(cat => (
          <a key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} style={{
            padding: '8px 20px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
            background: category === cat ? '#ED1C24' : 'rgba(255,255,255,0.05)',
            color: category === cat ? '#fff' : '#aaa',
            border: `1px solid ${category === cat ? '#ED1C24' : 'rgba(255,255,255,0.1)'}`,
            whiteSpace: 'nowrap'
          }}>
            {cat}
          </a>
        ))}
      </div>

      <BlogSection posts={posts} showAll={true} />
      {posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '8rem 2rem', color: '#555' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <p style={{ fontSize: '1.1rem' }}>
            {q ? `No posts found matching "${searchParams.q}".` : (category ? `No posts found in the "${category}" category.` : 'No blog posts yet.')}
          </p>
          <a href="/blog" style={{ color: '#ED1C24', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginTop: '1rem' }}>
            ← Back to all posts
          </a>
        </div>
      )}
    </div>
  );

  return (
    <main>
      {/* Dynamic CMS Sections first */}


      {/* Fallback Header (shows if no CMS content is added) */}
      {!hasCmsSections && (
        <div style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center', backgroundColor: 'var(--dark-bg)' }}>
          <div className="container">
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem', color: '#ED1C24' }}>
              {q ? 'Search Results' : (category ? 'Category Filter' : 'Our Insights')}
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              {q ? `Results for "${searchParams.q}"` : (category ? `${category} Articles` : 'The Mad Marketer Blog')}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.55)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Strategies, tutorials, and insights on scaling your business with AI, automation, and modern web infrastructure.
            </p>
          </div>
        </div>
      )}

      {/* Blog Grid & Filters */}
      {!hasWidget && BlogGridWidget}

      <PageRenderer slug="blog" widgets={{ blog_grid: BlogGridWidget }} />
    </main>
  );
}
