'use client';

import Image from 'next/image';
import Link from 'next/link';

type Client = {
    _id?: string;
    name: string;
    logoUrl: string;
    website?: string;
    isVisible: boolean;
};

export default function ClientsMarqueeClient({ clients }: { clients: Client[] }) {
    // Duplicate the logos to create a seamless loop
    const marqueeClients = [...clients, ...clients];

    return (
        <>
            <div className="relative overflow-hidden">
                <div className="flex animate-marquee-scroll hover:pause-animation">
                    {marqueeClients.map((client, index) => (
                        <Link href={client.website || '#'} key={`${client._id || index}-${index}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-48 h-20 mx-6 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                            <Image
                                src={client.logoUrl}
                                alt={client.name}
                                width={150}
                                height={50}
                                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </Link>
                    ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
            </div>
            <style jsx>{`
                @keyframes marquee-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-marquee-scroll {
                    animation: marquee-scroll 40s linear infinite;
                }
                .pause-animation {
                    animation-play-state: paused;
                }
            `}</style>
        </>
    );
}
