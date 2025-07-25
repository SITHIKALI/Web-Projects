
import { Header } from '@/components/Header';
import { HomePageClient } from '@/components/HomePageClient';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HomePageClient />
      </main>
      <footer className="py-6 px-4 md:px-6 border-t bg-card/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Verdant Path. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
