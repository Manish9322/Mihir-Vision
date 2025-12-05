
'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useGetAnalyticsDataQuery } from '@/services/api';
import { Loader2, AlertTriangle, Users, BarChart3, Clock, Globe, Tv, Smartphone, Tablet, Laptop, HelpCircle, LineChartIcon, PieChartIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';


const StatsPageSkeleton = () => (
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead><Skeleton className="h-5 w-24" /></TableHead><TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}><TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell className="text-right"><Skeleton className="h-5 w-14 ml-auto" /></TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
                <CardContent className="flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead><Skeleton className="h-5 w-24" /></TableHead><TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead></TableRow></TableHeader>
                        <TableBody>
                             {[...Array(5)].map((_, i) => (
                                <TableRow key={i}><TableCell><Skeleton className="h-5 w-28" /></TableCell><TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead><Skeleton className="h-5 w-32" /></TableHead><TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}><TableCell><Skeleton className="h-5 w-28" /></TableCell><TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
);


const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const deviceIcons = {
    Desktop: Laptop,
    Mobile: Smartphone,
    Tablet: Tablet,
    TV: Tv,
    Other: HelpCircle
};

const StatsPage = () => {
    const { data: stats, isLoading, isError } = useGetAnalyticsDataQuery();

    const chartConfigs = useMemo(() => {
        if (!stats) return {};

        const dailyVisitsConfig: ChartConfig = {
            count: { label: 'Visits', color: 'hsl(var(--chart-1))' },
        };
        
        const visitsPerPageConfig: ChartConfig = {
            visits: { label: 'Visits' },
        };
        
        const deviceDistributionConfig: ChartConfig = {
            visits: { label: 'Visits' },
        };

        return { dailyVisitsConfig, visitsPerPageConfig, deviceDistributionConfig };
    }, [stats]);


    if (isLoading) {
        return <StatsPageSkeleton />;
    }
    
    if (isError || !stats) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Analytics</CardTitle>
                <CardDescription className="mt-2">There was a problem fetching the site analytics data. Please try refreshing.</CardDescription>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalVisits}</div>
                        <p className="text-xs text-muted-foreground">All time page loads</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
                         <p className="text-xs text-muted-foreground">Based on hashed IP and user agent</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageSessionDuration}s</div>
                         <p className="text-xs text-muted-foreground">Average time spent on a page</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LineChartIcon className="h-5 w-5" /> Daily Visits</CardTitle>
                    <CardDescription>Total site visits over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfigs.dailyVisitsConfig} className="h-[300px] w-full">
                        <LineChart data={stats.dailyVisits} accessibilityLayer margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(val) => format(parseISO(val), 'MMM d')} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Most Visited Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Page</TableHead>
                                    <TableHead className="text-right">Visits</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.visitsPerPage.map(page => (
                                    <TableRow key={page.page}>
                                        <TableCell className="font-medium">{page.page}</TableCell>
                                        <TableCell className="text-right">{page.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5" /> Device Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                         <ChartContainer config={chartConfigs.deviceDistributionConfig} className="h-[250px] w-full">
                            <PieChart>
                                <Pie data={stats.deviceDistribution} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({percent, name, ...rest}) => renderCustomizedLabel({percent, name, ...rest})}>
                                     {stats.deviceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent nameKey="device" />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Visits by Browser</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader><TableRow><TableHead>Browser</TableHead><TableHead className="text-right">Visits</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {stats.browserDistribution.map(item => (
                                    <TableRow key={item.browser}><TableCell>{item.browser}</TableCell><TableCell className="text-right">{item.count}</TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Visits by OS</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader><TableRow><TableHead>Operating System</TableHead><TableHead className="text-right">Visits</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {stats.osDistribution.map(item => (
                                    <TableRow key={item.os}><TableCell>{item.os}</TableCell><TableCell className="text-right">{item.count}</TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default StatsPage;
