
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Legend } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils";
import { format, isWithinInterval, eachMonthOfInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon, Package, Presentation, UsersIcon, Loader2 } from 'lucide-react';
import { useGetProjectsDataQuery, useGetMatchesQuery, useGetAnalyticsDataQuery } from '@/services/api';

const chartConfig = {
  projects: {
    label: 'Projects',
    color: 'hsl(var(--primary))',
    icon: Package
  },
  matches: {
    label: 'Matches',
    color: 'hsl(var(--muted-foreground))',
    icon: Presentation
  },
  visits: {
    label: 'Visits',
    color: 'hsl(var(--primary))',
    icon: UsersIcon
  },
} satisfies ChartConfig;

const sectionData = {
    title: 'Our Trajectory of Innovation',
    subheadline: 'Our consistent growth in key areas reflects our commitment to pushing boundaries and achieving new milestones.',
};

export default function GrowthChart() {
    const { data: projectsData = [], isLoading: isProjectsLoading } = useGetProjectsDataQuery();
    const { data: matchesData = [], isLoading: isMatchesLoading } = useGetMatchesQuery();
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAnalyticsDataQuery();
    
    const [date, setDate] = useState<DateRange | undefined>(() => {
        const to = new Date();
        const from = new Date(to);
        from.setFullYear(from.getFullYear() - 1);
        return { from, to };
    });

    const isLoading = isProjectsLoading || isMatchesLoading || isAnalyticsLoading;

    const creationChartData = useMemo(() => {
        if (!projectsData || !matchesData || !date?.from || !date?.to) return [];

        const filteredProjects = projectsData.filter(p => isWithinInterval(new Date(p.createdAt), { start: date.from, end: date.to }));
        const filteredMatches = matchesData.filter(m => isWithinInterval(new Date(m.matchDate), { start: date.from, end: date.to }));
        
        const dataByMonth: { [key: string]: { month: string, projects: number, matches: number } } = {};

        const months = eachMonthOfInterval({ start: date.from, end: date.to });
        months.forEach(month => {
            const monthKey = format(month, 'MMM yyyy');
            dataByMonth[monthKey] = { month: monthKey, projects: 0, matches: 0 };
        });

        filteredProjects.forEach(project => {
            const monthKey = format(new Date(project.createdAt), 'MMM yyyy');
            if (dataByMonth[monthKey]) {
                dataByMonth[monthKey].projects += 1;
            }
        });

        filteredMatches.forEach(match => {
            const monthKey = format(new Date(match.matchDate), 'MMM yyyy');
            if (dataByMonth[monthKey]) {
                dataByMonth[monthKey].matches += 1;
            }
        });

        return Object.values(dataByMonth);
    }, [projectsData, matchesData, date]);
    
    const dailyVisitsChartData = useMemo(() => {
        if (!analyticsData?.dailyVisits || !date?.from || !date?.to) return [];
        return analyticsData.dailyVisits.filter(visit =>
            isWithinInterval(new Date(visit.date), { start: date.from, end: date.to })
        );
    }, [analyticsData, date]);

  return (
    <section id="growth" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                {sectionData.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                {sectionData.subheadline}
            </p>
        </div>

        <div className="flex justify-center mb-8">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
        </div>

        {isLoading ? (
             <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-md">
                    <CardHeader>
                        <CardTitle>Content Creation</CardTitle>
                        <CardDescription>New projects and matches created per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
                            <BarChart data={creationChartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                />
                                <YAxis />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Legend />
                                <Bar dataKey="projects" fill="var(--color-projects)" radius={4} />
                                <Bar dataKey="matches" fill="var(--color-matches)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="rounded-md">
                    <CardHeader>
                        <CardTitle>Daily Visits</CardTitle>
                        <CardDescription>Site visits over the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
                            <LineChart data={dailyVisitsChartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                                />
                                <YAxis domain={['dataMin', 'dataMax + 5']} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                    formatter={(value, name) => [value, chartConfig.visits.label]}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="count" name="Visits" stroke="var(--color-visits)" strokeWidth={2} dot={{r: 2}} activeDot={{r: 5}} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </section>
  );
}
