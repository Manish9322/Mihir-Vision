'use client';
import {
    Activity,
    ArrowUpRight,
    BookText,
    Mail,
    Users,
} from 'lucide-react';
import Link from 'next/link';

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

import { contactsData, growthChartData, dashboardData } from '@/lib/data';

const chartConfig = {
  projects: {
    label: 'Projects',
    color: 'hsl(var(--primary))',
  },
  patents: {
    label: 'Patents',
    color: 'hsl(var(--muted-foreground))',
  },
  investment: {
    label: 'R&D Investment (M)',
    color: 'hsl(var(--chart-2))',
  }
} satisfies ChartConfig;


const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {dashboardData.stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.change} vs. last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Innovation Growth</CardTitle>
                        <CardDescription>Projects and patents filed over the past years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={growthChartData.chartData} accessibilityLayer>
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
                                <Bar dataKey="patents" fill="var(--color-patents)" radius={4} />
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
                            <LineChart data={growthChartData.chartData} accessibilityLayer>
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
                                {contactsData.messages.slice(0, 4).map((message) => (
                                    <TableRow key={message.id}>
                                        <TableCell>
                                            <div className="font-medium">{message.name}</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
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
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>A log of recent actions taken in the admin panel.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {dashboardData.activities.map((activity, index) => (
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
                                        {activity.timestamp}
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
