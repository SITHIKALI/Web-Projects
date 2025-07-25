
"use client";

import { Leaf, Moon, Sun, Menu, Trophy, Bot, BookOpen, Phone, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Sidebar } from './Sidebar';

export function Header() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('header.home') },
    { href: '/challenges', label: t('header.challenges') },
    { href: '/ai-insights', label: 'AI Insights' },
    { href: '/knowledge-base', label: 'Knowledge Base' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open Menu</span>
              </Button>
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-primary" />
              <h1 className="hidden sm:block text-2xl font-bold text-foreground">
                Verdant Path
              </h1>
            </Link>
             <nav className="hidden md:flex items-center gap-6 text-base font-medium">
                {navItems.map((item) => (
                   <Link 
                      key={item.href}
                      href={item.href} 
                      className={`flex items-center gap-2 hover:text-primary transition-colors ${pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  >
                      {item.href === '/' && <Home className="w-5 h-5" />}
                      {item.href === '/ai-insights' && <Bot className="w-5 h-5" />}
                      {item.href === '/challenges' && <Trophy className="w-5 h-5" />}
                      {item.href === '/knowledge-base' && <BookOpen className="w-5 h-5" />}
                       {item.href === '/contact' && <Phone className="w-5 h-5" />}
                      {item.label}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <LanguageSwitcher />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                      <Sun className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>{t('theme.light')}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>{t('theme.dark')}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>{t('theme.system')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
               <div className="flex items-center md:hidden">
                 <LanguageSwitcher />
              </div>
          </div>
        </div>
      </header>
    </>
  );
}
