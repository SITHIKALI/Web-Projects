
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Bot, Trophy, Phone, Leaf, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useTheme } from "next-themes";
import { LanguageSwitcher } from './LanguageSwitcher';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: '/', label: t('header.home'), icon: Home },
    { href: '/challenges', label: t('header.challenges'), icon: Trophy },
    { href: '/ai-insights', label: 'AI Insights', icon: Bot },
    { href: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur-sm flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle>
             <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                <Leaf className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  Verdant Path
                </span>
              </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-lg h-12",
                pathname === item.href ? "bg-accent text-accent-foreground" : ""
              )}
              asChild
            >
              <Link href={item.href} onClick={onClose}>
                <item.icon className="mr-4 h-6 w-6" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <SheetFooter className="mt-auto border-t pt-4">
            <div className="flex items-center justify-center w-full gap-2">
                <Button
                    variant="outline"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex-1"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="ml-2">{theme === 'dark' ? t('theme.light') : t('theme.dark')}</span>
                </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
