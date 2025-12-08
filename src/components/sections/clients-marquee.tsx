
'use client';
import { useGetClientsDataQuery } from '@/services/api';
import ClientsMarqueeClient from './clients-marquee-client';

const sectionData = {
    title: "Trusted by Industry Leaders",
};

export default function ClientsMarquee() {
    const { data: clients, isLoading, isError } = useGetClientsDataQuery(undefined);
    const visibleClients = clients?.filter((c: any) => c.isVisible) || [];

    if (isLoading || isError || !visibleClients || visibleClients.length === 0) {
        return null;
    }

    return (
        <section id="clients" className="py-12 md:py-16 bg-background border-y">
            <div className="container max-w-7xl">
                <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider mb-8">
                    {sectionData.title}
                </p>
                <ClientsMarqueeClient clients={visibleClients} />
            </div>
        </section>
    );
}
