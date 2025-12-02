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
    <section id="growth-chart" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>{growthChartData.title}</CardTitle>
            <CardDescription>{growthChartData.subheadline}</CardDescription>
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
