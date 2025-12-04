
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetActionLogsQuery } from '@/services/api';
import { format, formatDistanceToNow } from 'date-fns';
import { Loader2, Search, CalendarIcon, FilePenLine, Trash2, PlusCircle, User, Settings, GalleryHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ActionLog = {
    _id: string;
    user: string;
    action: string;
    section: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
    timestamp: string;
};

const sectionIcons: { [key: string]: LucideIcon } = {
    Projects: FilePenLine,
    Team: User,
    Settings: Settings,
    Gallery: GalleryHorizontal,
    default: FilePenLine,
};

const typeColors: { [key: string]: string } = {
    CREATE: 'bg-green-500',
    UPDATE: 'bg-blue-500',
    DELETE: 'bg-red-500',
    LOGIN: 'bg-yellow-500',
    LOGOUT: 'bg-gray-500',
};


const HistoryPage = () => {
    const { data: logs = [], isLoading, isError } = useGetActionLogsQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSections, setSelectedSections] = useState<string[]>([]);

    const availableTypes = useMemo(() => Array.from(new Set(logs.map(log => log.type))), [logs]);
    const availableSections = useMemo(() => Array.from(new Set(logs.map(log => log.section))), [logs]);

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => {
                const logDate = new Date(log.timestamp);
                const fromDate = dateRange.from ? new Date(dateRange.from) : null;
                const toDate = dateRange.to ? new Date(dateRange.to) : null;

                if (fromDate && logDate < fromDate) return false;
                if (toDate && logDate > toDate) return false;

                if (selectedTypes.length > 0 && !selectedTypes.includes(log.type)) return false;
                if (selectedSections.length > 0 && !selectedSections.includes(log.section)) return false;
                
                if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase()) && !log.user.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                
                return true;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [logs, searchQuery, dateRange, selectedTypes, selectedSections]);
    
    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };
    
    const handleSectionToggle = (section: string) => {
        setSelectedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    if (isError) {
        return <div className="text-destructive">Error loading history. Please try again.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Filters Column */}
            <div className="lg:col-span-1 sticky top-16">
                <Card>
                    <CardHeader>
                        <CardTitle>Filter History</CardTitle>
                        <CardDescription>Refine the action logs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search actions..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Date Range</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.from ? (
                                            dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        
                        <div className="space-y-2">
                             <Label>Action Type</Label>
                             <div className="space-y-1">
                                {availableTypes.map(type => (
                                    <div key={type} className="flex items-center gap-2">
                                        <Checkbox id={`type-${type}`} checked={selectedTypes.includes(type)} onCheckedChange={() => handleTypeToggle(type)} />
                                        <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="space-y-2">
                             <Label>Section</Label>
                             <div className="space-y-1">
                                 {availableSections.map(section => (
                                    <div key={section} className="flex items-center gap-2">
                                        <Checkbox id={`section-${section}`} checked={selectedSections.includes(section)} onCheckedChange={() => handleSectionToggle(section)} />
                                        <Label htmlFor={`section-${section}`} className="font-normal">{section}</Label>
                                    </div>
                                ))}
                             </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Timeline Column */}
            <div className="lg:col-span-3">
                 <Card>
                    <CardHeader>
                        <CardTitle>Action History</CardTitle>
                        <CardDescription>A log of all administrative actions taken.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[70vh] pr-4">
                           <div className="relative pl-6">
                                <div className="absolute left-0 top-0 h-full w-0.5 bg-border" />
                                {filteredLogs.length > 0 ? filteredLogs.map(log => {
                                    const Icon = sectionIcons[log.section] || sectionIcons.default;
                                    return (
                                        <div key={log._id} className="relative mb-8">
                                            <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-background ring-4 ring-background flex items-center justify-center">
                                                <div className={`h-3 w-3 rounded-full ${typeColors[log.type] || 'bg-gray-400'}`} />
                                            </div>
                                            <div className="pl-6">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium"><span className="font-bold">{log.user}</span> {log.action}</p>
                                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                   <Icon className="h-3 w-3" />
                                                   <span>{log.section} / {log.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="text-center text-muted-foreground py-16">
                                        <p>No actions match your filters.</p>
                                    </div>
                                )}
                           </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HistoryPage;
