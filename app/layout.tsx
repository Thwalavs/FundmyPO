import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import IdleLogout from './IdleLogout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Purchase Order Funding South Africa | FundMyPO',
    template: '%s | FundMyPO',
  },
  description: "Get funding for approved purchase orders, tenders, and contracts. Compare offers from multiple funders through FundMyPO — South Africa's leading PO funding marketplace.",
  keywords: [
    'purchase order funding South Africa',
    'PO funding South Africa',
    'invoice financing South Africa',
    'contract financing South Africa',
    'tender funding South Africa',
    'working capital for contractors',
    'government tender funding',
    'supply chain finance South Africa',
    'SME funding South Africa',
    'purchase order finance',
    'trade finance South Africa',
    'working capital solutions',
  ],
  authors: [{ name: 'FundMyPO' }],
  creator: 'FundMyPO',
  publisher: 'FundMyPO',
  metadataBase: new URL('https://www.fundmypo.co.za'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://www.fundmypo.co.za',
    siteName: 'FundMyPO',
    title: 'Purchase Order Funding South Africa | FundMyPO',
    description: 'Get funding for approved purchase orders, tenders, and contracts. Compare offers from multiple funders through FundMyPO.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'FundMyPO - Purchase Order Funding South Africa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Purchase Order Funding South Africa | FundMyPO',
    description: 'Get funding for approved purchase orders, tenders, and contracts. Compare offers from multiple funders through FundMyPO.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'dNAj5dlW5Ns6pR2zyZ5_MDDH13GJN5tIFvQ4wwDXUXU',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-ZA"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <IdleLogout />
        {children}
      </body>
    </html>
  )
}
