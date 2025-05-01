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
  // Fetch report data from database
  const report = await prisma.report.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      summary: true,
      thumbnailUrl: true,
    },
  });

  // If no report is found, return default metadata
  if (!report) {
    return {
      title: 'Report Not Found | Smart Money Capital',
      description: 'The requested report could not be found.',
    };
  }

  // Get base URL for absolute URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smartmoneycapital.xyz';
  
  // Construct full thumbnail URL if it exists
  const thumbnailUrl = report.thumbnailUrl 
    ? (report.thumbnailUrl.startsWith('http') 
        ? report.thumbnailUrl 
        : `${baseUrl}${report.thumbnailUrl}`)
    : `${baseUrl}/images/default-report-image.jpg`;

  // Return metadata with OpenGraph and Twitter card information
  return {
    title: `${report.title} | Smart Money Capital`,
    description: report.summary,
    openGraph: {
      title: report.title,
      description: report.summary,
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: report.title,
        },
      ],
      type: 'article',
      locale: 'en_US',
      siteName: 'Smart Money Capital',
    },
    twitter: {
      card: 'summary_large_image',
      title: report.title,
      description: report.summary,
      images: [thumbnailUrl],
      creator: '@SmartMoneyCap',
    },
    keywords: ['Smart Money Capital', 'SMC', 'Crypto', 'Finance', 'Solana', 'Report'],
  };
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
