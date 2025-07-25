
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { generateGoalExplanation, GenerateGoalExplanationOutput } from '@/ai/flows/generate-goal-explanation';
import { suggestImprovements, SuggestImprovementsOutput } from '@/ai/flows/suggest-improvements';
import { generateWeeklyFeedback } from '@/ai/flows/generate-weekly-feedback';
import { generateEsgReport, GenerateEsgReportOutput } from '@/ai/flows/generate-esg-report';
import { Lightbulb, BookOpen, BarChart2, CheckCircle, ThumbsUp, FileText } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


interface WeeklyData {
    week: number;
    kpiInput: string;
    feedback: string;
    value: number; // A representative number from kpiInput for the chart
}

function DashboardComponent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const industry = searchParams.get('industry');
    const goal = searchParams.get('goal');
    
    const [explanation, setExplanation] = useState<GenerateGoalExplanationOutput | null>(null);
    const [suggestions, setSuggestions] = useState<SuggestImprovementsOutput | null>(null);
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [currentKpiInput, setCurrentKpiInput] = useState('');
    const [loading, setLoading] = useState({ explanation: true, suggestions: true, feedback: false, report: false });
    const [report, setReport] = useState<GenerateEsgReportOutput | null>(null);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

    useEffect(() => {
        if (industry && goal) {
            setLoading(prev => ({ ...prev, explanation: true, suggestions: true }));
            
            generateGoalExplanation({ industry, goal })
                .then(setExplanation)
                .catch(err => {
                    console.error(err);
                    toast({ variant: 'destructive', title: 'Error', description: 'Failed to load goal explanation.' });
                })
                .finally(() => setLoading(prev => ({ ...prev, explanation: false })));

            suggestImprovements({ industry, selectedGoal: goal })
                .then(setSuggestions)
                .catch(err => {
                    console.error(err);
                    toast({ variant: 'destructive', title: 'Error', description: 'Failed to load improvement suggestions.' });
                })
                .finally(() => setLoading(prev => ({ ...prev, suggestions: false })));
        }
    }, [industry, goal, toast]);

    const handleFeedbackRequest = async () => {
        if (!currentKpiInput || !industry || !goal) return;

        setLoading(prev => ({ ...prev, feedback: true }));
        try {
            const previousFeedback = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].feedback : undefined;
            const res = await generateWeeklyFeedback({
                industry,
                goal,
                weeklyKpiData: currentKpiInput,
                previousFeedback
            });

            const parsedValue = parseFloat(currentKpiInput.match(/(\d+(\.\d+)?)/)?.[0] || '0');

            const newEntry: WeeklyData = {
                week: weeklyData.length + 1,
                kpiInput: currentKpiInput,
                feedback: res.feedback,
                value: parsedValue,
            };

            setWeeklyData(prev => [...prev, newEntry]);
            setCurrentKpiInput('');
            toast({ title: 'Feedback Generated!', description: 'Your weekly feedback is ready.', className: 'bg-primary text-primary-foreground' });
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate feedback.' });
        } finally {
            setLoading(prev => ({ ...prev, feedback: false }));
        }
    };
    
    const handleReportRequest = async () => {
        if (!industry || !goal || weeklyData.length === 0) return;

        setLoading(prev => ({ ...prev, report: true }));
        try {
            const reportData = await generateEsgReport({ industry, goal, allWeeklyData: weeklyData });
            setReport(reportData);
            setIsReportDialogOpen(true);
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate ESG report.' });
        } finally {
            setLoading(prev => ({ ...prev, report: false }));
        }
    };
    
    const chartConfig = {
        value: {
            label: "KPI Value",
            color: "hsl(var(--primary))",
        },
    } satisfies ChartConfig

    if (!industry || !goal) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6 text-center">
                <p>Missing information. Please start over.</p>
                <Button asChild className="mt-4"><Link href="/">Go Back</Link></Button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">{goal}</h2>
                <p className="text-lg text-muted-foreground">Your dashboard for achieving sustainability in <span className="font-bold text-primary">{industry}</span>.</p>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
                    <TabsTrigger value="details"><BookOpen className="mr-2" />Goal Details</TabsTrigger>
                    <TabsTrigger value="suggestions"><Lightbulb className="mr-2"/>Improvements</TabsTrigger>
                    <TabsTrigger value="tracking"><BarChart2 className="mr-2"/>Tracking</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                    <Card className="bg-card/50">
                        <CardHeader><CardTitle className="text-2xl font-bold">Goal Explanation</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            {loading.explanation ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-1/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-6 w-1/4 mt-4" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            ) : explanation ? (
                                <>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Why It's Important</h3>
                                        <p className="text-muted-foreground">{explanation.importance}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Example KPIs</h3>
                                        <p className="text-muted-foreground">{explanation.kpis}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Success Stories</h3>
                                        <p className="text-muted-foreground">{explanation.successStories}</p>
                                    </div>
                                </>
                            ) : <p>Could not load goal details.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions" className="mt-6">
                     <Card className="bg-card/50">
                        <CardHeader><CardTitle className="text-2xl font-bold">Improvement Suggestions</CardTitle></CardHeader>
                        <CardContent>
                            {loading.suggestions ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-5/6" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ) : suggestions ? (
                                <ul className="space-y-3">
                                    {suggestions.suggestions.map((s, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>Could not load suggestions.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tracking" className="mt-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                           <Card className="bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Log Your Weekly Progress</CardTitle>
                                    <CardDescription>Enter your KPI data for this week. Be specific, e.g., "Energy used: 5100 kWh, CO2 emissions: 1400 kg".</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea 
                                        placeholder="Enter weekly data..."
                                        value={currentKpiInput}
                                        onChange={(e) => setCurrentKpiInput(e.target.value)}
                                        rows={4}
                                        className="bg-background"
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleFeedbackRequest} disabled={loading.feedback || !currentKpiInput}>
                                        {loading.feedback ? 'Analyzing...' : 'Get AI Feedback'}
                                    </Button>
                                </CardFooter>
                            </Card>
                            {weeklyData.length > 0 && (
                               <Card className="bg-card/50">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-2xl font-bold">Feedback History</CardTitle>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={handleReportRequest} 
                                            disabled={loading.report || weeklyData.length === 0}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            {loading.report ? 'Generating...' : 'Generate Report'}
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                                        {weeklyData.slice().reverse().map(entry => (
                                            <div key={entry.week} className="p-4 rounded-lg border border-border">
                                                <p className="font-bold">Week {entry.week}</p>
                                                <p className="text-sm text-muted-foreground mt-1"><strong>Data:</strong> {entry.kpiInput}</p>
                                                <div className="mt-3 flex items-start gap-3 bg-primary/10 p-3 rounded-md">
                                                     <ThumbsUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                                     <p className="text-sm">{entry.feedback}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        <Card className="bg-card/50">
                           <CardHeader>
                                <CardTitle className="text-2xl font-bold">Progress Over Time</CardTitle>
                                <CardDescription>Your primary KPI value, tracked weekly.</CardDescription>
                           </CardHeader>
                           <CardContent>
                               {weeklyData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="week" tickFormatter={(value) => `W${value}`}/>
                                        <YAxis />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} activeDot={{ r: 8 }}/>
                                    </LineChart>
                                </ChartContainer>
                               ) : (
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-secondary/30 rounded-lg">
                                    <p>Your progress chart will appear here once you log data.</p>
                                </div>
                               )}
                           </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
            <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Your ESG Performance Report</AlertDialogTitle>
                        <AlertDialogDescription>A summary of your progress for the goal: "{goal}". This can be copied into a document for your records.</AlertDialogDescription>
                    </AlertDialogHeader>
                    {report && (
                        <div className="text-sm space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                           <div>
                                <h4 className="font-bold text-base mb-1">Overview</h4>
                                <p className="text-muted-foreground">{report.overview}</p>
                           </div>
                            <div>
                                <h4 className="font-bold text-base mb-1">Positive Improvements</h4>
                                <p className="text-muted-foreground">{report.positiveImprovements}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-base mb-1">Areas for Attention</h4>
                                <p className="text-muted-foreground">{report.areasForAttention}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-base mb-1">Suggested Action Points</h4>
                                <p className="text-muted-foreground">{report.actionPoints}</p>
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsReportDialogOpen(false)}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Suspense>
                <Header />
            </Suspense>
            <main className="flex-1">
                <Suspense fallback={<div className="text-center p-12">Loading Dashboard...</div>}>
                    <DashboardComponent />
                </Suspense>
            </main>
        </div>
    );
}
