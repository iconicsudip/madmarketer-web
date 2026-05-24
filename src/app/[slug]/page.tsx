import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import styles from './page.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      relatedTo: true,
    }
  });

  if (!page) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <article className={styles.article}>
          <h1 className={styles.title}>{page.title}</h1>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>

        {page.relatedTo.length > 0 && (
          <section className={styles.related}>
            <h3>Related Content</h3>
            <ul className={styles.relatedList}>
              {page.relatedTo.map((related) => (
                <li key={related.id}>
                  <Link href={`/${related.slug}`} className={styles.relatedLink}>
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
