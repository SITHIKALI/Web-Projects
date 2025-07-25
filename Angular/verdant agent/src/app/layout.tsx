
"use client"

import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { I18nProvider } from '@/components/I18nProvider';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';

// export const metadata: Metadata = {
//   title: 'Verdant Path',
//   description: 'A smart web-based AI system that helps industries adopt and track ESG goals.',
// };

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const handleLanguageChange = (lng: string | undefined) => {
      if (lng) {
        document.documentElement.lang = lng;
        document.documentElement.dir = i18n.dir(lng);
      }
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial direction
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)} className={`${inter.variable}`} suppressHydrationWarning>
      <head>
          <title>Verdant Path</title>
          <meta name="description" content="A smart web-based AI system that helps industries adopt and track ESG goals." />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
                <div className="flex-1">
                    {children}
                </div>
                <ChatbotWidget />
                <Toaster />
            </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
