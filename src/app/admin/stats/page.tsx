
'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Legend, Pie, PieChart, Cell } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useGetProjectsDataQuery, useGetGamesDataQuery, useGetTeamDataQuery, useGetClientsDataQuery, useGetContactsQuery, useGetFaqDataQuery, useGetTimelineDataQuery, useGetActivitiesDataQuery, useGetGalleryDataQuery, useGetVideosDataQuery, useGetDesignationsQuery } from '@/services/api';
import { Loader2, AlertTriangle, Package, Gamepad2, Users, Handshake, HelpCircle, Milestone, Activity, GalleryHorizontal, Clapperboard, LineChart as LineChartIcon, UsersRound, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${payload.name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};


const StatsPage = () => {
    const { data: projects = [], isLoading: pLoading, isError: pError } = useGetProjectsDataQuery();
    const { data: games = [], isLoading: gLoading, isError: gError } = useGetGamesDataQuery();
    const { data: team = [], isLoading: tLoading, isError: tError } = useGetTeamDataQuery();
    const { data: clients = [], isLoading: cLoading, isError: cError } = useGetClientsDataQuery();
    const { data: contacts = [], isLoading: ctLoading, isError: ctError } = useGetContactsQuery();
    const { data: faqs = [], isLoading: fLoading, isError: fError } = useGetFaqDataQuery();
    const { data: timeline = [], isLoading: tlLoading, isError: tlError } = useGetTimelineDataQuery();
    const { data: activities = [], isLoading: acLoading, isError: acError } = useGetActivitiesDataQuery();
    const { data: gallery = [], isLoading: gaLoading, isError: gaError } = useGetGalleryDataQuery();
    const { data: videos = [], isLoading: vLoading, isError: vError } = useGetVideosDataQuery();
    const { data: designations = [], isLoading: dLoading, isError: dError } = useGetDesignationsQuery();

    const isLoading = pLoading || gLoading || tLoading || cLoading || ctLoading || fLoading || tlLoading || acLoading || gaLoading || vLoading || dLoading;
    const isError = pError || gError || tError || cError || ctError || fError || tlError || acError || gaError || vError || dError;

    const stats = useMemo(() => {
        // Content Inventory
        const inventory = [
            { name: 'Projects', count: projects.length, icon: Package },
            { name: 'Games', count: games.length, icon: Gamepad2 },
            { name: 'Team Members', count: team.length, icon: Users },
            { name: 'Clients', count: clients.length, icon: Handshake },
            { name: 'FAQs', count: faqs.length, icon: HelpCircle },
            { name: 'Timeline Events', count: timeline.length, icon: Milestone },
            { name: 'Activities', count: activities.length, icon: Activity },
            { name: 'Gallery Images', count: gallery.length, icon: GalleryHorizontal },
            { name: 'Videos', count: videos.length, icon: Clapperboard },
        ];

        // Visibility Breakdown
        const visibility = [
            { name: 'Projects', visible: projects.filter(p => p.isVisible).length, hidden: projects.filter(p => !p.isVisible).length },
            { name: 'Games', visible: games.filter(g => g.isVisible).length, hidden: games.filter(g => !g.isVisible).length },
            { name: 'Team', visible: team.filter(t => t.isVisible).length, hidden: team.filter(t => !t.isVisible).length },
            { name: 'Clients', visible: clients.filter(c => c.isVisible).length, hidden: clients.filter(c => !c.isVisible).length },
        ];
        const visibilityChartConfig: ChartConfig = {
            visible: { label: 'Visible', color: 'hsl(var(--chart-1))' },
            hidden: { label: 'Hidden', color: 'hsl(var(--chart-2))' },
        };

        // Project Tag Distribution
        const tagCounts = projects.flatMap(p => p.tags).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        const tagData = Object.entries(tagCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
        const tagChartConfig: ChartConfig = { count: { label: 'Count', color: 'hsl(var(--chart-1))' } };
        
        // Game Platform Distribution
        const platformCounts = games.flatMap(g => g.platforms).reduce((acc, platform) => {
            acc[platform] = (acc[platform] || 0) + 1;
            return acc;
        }, {});
        const platformData = Object.entries(platformCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
        const platformChartConfig: ChartConfig = { count: { label: 'Count', color: 'hsl(var(--chart-2))' } };

        // Team Composition
        const designationCounts = team.reduce((acc, member) => {
            acc[member.designation] = (acc[member.designation] || 0) + 1;
            return acc;
        }, {});
        const designationData = Object.entries(designationCounts).map(([name, value]) => ({ name, value }));

        // Contact Message Trend
        const messageTrend = contacts
            .reduce((acc, contact) => {
                const date = format(new Date(contact.createdAt), 'yyyy-MM-dd');
                const entry = acc.find(d => d.date === date);
                if (entry) {
                    entry.count += 1;
                } else {
                    acc.push({ date, count: 1 });
                }
                return acc;
            }, [] as {date: string, count: number}[])
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const messageTrendChartConfig: ChartConfig = { count: { label: 'Messages', color: 'hsl(var(--chart-1))' } };

        return { inventory, visibility, visibilityChartConfig, tagData, tagChartConfig, platformData, platformChartConfig, designationData, messageTrend, messageTrendChartConfig };
    }, [projects, games, team, clients, contacts, faqs, timeline, activities, gallery, videos, designations]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg text-muted-foreground">Loading statistics...</p>
            </div>
        );
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Statistics</CardTitle>
                <CardDescription className="mt-2">There was a problem fetching the data for the stats page. Please try refreshing.</CardDescription>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Content Inventory</CardTitle>
                    <CardDescription>An overview of all content types across your application.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {stats.inventory.map(item => (
                        <Card key={item.name} className="p-4 flex flex-col items-center justify-center">
                             <item.icon className="h-8 w-8 text-primary mb-2" />
                             <p className="text-3xl font-bold">{item.count}</p>
                             <p className="text-sm text-muted-foreground">{item.name}</p>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <div className="grid gap-8 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5" /> Content Visibility</CardTitle>
                        <CardDescription>Breakdown of visible vs. hidden content items.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={stats.visibilityChartConfig} className="h-[250px] w-full">
                            <BarChart data={stats.visibility} layout="vertical" stackOffset="expand" accessibilityLayer>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" hide />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="visible" fill="var(--color-visible)" stackId="a" radius={[4, 4, 4, 4]} />
                                <Bar dataKey="hidden" fill="var(--color-hidden)" stackId="a" radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><LineChartIcon className="h-5 w-5" /> Contact Message Trend</CardTitle>
                        <CardDescription>Number of new contact form submissions over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={stats.messageTrendChartConfig} className="h-[250px] w-full">
                            <LineChart data={stats.messageTrend} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(val) => format(new Date(val), 'MMM d')} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            
             <div className="grid gap-8 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Project Tag Distribution</CardTitle>
                        <CardDescription>Frequency of tags used across all projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={stats.tagChartConfig} className="h-[300px] w-full">
                            <BarChart data={stats.tagData} layout="vertical" accessibilityLayer>
                                <CartesianGrid horizontal={false} />
                                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} />
                                <XAxis type="number" hide />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={4}>
                                     {stats.tagData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gamepad2 className="h-5 w-5" /> Game Platform Distribution</CardTitle>
                        <CardDescription>Number of games available on each platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={stats.platformChartConfig} className="h-[300px] w-full">
                             <BarChart data={stats.platformData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={4}>
                                     {stats.platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UsersRound className="h-5 w-5" /> Team Composition</CardTitle>
                        <CardDescription>Breakdown of team members by their role.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{}} className="h-[300px] w-full">
                            <PieChart>
                                <Pie data={stats.designationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="hsl(var(--primary))" labelLine={false} label={renderCustomizedLabel}>
                                     {stats.designationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-muted-foreground">Site Traffic Analytics</CardTitle>
                         <CardDescription>User visit data (who, when, how) requires a dedicated analytics service integration.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[250px]">
                        <div className="text-center">
                            <p className="text-muted-foreground">This feature is not yet enabled.</p>
                            <p className="text-xs text-muted-foreground/80 mt-2">Consider integrating a service like Google Analytics.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StatsPage;


    