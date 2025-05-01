import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/articles/[slug] - Get article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Ensure params is awaited before using it
    const slug = params?.slug;
    
    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[slug] - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Ensure params is properly accessed
    const slug = params?.slug;
    
    const json = await request.json();
    
    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: slug },
    });
    
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Update article
    const article = await prisma.article.update({
      where: { slug: slug },
      data: {
        title: json.title,
        content: json.content,
        summary: json.summary,
        category: json.category,
        isPremium: json.isPremium !== undefined ? json.isPremium : existingArticle.isPremium,
        thumbnailUrl: json.thumbnailUrl || null,
        // Only update slug if it's provided and different
        ...(json.slug && json.slug !== slug ? { slug: json.slug } : {}),
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[slug] - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Ensure params is properly accessed
    const slug = params?.slug;
    
    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: slug },
    });
    
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Delete article
    await prisma.article.delete({
      where: { slug },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
