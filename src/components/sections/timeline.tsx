import { timelineData } from '@/lib/data';

export default function Timeline() {
  return (
    <section id="timeline" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {timelineData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {timelineData.subheadline}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border dark:bg-primary/30 md:-translate-x-1/2" aria-hidden="true"></div>

          {timelineData.events.map((event, index) => (
            <div key={event.year} className="relative mb-12">
              <div className={`flex items-center md:${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 text-left pl-12'}`}>
                  <div className="p-6 rounded-lg bg-card shadow-md">
                    <p className="text-sm font-semibold text-primary">{event.year}</p>
                    <h3 className="mt-1 text-xl font-bold font-headline">{event.title}</h3>
                    <p className="mt-2 text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-1/2">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-8 ring-secondary">
                  <event.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
