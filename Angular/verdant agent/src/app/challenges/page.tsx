
"use client";

import { Suspense, useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { Check, Calendar, Award, Users, Target, PlusCircle, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: 'Individual' | 'Community';
  reward: string;
  icon: React.ReactNode;
  isJoined: boolean;
  progress: number;
  actionGoal: number; // How many actions to complete the challenge
}

interface Achievement {
    id: number;
    name: string;
}

const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: 'Go Paperless Week',
    description: 'Reduce paper consumption by using digital notes and receipts.',
    type: 'Individual',
    reward: 'Paperless Pioneer Badge',
    icon: <Target className="w-8 h-8 text-primary" />,
    isJoined: false,
    progress: 0,
    actionGoal: 7,
  },
  {
    id: 2,
    title: 'Plastic-Free Day',
    description: 'Avoid all single-use plastics for an entire day.',
    type: 'Community',
    reward: 'Plastic-Free Champion',
    icon: <Users className="w-8 h-8 text-primary" />,
    isJoined: false,
    progress: 0,
    actionGoal: 1,
  },
  {
    id: 3,
    title: 'Mindful Commuting',
    description: 'Choose a sustainable transport option like walking, biking, or public transit.',
    type: 'Individual',
    reward: 'Green Commuter Badge',
    icon: <Target className="w-8 h-8 text-primary" />,
    isJoined: false,
    progress: 0,
    actionGoal: 5,
  },
   {
    id: 4,
    title: 'Waste Reduction Challenge',
    description: 'Halve your non-recyclable waste output for a week.',
    type: 'Community',
    reward: 'Waste Reduction Leader',
    icon: <Users className="w-8 h-8 text-primary" />,
    isJoined: false,
    progress: 0,
    actionGoal: 7,
  },
];

const initialAchievements: Achievement[] = [
    { id: 1, name: 'Eco Warrior'},
    { id: 2, name: 'Plastic-Free Hero'},
];

function ChallengesComponent() {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  const activeChallenges = challenges.filter(c => c.isJoined);
  const availableChallenges = challenges.filter(c => !c.isJoined);

  const toggleJoinChallenge = (id: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const wasJoined = c.isJoined;
        const newProgress = !wasJoined ? c.progress : 0; // Reset progress on leaving
        toast({
          title: wasJoined ? 'Challenge Left' : 'Challenge Joined',
          description: wasJoined ? `You've left the "${c.title}" challenge.` : `You've joined the "${c.title}" challenge. Good luck!`,
          className: cn(wasJoined ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"),
        });
        return { ...c, isJoined: !c.isJoined, progress: newProgress };
      }
      return c;
    }));
  };
  
  const logAction = (id: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id && c.progress < c.actionGoal) {
        const newProgress = c.progress + 1;
        const isCompleted = newProgress >= c.actionGoal;

        if(isCompleted) {
            toast({
                title: 'Challenge Complete!',
                description: `You've completed "${c.title}" and earned the achievement: ${c.reward}!`,
                className: "bg-green-500 text-white"
            });
            // Add achievement and un-join the challenge
            setAchievements(prevAchievements => [...prevAchievements, { id: Date.now(), name: c.reward }]);
            return { ...c, isJoined: false, progress: 0 };
        } else {
            toast({
                title: 'Action Logged',
                description: `Great job! You're one step closer in the "${c.title}" challenge.`
            });
        }
        
        return { ...c, progress: newProgress };
      }
      return c;
    }));
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Sustainability Challenges</h2>
            <p className="text-lg text-muted-foreground mt-2">Join challenges, track your progress, and earn recognitions.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Active Challenges */}
              {activeChallenges.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">My Active Challenges</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeChallenges.map((challenge) => (
                      <Card key={challenge.id} className="bg-primary/5 flex flex-col border-2 border-primary/20 shadow-lg">
                          <CardHeader>
                              <div className="flex items-start gap-4">
                                  <div className="p-3 bg-primary/10 rounded-full">{challenge.icon}</div>
                                  <div>
                                      <CardTitle className="text-xl font-bold">{challenge.title}</CardTitle>
                                      <CardDescription className="mt-1">{challenge.description}</CardDescription>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent className="flex-grow space-y-4">
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {challenge.progress} / {challenge.actionGoal} actions</span>
                                  <span className="font-bold">{challenge.type}</span>
                              </div>
                              <div>
                                  <Progress value={(challenge.progress / challenge.actionGoal) * 100} aria-label={`${challenge.progress} of ${challenge.actionGoal} actions completed`} />
                                  <p className="text-sm text-muted-foreground mt-1.5">{Math.round((challenge.progress / challenge.actionGoal) * 100)}% complete</p>
                              </div>
                          </CardContent>
                           <CardFooter className="grid grid-cols-2 gap-2">
                               <Button onClick={() => logAction(challenge.id)} className="w-full">
                                  <PlusCircle className="mr-2" /> Log Action
                              </Button>
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <Button variant="outline" className="w-full">
                                          <LogOut className="mr-2" /> Leave
                                      </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          If you leave the "{challenge.title}" challenge, your progress will be reset.
                                      </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => toggleJoinChallenge(challenge.id)} className={cn(buttonVariants({variant: 'destructive'}))}>Leave Challenge</AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Available Challenges */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Available Challenges</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {availableChallenges.map((challenge) => (
                        <Card key={challenge.id} className="bg-card/50 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-full">{challenge.icon}</div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">{challenge.title}</CardTitle>
                                        <CardDescription className="mt-1">{challenge.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-2 text-sm">
                                  <p className="flex items-center gap-2 text-muted-foreground"><Target className="w-4 h-4 text-primary"/>Goal: {challenge.actionGoal} actions</p>
                                  <p className="flex items-center gap-2 text-muted-foreground"><Award className="w-4 h-4 text-primary"/>Reward: {challenge.reward}</p>
                                  <p className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 text-primary"/>Type: {challenge.type}</p>
                                </div>
                            </CardContent>
                             <CardFooter>
                                <Button onClick={() => toggleJoinChallenge(challenge.id)} className="w-full">
                                    <LogIn className="mr-2" /> Join Challenge
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                 {availableChallenges.length === 0 && (
                  <div className="text-center py-10 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground">No more challenges available. Check back later!</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">My Achievements</CardTitle>
                        <CardDescription>Badges and recognitions you've earned.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {achievements.length > 0 ? (
                            <ul className="space-y-3">
                                {achievements.map(achievement => (
                                    <li key={achievement.id} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                                        <Award className="w-6 h-6 text-primary" />
                                        <span className="font-semibold">{achievement.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                           <p className="text-center text-muted-foreground py-4">You haven't earned any achievements yet. Join a challenge to get started!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

export default function ChallengesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <Suspense fallback={<div className="text-center p-12">Loading Challenges...</div>}>
          <ChallengesComponent />
        </Suspense>
      </main>
    </div>
  );
}

    