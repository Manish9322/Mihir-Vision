
'use server';
import { MONGODB_URI } from '@/config/config';
import ClientsMarqueeClient from './clients-marquee-client';

type Client = {
    _id?: string;
    name: string;
    logoUrl: string;
    website?: string;
    isVisible: boolean;
};

const sectionData = {
    title: "Trusted by Industry Leaders",
};

async function getClientsData(): Promise<Client[] | null> {
  if (!MONGODB_URI) {
    console.error('MongoDB URI is not configured, skipping fetch for Clients section.');
    return null;
  }

  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
      : 'http://localhost:9002';
      
    const res = await fetch(`${baseUrl}/api/clients`, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Failed to fetch clients data: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('An error occurred while fetching clients data:', error);
    return null;
  }
}

export default async function ClientsMarquee() {
    const clients = await getClientsData();
    const visibleClients = clients?.filter(c => c.isVisible) || [];

    if (!visibleClients || visibleClients.length === 0) {
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
