import { getProducts } from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import ProductsEditor from './ProductsEditor';

export default async function ProductsAdmin() {
  const products = await getProducts();
  const pages = await prisma.page.findMany({ orderBy: { title: 'asc' } });

  return <ProductsEditor initialProducts={products} pages={pages} />;
}
