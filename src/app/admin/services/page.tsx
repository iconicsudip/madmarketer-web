import { getServices } from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import ServicesEditor from './ServicesEditor';

export default async function ServicesAdmin() {
  const services = await getServices();
  const pages = await prisma.page.findMany({ orderBy: { title: 'asc' } });

  return <ServicesEditor initialServices={services} pages={pages} />;
}
