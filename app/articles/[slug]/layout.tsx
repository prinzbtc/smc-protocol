import { Metadata, ResolvingMetadata } from 'next';
import prisma from '@/lib/prisma';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ensure params is awaited
  const slug = params?.slug;
  
  // Fetch article data from database
  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      title: true,
      summary: true,
      thumbnailUrl: true,
      category: true,
    },
  });

  // If no article is found, return default metadata
  if (!article) {
    return {
      title: 'Article Not Found | Smart Money Capital',
      description: 'The requested article could not be found.',
    };
  }

  // Get base URL for absolute URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smartmoneycapital.xyz';
  
  // Construct full thumbnail URL if it exists
  const thumbnailUrl = article.thumbnailUrl 
    ? (article.thumbnailUrl.startsWith('http') 
        ? article.thumbnailUrl 
        : `${baseUrl}${article.thumbnailUrl}`)
    : `${baseUrl}/images/default-article-image.jpg`;

  // Return metadata with OpenGraph and Twitter card information
  return {
    title: `${article.title} | Smart Money Capital`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      locale: 'en_US',
      siteName: 'Smart Money Capital',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [thumbnailUrl],
      creator: '@SmartMoneyCap',
    },
    keywords: [article.category, 'Smart Money Capital', 'SMC', 'Crypto', 'Finance', 'Solana'],
  };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
