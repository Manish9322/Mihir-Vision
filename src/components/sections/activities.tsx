import { activitiesData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Activities() {
  return (
    <section id="activities" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {activitiesData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {activitiesData.subheadline}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {activitiesData.activities.map((activity) => (
            <Card key={activity.title} className="text-center p-4 transition-transform transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <activity.icon className="h-8 w-8" />
                </div>
                <CardTitle className="font-headline">{activity.title}</CardTitle>
                <CardDescription className="pt-2">{activity.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
