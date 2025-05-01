import { NextRequest, NextResponse } from 'next/server';
import { openai, generateArticlePrompt } from '@/lib/openai';
import { isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(wallet)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get prompt from request body
    const json = await request.json();
    const { prompt } = json;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Generate article using OpenAI
    const finalPrompt = generateArticlePrompt(prompt);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: finalPrompt },
      ],
      temperature: 0.7,
    });
    
    const generatedContent = response.choices[0]?.message?.content || '';
    
    // Extract title from the generated content (assuming it starts with # or Title:)
    let title = '';
    const contentLines = generatedContent.split('\n');
    
    if (contentLines.length > 0) {
      const firstLine = contentLines[0].trim();
      if (firstLine.startsWith('# ')) {
        title = firstLine.substring(2);
      } else if (firstLine.startsWith('Title:')) {
        title = firstLine.substring(6).trim();
      } else if (firstLine) {
        title = firstLine;
      }
    }
    
    // Generate a slug from the title
    const slug = title
      ? title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      : '';
    
    return NextResponse.json({
      content: generatedContent,
      title,
      slug,
    });
  } catch (error: any) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate article' },
      { status: 500 }
    );
  }
}
