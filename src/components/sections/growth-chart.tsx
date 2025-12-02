'use client';

import { growthChartData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  projects: {
    label: 'Projects',
    color: 'hsl(var(--primary))',
  },
  patents: {
    label: 'Patents',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig;

export default function GrowthChart() {
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
        <Card>
          <CardHeader>
            <CardTitle>{growthChartData.chartTitle}</CardTitle>
            <CardDescription>{growthChartData.chartSubheadline}</CardDescription>
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
                <Bar dataKey="projects" fill="var(--color-projects)" radius={4} />
                <Bar dataKey="patents" fill="var(--color-patents)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
