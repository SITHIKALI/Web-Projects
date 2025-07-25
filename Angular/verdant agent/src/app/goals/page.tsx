
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { suggestRelevantEsgGoals, SuggestRelevantEsgGoalsOutput } from '@/ai/flows/esg-goal-suggestion';
import { getMaterialTopics, GetMaterialTopicsOutput } from '@/ai/flows/get-material-topics';
import { ArrowRight, Leaf, Recycle, Factory, HeartHandshake, Users, Info, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Stage = 'loading' | 'topics' | 'goals' | 'error';
type MaterialTopic = { topic: string; explanation: string };

function GoalRecommendations() {
    const searchParams = useSearchParams();
    const industry = searchParams.get('industry');
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const [stage, setStage] = useState<Stage>('loading');
    const [materialTopics, setMaterialTopics] = useState<MaterialTopic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [goals, setGoals] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (industry) {
            setStage('loading');
            getMaterialTopics({ industry })
                .then((res: GetMaterialTopicsOutput) => {
                    setMaterialTopics(res.topics);
                    setStage('topics');
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to load material topics. Please try again.');
                    setStage('error');
                });
        }
    }, [industry]);
    
    const handleTopicSelection = (topic: string) => {
        if (industry) {
            setSelectedTopic(topic);
            setStage('loading');
            suggestRelevantEsgGoals({ industry, language: currentLanguage, materialTopic: topic })
                .then((res: SuggestRelevantEsgGoalsOutput) => {
                    setGoals(res.goals);
                    setStage('goals');
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to load ESG goals. Please try again.');
                    setStage('error');
                });
        }
    };

    const handleBackToTopics = () => {
        setStage('topics');
        setGoals([]);
        setSelectedTopic(null);
    };
    
    const goalIcons: { [key: string]: React.ReactNode } = {
        default: <Leaf className="w-8 h-8 text-primary" />,
        waste: <Recycle className="w-8 h-8 text-primary" />,
        emissions: <Factory className="w-8 h-8 text-primary" />,
        social: <HeartHandshake className="w-8 h-8 text-primary" />,
        governance: <Users className="w-8 h-8 text-primary" />,
    };

    const getIconForGoal = (goal: string) => {
        const lowerGoal = goal.toLowerCase();
        if (lowerGoal.includes('waste') || lowerGoal.includes('نفايات') || lowerGoal.includes('فضلہ')) return goalIcons.waste;
        if (lowerGoal.includes('emission') || lowerGoal.includes('energy') || lowerGoal.includes('انبعاث') || lowerGoal.includes('طاقة') || lowerGoal.includes('اخراج') || lowerGoal.includes('توانائی')) return goalIcons.emissions;
        if (lowerGoal.includes('social') || lowerGoal.includes('community') || lowerGoal.includes('labor') || lowerGoal.includes('اجتماعي') || lowerGoal.includes('مجتمع') || lowerGoal.includes('عمالة') || lowerGoal.includes('سماجی') || lowerGoal.includes('کمیونٹی') || lowerGoal.includes('مزدور')) return goalIcons.social;
        if (lowerGoal.includes('governance') || lowerGoal.includes('ethical') || lowerGoal.includes('حوكمة') || lowerGoal.includes('أخلاقي') || lowerGoal.includes('حکمرانی') || lowerGoal.includes('اخلاقی')) return goalIcons.governance;
        return goalIcons.default;
    };


    if (!industry) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6 text-center">
                <p>No industry selected. Please go back and select an industry.</p>
                <Button asChild className="mt-4">
                    <Link href="/">Go Back</Link>
                </Button>
            </div>
        );
    }
    
    const renderContent = () => {
        switch (stage) {
            case 'loading':
                return (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="bg-card/50">
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6 mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                );
            case 'error':
                 return <p className="text-center text-destructive">{error}</p>;
            case 'topics':
                return (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Material Topics for {industry}</h2>
                            <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                                These are the key ESG issues that matter most in your industry. Click on a topic to discover relevant sustainability goals you can set.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {materialTopics.map((item, index) => (
                                <Card key={index} onClick={() => handleTopicSelection(item.topic)} className="bg-card/50 cursor-pointer border-border hover:border-primary hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                                    <CardHeader className="flex-row items-start gap-4">
                                        <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <CardTitle className="text-xl font-bold">{item.topic}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pl-16">
                                        <p className="text-muted-foreground">{item.explanation}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                );
            case 'goals':
                 return (
                    <>
                        <div className="mb-8">
                            <Button variant="ghost" onClick={handleBackToTopics}>
                                <ArrowLeft className="mr-2" /> Back to Material Topics
                            </Button>
                        </div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Recommended ESG Goals</h2>
                             <p className="text-lg text-muted-foreground mt-2">For the <span className="font-bold text-primary">{industry}</span> industry, focusing on <span className="font-bold text-primary">{selectedTopic}</span></p>
                            <p className="mt-2 max-w-2xl mx-auto">Based on your selection, here are relevant goals. Select one to build your customized dashboard.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {goals.map((goal, index) => (
                                <Link key={index} href={`/dashboard?industry=${encodeURIComponent(industry as string)}&goal=${encodeURIComponent(goal)}`} className="group block">
                                     <Card className="h-full flex flex-col justify-between bg-card/50 border-border hover:border-primary hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                                        <CardHeader className="flex-row items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-full">{getIconForGoal(goal)}</div>
                                            <CardTitle className="text-xl font-bold pt-2">{goal}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>Click to see a detailed explanation, get improvement suggestions, and start tracking your progress.</CardDescription>
                                        </CardContent>
                                        <div className="p-6 pt-0 flex justify-end">
                                           <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            {renderContent()}
        </div>
    );
}

export default function GoalsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Suspense>
                <Header />
            </Suspense>
            <main className="flex-1">
                <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
                    <GoalRecommendations />
                </Suspense>
            </main>
        </div>
    );
}
