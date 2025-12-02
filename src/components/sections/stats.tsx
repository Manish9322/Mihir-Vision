import { statsData } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

export default function Stats() {
  return (
    <section id="stats" className="pb-16 md:pb-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {statsData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {statsData.subheadline}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {statsData.stats.map((stat) => (
            <Card key={stat.label} className="flex items-center p-6 bg-secondary/50 border-0">
              <div className="mr-4 bg-primary/10 text-primary p-3 rounded-lg">
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
