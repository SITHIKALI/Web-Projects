
"use client";

import { Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Landmark, Lightbulb, Globe, Briefcase } from 'lucide-react';
import { generateCaseStudies, CaseStudy } from '@/ai/flows/generate-case-studies';
import { useToast } from '@/hooks/use-toast';

const knowledgeBaseItems = [
    {
        id: 'frameworks',
        title: 'Key ESG Frameworks',
        icon: <Landmark className="w-6 h-6 text-primary" />,
        content: [
            {
                subtitle: 'GRI (Global Reporting Initiative)',
                text: 'The GRI Standards are the most widely used standards for sustainability reporting. They help organizations understand and report their impacts on the economy, environment, and people in a credible and comparable way. Reports are structured around material topics—issues that are most significant to an organization\'s impacts and stakeholder decisions.'
            },
            {
                subtitle: 'SASB (Sustainability Accounting Standards Board)',
                text: 'SASB Standards focus on financially material sustainability information. They identify the ESG issues most relevant to financial performance in 77 specific industries, providing a framework for companies to disclose this information to investors. The goal is to provide decision-useful data for shareholders. [Reference: SASB Standards]'
            },
            {
                subtitle: 'TCFD (Task Force on Climate-related Financial Disclosures)',
                text: 'The TCFD developed recommendations for more effective climate-related disclosures that could promote more informed investment, credit, and insurance underwriting decisions. The framework is structured around four thematic areas: governance, strategy, risk management, and metrics and targets.'
            }
        ]
    },
    {
        id: 'concepts',
        title: 'Core ESG Concepts',
        icon: <Lightbulb className="w-6 h-6 text-primary" />,
        content: [
            {
                subtitle: 'Net Zero',
                text: 'Net Zero means cutting greenhouse gas emissions to as close to zero as possible, with any remaining emissions re-absorbed from the atmosphere, by oceans and forests for instance. This state of balance is essential to mitigate the worst impacts of climate change. [Reference: Paris Agreement]'
            },
            {
                subtitle: 'Scope 1, 2, and 3 Emissions',
                text: 'A way to categorize the different kinds of carbon emissions a company creates in its own operations and in its wider value chain.\n\n- Scope 1: Direct emissions from owned or controlled sources.\n- Scope 2: Indirect emissions from the generation of purchased electricity, steam, heating and cooling.\n- Scope 3: All other indirect emissions that occur in a company’s value chain (e.g., purchased goods, business travel, employee commuting).'
            },
            {
                subtitle: 'Circular Economy',
                text: 'An economic model that is restorative and regenerative by design. It aims to redefine growth, focusing on positive society-wide benefits. It entails gradually decoupling economic activity from the consumption of finite resources, and designing waste out of the system.'
            }
        ]
    },
     {
        id: 'best-practices',
        title: 'Best Practices by Pillar',
        icon: <Globe className="w-6 h-6 text-primary" />,
        content: [
            {
                subtitle: 'Environmental Best Practices',
                text: '• Implement an Environmental Management System (EMS) based on ISO 14001.\n• Conduct regular energy audits to identify efficiency opportunities.\n• Set science-based targets for emission reduction.\n• Invest in renewable energy sources like solar or wind.\n• Develop a comprehensive waste reduction and recycling program.'
            },
            {
                subtitle: 'Social Best Practices',
                text: '• Foster a diverse and inclusive workforce with clear DE&I policies.\n• Ensure fair labor practices and a living wage throughout your supply chain.\n• Invest in employee training, development, and well-being programs.\n• Engage with local communities through volunteering and investment initiatives.\n• Uphold stringent health and safety standards (e.g., ISO 45001).'
            },
            {
                subtitle: 'Governance Best Practices',
                text: '• Ensure board independence with a majority of non-executive directors.\n• Establish a dedicated board committee for ESG oversight.\n• Promote transparency through clear and ethical codes of conduct.\n• Implement a robust whistleblower policy to encourage reporting of misconduct.\n• Link executive compensation to the achievement of specific ESG targets.'
            }
        ]
    },
];

function KnowledgeBaseContent() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loadingCaseStudies, setLoadingCaseStudies] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoadingCaseStudies(true);
    generateCaseStudies()
      .then(res => {
        setCaseStudies(res.caseStudies);
      })
      .catch(err => {
        console.error(err);
        toast({
            variant: 'destructive',
            title: 'Error Loading Case Studies',
            description: 'Could not fetch the latest case studies. Please try again later.'
        });
      })
      .finally(() => {
        setLoadingCaseStudies(false);
      });
  }, [toast]);


  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">ESG Knowledge Base</h2>
            <p className="text-lg text-muted-foreground mt-2">Your central hub for ESG frameworks, concepts, and best practices.</p>
        </div>

        <div className="max-w-4xl mx-auto">
             <Accordion type="single" collapsible className="w-full">
                {knowledgeBaseItems.map(item => (
                    <AccordionItem value={item.id} key={item.id} className="border-border/50 bg-card/30 mb-4 rounded-lg px-4">
                        <AccordionTrigger className="text-xl font-bold hover:no-underline">
                           <div className="flex items-center gap-4">
                                {item.icon}
                                <span>{item.title}</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4 pl-14 pr-4">
                           <div className="space-y-6">
                             {item.content.map((section, index) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-lg mb-2">{section.subtitle}</h4>
                                    <p className="text-muted-foreground whitespace-pre-line">{section.text}</p>
                                </div>
                             ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                 <AccordionItem value="case-studies" className="border-border/50 bg-card/30 mb-4 rounded-lg px-4">
                    <AccordionTrigger className="text-xl font-bold hover:no-underline">
                        <div className="flex items-center gap-4">
                            <Briefcase className="w-6 h-6 text-primary" />
                            <span>Real-World Case Studies (Live)</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 pl-14 pr-4">
                        <div className="space-y-6">
                            {loadingCaseStudies ? (
                                <>
                                    <Skeleton className="h-5 w-1/3 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-5 w-1/4 mt-4 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </>
                            ) : caseStudies.map((study, index) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-lg mb-2">{study.companyName}</h4>
                                    <p className="text-muted-foreground whitespace-pre-line">{study.summary}</p>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}


export default function KnowledgeBasePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Suspense>
                <Header />
            </Suspense>
            <main className="flex-1">
                <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
                    <KnowledgeBaseContent />
                </Suspense>
            </main>
        </div>
    );
}
