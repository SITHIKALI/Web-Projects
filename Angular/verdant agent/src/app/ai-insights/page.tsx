
"use client";

import { Suspense, useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { generateInsightsFromReport, GenerateInsightsFromReportOutput, KeyMetric } from '@/ai/flows/generate-insights-from-report';
import { Bot, TrendingUp, AlertTriangle, Lightbulb, Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { cn } from '@/lib/utils';


function AiInsightsContent() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<GenerateInsightsFromReportOutput | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ['text/plain', 'text/csv', 'text/markdown', 'application/json', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a .txt, .csv, .md, .json, .pdf, or .docx file.' });
                return;
            }
             if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: 'destructive', title: 'File too large', description: 'Please select a file smaller than 5MB.' });
                return;
            }
            setSelectedFile(file);
            setInsights(null);
        }
    };
    
    const handleAnalyzeRequest = async () => {
        if (!selectedFile) {
            toast({ variant: 'destructive', title: 'No file selected', description: 'Please upload a report to analyze.' });
            return;
        }

        setLoading(true);
        setInsights(null);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = async (loadEvent) => {
                const fileDataUri = loadEvent.target?.result as string;
                if(fileDataUri){
                    const result = await generateInsightsFromReport({ fileDataUri });
                    setInsights(result);
                    toast({ title: 'Analysis Complete', description: 'Insights from your report are ready.', className: 'bg-primary text-primary-foreground' });
                }
            };
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not generate insights from the report.' });
        } finally {
            setLoading(false);
        }
    };
    
    const chartConfig = {
        value: {
            label: "Value",
            color: "hsl(var(--primary))",
        },
    } satisfies ChartConfig

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Bot className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">AI Insights from Your Reports</h2>
                <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                    Upload your ESG reports (.pdf, .docx, .txt) to let our AI extract key metrics, identify trends, and provide actionable recommendations.
                </p>
            </div>

            <Card className="max-w-2xl mx-auto bg-card/50 shadow-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Upload Your Report</CardTitle>
                    <CardDescription>Select a PDF, DOCX, or text file from your device to begin.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,.md,.json" />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                        <Upload className="mr-2" />
                        Choose File
                    </Button>
                    {selectedFile && <span className="text-sm text-muted-foreground">{selectedFile.name}</span>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleAnalyzeRequest} disabled={loading || !selectedFile} className="w-full sm:w-auto">
                        {loading ? <><Loader2 className="mr-2 animate-spin"/>Analyzing...</> : 'Generate Insights'}
                    </Button>
                </CardFooter>
            </Card>
            
            {loading && (
                <div className="mt-12 space-y-8">
                    <Skeleton className="h-24 w-full" />
                    <div className="grid md:grid-cols-2 gap-8">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            )}
            
            {insights && (
                <div className="mt-12 space-y-8">
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle>Analysis Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{insights.summary}</p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="bg-green-500/10 border-green-500/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400"><TrendingUp /> Positive Trends</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {insights.positiveTrends.map((trend, i) => (
                                    <p key={i} className="text-sm text-muted-foreground">{trend}</p>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="bg-yellow-500/10 border-yellow-500/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-yellow-700 dark:text-yellow-400"><AlertTriangle /> Areas for Attention</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {insights.anomalies.map((anomaly, i) => (
                                    <p key={i} className="text-sm text-muted-foreground">{anomaly}</p>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-500/10 border-blue-500/20 lg:col-span-1">
                             <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-400"><Lightbulb /> Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {insights.suggestions.map((suggestion, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">{suggestion}</span>
                                    </li>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                    
                    {insights.keyMetrics && insights.keyMetrics.length > 0 && (
                        <Card className="bg-card/50">
                            <CardHeader>
                                <CardTitle>Key Metrics Visualized</CardTitle>
                                <CardDescription>A visual representation of the core data points found in your report.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <BarChart data={insights.keyMetrics} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                        <YAxis />
                                        <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={8} />
                                    </BarChart>
                                </ChartContainer>
                           </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}


export default function AiInsightsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Suspense>
                <Header />
            </Suspense>
            <main className="flex-1">
                <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
                    <AiInsightsContent />
                </Suspense>
            </main>
        </div>
    );
}
