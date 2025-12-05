
'use client';
import {
    ArrowUpRight,
    Users as UsersIcon,
    DollarSign,
    LineChart as LineChartIcon,
    BookOpen,
    Mail,
    Loader2,
    AlertTriangle,
    CalendarIcon
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DateRange } from "react-day-picker"
import { format } from "date-fns"


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Legend } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from "@/lib/utils";


import { growthChartData } from '@/lib/data';
import { useGetContactsQuery, useGetActionLogsQuery, useGetAnalyticsDataQuery, useGetProjectsDataQuery } from '@/services/api';


const chartConfig = {
  projects: {
    label: 'Projects',
    color: 'hsl(var(--primary))',
  },
  games: {
    label: 'Games',
    color: 'hsl(var(--muted-foreground))',
  },
  investment: {
    label: 'R&D Investment (M)',
    color: 'hsl(var(--primary))', // Updated to purple
  },
  patents: {
    label: 'Patents',
    color: 'hsl(var(--muted-foreground))'
  }
} satisfies ChartConfig;


const AdminDashboardSkeleton = () => (
    <div className="flex flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
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
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
             <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2"><Skeleton className="h-7 w-32" /><Skeleton className="h-4 w-48" /></div>
                    <Skeleton className="h-8 w-24 ml-auto" />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead><Skeleton className="h-5 w-24" /></TableHead><TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}><TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell className="text-right"><Skeleton className="h-6 w-14 ml-auto rounded-full" /></TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2"><Skeleton className="h-7 w-32" /><Skeleton className="h-4 w-48" /></div>
                    <Skeleton className="h-8 w-24 ml-auto" />
                </CardHeader>
                <CardContent className="grid gap-6">
                     {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="grid gap-1 flex-1"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
);


const AdminDashboardPage = () => {
    const { data: contactsData = [], isLoading: isContactsLoading, isError: isContactsError } = useGetContactsQuery();
    const { data: actionLogs = [], isLoading: isLogsLoading, isError: isLogsError } = useGetActionLogsQuery();
    const { data: analyticsData, isLoading: isAnalyticsLoading, isError: isAnalyticsError } = useGetAnalyticsDataQuery();
    const { data: projectsData = [], isLoading: isProjectsLoading, isError: isProjectsError } = useGetProjectsDataQuery();
    
    const [date, setDate] = useState<DateRange | undefined>(() => {
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        return { from, to };
    });

    const isLoading = isContactsLoading || isLogsLoading || isAnalyticsLoading || isProjectsLoading;
    const isError = isContactsError || isLogsError || isAnalyticsError || isProjectsError;

    const stats = useMemo(() => {
        return {
            totalVisitors: analyticsData?.totalVisits || '0',
            newMessages: contactsData.filter(c => c.status === 'New').length || 0,
            activeProjects: projectsData.length || 0,
            rdSpend: '$5.2M', // This remains static as per original data
        }
    }, [analyticsData, contactsData, projectsData]);
    
    const filteredChartData = useMemo(() => {
        if (!date?.from || !date?.to) {
            return growthChartData.chartData;
        }
        const startYear = date.from.getFullYear();
        const endYear = date.to.getFullYear();
        
        return growthChartData.chartData.filter(d => {
            const year = parseInt(d.year);
            return year >= startYear && year <= endYear;
        });
    }, [date]);


    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }

    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Dashboard</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the data for the dashboard. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }


    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalVisitors}</div>
                        <p className="text-xs text-muted-foreground">All time visitors</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.newMessages}</div>
                        <p className="text-xs text-muted-foreground">Unread submissions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">Total projects managed</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">R&D Spend</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rdSpend}</div>
                        <p className="text-xs text-muted-foreground">Current fiscal year</p>
                    </CardContent>
                </Card>
            </div>
            
             <div className="flex justify-end">
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
                    <PopoverContent className="w-auto p-0" align="end">
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

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Innovation Growth</CardTitle>
                        <CardDescription>Projects and games released over the past years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={filteredChartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="year"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 4)}
                                />
                                <YAxis />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Legend />
                                <Bar dataKey="projects" fill="var(--color-projects)" radius={4} />
                                <Bar dataKey="games" fill="var(--color-games)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>R&amp;D Investment Growth</CardTitle>
                        <CardDescription>Millions of USD invested per year.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <LineChart data={filteredChartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="year"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 4)}
                                />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} unit="M" />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="investment" stroke="var(--color-investment)" strokeWidth={2} dot={{r: 5, fill: 'var(--color-investment)'}} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                        <CardTitle>Recent Messages</CardTitle>
                        <CardDescription>
                            Newest contact form submissions.
                        </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/admin/contacts">
                            View All
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className='text-right'>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contactsData.slice(0, 5).map((message) => (
                                    <TableRow key={message._id}>
                                        <TableCell>
                                            <div className="font-medium">{message.name}</div>
                                            <div className="hidden text-sm text-muted-foreground sm:inline">
                                                {message.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                             <Badge className="text-xs" variant={message.status === 'New' ? 'default' : 'outline'}>
                                                {message.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>A log of recent actions taken in the admin panel.</CardDescription>
                        </div>
                         <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/admin/history">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {actionLogs.slice(0, 5).map((activity, index) => (
                             <div key={index} className="flex items-center gap-4">
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                    <AvatarImage src={`https://picsum.photos/seed/${activity.user.split(' ')[0]}/32/32`} alt="Avatar" />
                                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">
                                        <span className='font-semibold'>{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboardPage;

    