import { Search, Calendar, User, Tag, Clock, Quote } from 'lucide-react';
import FinalCTA from '@/components/home/FinalCTA';
import styles from './BlogDetails.module.css';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || `Read ${post.title} on our blog.`,
    keywords: post.keywords ? post.keywords.split(',').map(k => k.trim()) : (post.tags ? post.tags.split(',').map(k => k.trim()) : undefined),
    openGraph: post.ogImage ? { images: [post.ogImage] } : (post.image ? { images: [post.image] } : undefined),
  };
}

export default async function BlogDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) notFound();

  // Fetch recent posts for the sidebar
  const recentPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    where: { id: { not: post.id } }
  });

  // Fetch all unique categories used across all published blogs
  const categoriesRaw = await prisma.blogPost.groupBy({
    by: ['category'],
    _count: { category: true }
  });
  const categories = categoriesRaw.map(c => ({ name: c.category, count: c._count.category }));

  return (
    <main className={styles.main}>
      {post.schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: post.schemaMarkup }} />
      )}

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.breadcrumbs}>
              <a href="/">Home</a>
              <span className={styles.separator}>›</span>
              <a href="/blog">Blog</a>
              <span className={styles.separator}>›</span>
              <span className={styles.activeBreadcrumb}>{post.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Grid Layout */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.gridContainer}`}>

          {/* LEFT COLUMN: Main Content */}
          <div className={styles.mainColumn}>

            <div className={styles.metaBar}>
              <div className={styles.metaItem}>
                <User size={16} /> by Admin
              </div>
              <div className={styles.metaItem}>
                <Calendar size={16} /> {post.date || post.createdAt.toLocaleDateString()}
              </div>
              <div className={styles.metaItem}>
                <Tag size={16} /> {post.category}
              </div>
            </div>

            {post.image && (
              <div className={styles.featuredImage} style={{ backgroundImage: `url(${post.image})` }}></div>
            )}

            <div className={styles.articleBody}>
              {post.content ? (
                <MarkdownRenderer content={post.content} />
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic' }}>No content provided.</div>
              )}

              {/* Dynamic Tags */}
              {post.tags && (
                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #222', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666', marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <Tag size={14} style={{ marginRight: '4px' }} /> Tags:
                  </span>
                  {post.tags.split(',').filter(t => t.trim() !== '').map(tag => (
                    <span key={tag} style={{ background: '#111', border: '1px solid #333', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc' }}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Form */}
            <div className={styles.commentSection}>
              <h3>Leave a Reply</h3>
              <p>Your email address will not be published. Required fields are marked *</p>

              <form className={styles.commentForm}>
                <div className={styles.formRow}>
                  <input type="text" placeholder="Name*" required />
                  <input type="email" placeholder="Email*" required />
                </div>
                <textarea placeholder="Comment" rows={6} required></textarea>
                <button type="submit" className={styles.submitBtn}>Post Comment</button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className={styles.sidebarColumn}>

            {/* Search Widget */}
            <div className={styles.widget}>
              <h4>Search</h4>
              <form className={styles.searchForm} action="/blog" method="GET">
                <input type="text" name="q" placeholder="Search..." required />
                <button type="submit">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Recent Posts Widget */}
            <div className={styles.widget}>
              <h4>Recent Posts</h4>
              <div className={styles.recentPostsList}>
                {recentPosts.length > 0 ? recentPosts.map((item) => (
                  <div key={item.id} className={styles.recentPostItem}>
                    <div className={styles.recentPostImg} style={{ backgroundImage: `url(${item.image})` }}></div>
                    <div className={styles.recentPostInfo}>
                      <span className={styles.recentDate}><Clock size={12} /> {item.date || item.createdAt.toLocaleDateString()}</span>
                      <a href={`/blog/${item.slug}`}>{item.title}</a>
                    </div>
                  </div>
                )) : (
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>No other posts found.</div>
                )}
              </div>
            </div>

            {/* Categories Widget */}
            <div className={styles.widget}>
              <h4>Categories</h4>
              <div className={styles.categoryList}>
                {categories.length > 0 ? categories.map(cat => (
                  <a key={cat.name} href={`/blog?category=${encodeURIComponent(cat.name)}`}>
                    {cat.name} <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>({cat.count})</span>
                  </a>
                )) : (
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>No categories.</div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
