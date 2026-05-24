import { Search, Calendar, User, Tag, Clock, Quote } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import FinalCTA from '@/components/home/FinalCTA';
import styles from './BlogDetails.module.css';

// Using a Next 15 Server Component with async params
export default async function BlogDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  // Placeholder data formatting
  const formattedTitle = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{formattedTitle}</h1>
            <div className={styles.breadcrumbs}>
              <span>Home</span>
              <span className={styles.separator}>›</span>
              <span>Blog Standard</span>
              <span className={styles.separator}>›</span>
              <span className={styles.activeBreadcrumb}>{formattedTitle}</span>
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
                <User size={16} /> by madmarketer
              </div>
              <div className={styles.metaItem}>
                <Calendar size={16} /> May 25, 2026
              </div>
              <div className={styles.metaItem}>
                <Tag size={16} /> AI Automation
              </div>
            </div>

            <div className={styles.featuredImage}></div>

            <div className={styles.articleBody}>
              <p>
                Artificial intelligence is no longer just a buzzword—it's a game-changing force transforming how businesses operate. From streamlining workflows to enhancing customer experiences, AI tools are driving innovation across industries. Companies now rely on AI-powered copywriting for content creation, chatbots for 24/7 customer support, and voice generators for accessibility.
              </p>
              
              <p>
                These solutions save time, reduce costs, and boost productivity, allowing teams to focus on strategy and growth. Whether it's startups using AI to scale faster or enterprises automating complex tasks, the impact is undeniable. As adoption grows...
              </p>

              <blockquote className={styles.blockquote}>
                <div className={styles.quoteIcon}>
                  <Quote size={24} />
                </div>
                <h3>Great things happen when passion meets purpose.</h3>
                <cite>"Mad Marketer Team"</cite>
              </blockquote>

              <h2>Key benefits of AI-Powered Infrastructure</h2>
              <p>
                For creative industries, AI image and video generators enable faster production without compromising quality, while AI tools unlock entirely new forms of innovation. In business operations, AI-driven platforms optimize project management, improve decision-making with data insights, and systematically scale outbound marketing.
              </p>
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
              <form className={styles.searchForm}>
                <input type="text" placeholder="Search..." />
                <button type="submit">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Recent Posts Widget */}
            <div className={styles.widget}>
              <h4>Recent Posts</h4>
              <div className={styles.recentPostsList}>
                {[1, 2, 3].map((item) => (
                  <div key={item} className={styles.recentPostItem}>
                    <div className={styles.recentPostImg}></div>
                    <div className={styles.recentPostInfo}>
                      <span className={styles.recentDate}><Clock size={12} /> May 24, 2026</span>
                      <a href="#">Streamlining Success: How Automation Enhances Teams</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className={styles.widget}>
              <h4>Categories</h4>
              <div className={styles.categoryList}>
                <a href="#">AI Tools</a>
                <a href="#">SaaS Development</a>
                <a href="#">Digital Marketing</a>
                <a href="#">RCS Messaging</a>
                <a href="#">Custom CRM</a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
