import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, metaDescription, content } = body;

    const page = await prisma.page.create({
      data: { title, slug, metaDescription, content },
    });

    return NextResponse.json(page);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
