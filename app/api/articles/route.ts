import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sampleArticles } from './sample-data';

// GET /api/articles - Get all articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isPremium = searchParams.get('isPremium');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
    
    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (isPremium !== null) filter.isPremium = isPremium === 'true';
    
    try {
      const articles = await prisma.article.findMany({
        where: filter,
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          category: true,
          isPremium: true,
          thumbnailUrl: true,
          publishedAt: true,
          updatedAt: true,
          // Don't include full content in list view
        },
      });
      
      // If no articles are found in the database, return the sample articles
      if (articles.length === 0) {
        console.log('No articles found in database, returning sample articles');
        return NextResponse.json(sampleArticles);
      }
      
      return NextResponse.json(articles);
    } catch (dbError) {
      console.error('Database error, falling back to sample data:', dbError);
      // If there's a database error, fall back to sample data
      return NextResponse.json(sampleArticles);
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'summary', 'category'];
    for (const field of requiredFields) {
      if (!json[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Generate slug from title if not provided
    if (!json.slug) {
      json.slug = json.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: json.slug },
    });
    
    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }
    
    const article = await prisma.article.create({
      data: {
        title: json.title,
        slug: json.slug,
        content: json.content,
        summary: json.summary,
        category: json.category,
        isPremium: json.isPremium !== undefined ? json.isPremium : true,
        thumbnailUrl: json.thumbnailUrl || null,
        publishedAt: json.publishedAt ? new Date(json.publishedAt) : new Date(),
      },
    });
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
