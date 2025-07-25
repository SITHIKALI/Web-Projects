
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MoveRight, Leaf, Target, BarChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function HomePageClient() {
  const [industry, setIndustry] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleStart = () => {
    if (industry) {
      router.push(`/goals?industry=${encodeURIComponent(industry)}`);
    }
  };
  
  const handleIndustrySelect = (value: string) => {
    if (value === 'browse') {
      setIsDialogOpen(true);
    } else {
      setIndustry(value);
    }
  };

  const handleIndustryFromDialog = (selectedIndustry: string) => {
    setIndustry(selectedIndustry);
    setIsDialogOpen(false);
  };

  const initialIndustries = [
    'Manufacturing',
    'Retail',
    'IT',
    'Finance',
    'Healthcare',
    'Energy',
    'Transportation',
    'Agriculture',
  ];

  const allIndustries = {
    'Business & Finance': ['Accounting', 'Banking', 'Consulting', 'Insurance', 'Real Estate'],
    'Creative & Media': ['Advertising', 'Entertainment', 'Journalism', 'Publishing', 'Marketing'],
    'Education': ['Higher Education', 'K-12 Education', 'EdTech'],
    'Engineering & Manufacturing': ['Aerospace', 'Automotive', 'Chemicals', 'Electronics', 'Industrial Manufacturing'],
    'Healthcare & Science': ['Biotechnology', 'Pharmaceuticals', 'Hospitals & Clinics', 'Medical Devices', 'Research'],
    'Public & Social Services': ['Government', 'Non-profit', 'Social Work', 'Law Enforcement'],
    'Retail & Consumer Goods': ['E-commerce', 'Fashion & Apparel', 'Food & Beverage', 'Luxury Goods'],
    'Technology': ['Software Development', 'Hardware', 'Telecommunications', 'Cybersecurity', 'Cloud Computing'],
    'Trades & Services': ['Construction', 'Hospitality', 'Logistics & Supply Chain', 'Restaurants & Food Service'],
  };

  const displayedIndustries = useMemo(() => {
    const industrySet = new Set(initialIndustries);
    if (industry && !industrySet.has(industry)) {
      return [industry, ...initialIndustries];
    }
    return initialIndustries;
  }, [industry]);


  return (
    <>
      <section className="relative w-full h-auto min-h-[60vh] md:min-h-[80vh] flex items-center justify-center text-center bg-primary/5 overflow-hidden py-12">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)] dark:bg-grid-slate-700/50"></div>
        <div className="relative z-10 space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground/80 drop-shadow-lg">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground drop-shadow-md">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mt-8">
              <Select onValueChange={handleIndustrySelect} value={industry}>
                  <SelectTrigger id="industry-select" aria-label="Select industry" className="w-full sm:w-64 bg-background/80 text-foreground border-border h-12 text-base">
                    <SelectValue placeholder={t('home.selectIndustry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {displayedIndustries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                     <Separator className="my-2" />
                     <SelectItem value="browse">Browse other types...</SelectItem>
                  </SelectContent>
              </Select>
              <Button onClick={handleStart} disabled={!industry || industry === 'browse'} size="lg" className="w-full sm:w-auto h-12 shadow-lg hover:shadow-primary/40">
                {t('home.ctaButton')} <MoveRight className="ml-2"/>
              </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">{t('home.sectionTitle')}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.sectionSubtitle')}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                  <Card className="p-8 border rounded-lg bg-card/50 hover:bg-card/80 hover:shadow-lg hover:border-primary/50 transition-all transform hover:-translate-y-1">
                      <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                         <Leaf className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{t('home.feature1.title')}</h3>
                      <p className="text-muted-foreground">{t('home.feature1.description')}</p>
                  </Card>
                  <Card className="p-8 border rounded-lg bg-card/50 hover:bg-card/80 hover:shadow-lg hover:border-primary/50 transition-all transform hover:-translate-y-1">
                      <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                         <Target className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{t('home.feature2.title')}</h3>
                      <p className="text-muted-foreground">{t('home.feature2.description')}</p>
                  </Card>
                  <Card className="p-8 border rounded-lg bg-card/50 hover:bg-card/80 hover:shadow-lg hover:border-primary/50 transition-all transform hover:-translate-y-1">
                      <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                          <BarChart className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{t('home.feature3.title')}</h3>
                      <p className="text-muted-foreground">{t('home.feature3.description')}</p>

                  </Card>
              </div>
          </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
           <Card className="p-8 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 shadow-lg border border-border/50">
                <blockquote className="text-center text-xl md:text-2xl font-medium text-foreground">
                "We believe that sustainability is a journey, not a destination. We're committed to continuous improvement and to making a positive impact on the environment and society."
                <footer className="mt-4 text-base font-normal text-muted-foreground">— Mr. Jean-Pascal Tricoire, Chairman of Schneider Electric</footer>
                </blockquote>
            </Card>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Browse Industries</DialogTitle>
            <DialogDescription>
              Select your industry from the list below to get tailored ESG goal recommendations.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[450px] pr-6">
            <div className="space-y-6">
              {Object.entries(allIndustries).map(([category, industries]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3">{category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {industries.map((industry) => (
                      <Button
                        key={industry}
                        variant="outline"
                        className="w-full justify-start whitespace-normal h-auto py-2"
                        onClick={() => handleIndustryFromDialog(industry)}
                      >
                        {industry}
                      </Button>
                    ))}
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
