'use client';

import { useState, useMemo } from 'react';
import { growthChartData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Legend } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const allYears = growthChartData.chartData.map(d => d.year);

export default function GrowthChart() {
  const [startYear, setStartYear] = useState(allYears[0]);
  const [endYear, setEndYear] = useState(allYears[allYears.length - 1]);

  const filteredData = useMemo(() => {
    const startIndex = allYears.indexOf(startYear);
    const endIndex = allYears.indexOf(endYear);
    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        return growthChartData.chartData;
    }
    return growthChartData.chartData.slice(startIndex, endIndex + 1);
  }, [startYear, endYear]);

  const availableStartYears = allYears.slice(0, allYears.indexOf(endYear) + 1);
  const availableEndYears = allYears.slice(allYears.indexOf(startYear));

  return (
    <section id="growth" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                {growthChartData.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                {growthChartData.subheadline}
            </p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">From</span>
                 <Select value={startYear} onValueChange={setStartYear}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Start Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableStartYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
           <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">To</span>
                <Select value={endYear} onValueChange={setEndYear}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="End Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableEndYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                    </SelectContent>
                </Select>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>{growthChartData.chartTitle}</CardTitle>
                    <CardDescription>{growthChartData.chartSubheadline}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] md:h-[250px] w-full">
                        <BarChart data={filteredData} accessibilityLayer>
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
                     <ChartContainer config={chartConfig} className="h-[200px] md:h-[250px] w-full">
                        <LineChart data={filteredData} accessibilityLayer>
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
      </div>
    </section>
  );
}
