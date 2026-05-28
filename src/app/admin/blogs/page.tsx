import { getBlogPosts } from '@/app/actions/cms';
import BlogEditor from './BlogEditor';

export default async function BlogsAdmin() {
  const blogs = await getBlogPosts();
  return <BlogEditor initialBlogs={blogs} />;
}
