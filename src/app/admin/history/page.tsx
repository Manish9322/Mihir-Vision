
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useGetActionLogsQuery } from '@/services/api';
import { format } from 'date-fns';
import { Loader2, Search, CalendarIcon, ListFilter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type ActionLog = {
    _id: string;
    user: string;
    action: string;
    section: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
    timestamp: string;
};

const ITEMS_PER_PAGE = 10;

const typeColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    CREATE: 'default',
    UPDATE: 'secondary',
    DELETE: 'destructive',
    LOGIN: 'default',
    LOGOUT: 'outline',
};


const HistoryPage = () => {
    const { data: logs = [], isLoading, isError } = useGetActionLogsQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({ from: undefined, to: undefined });
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSections, setSelectedSections] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const availableTypes = useMemo(() => Array.from(new Set(logs.map(log => log.type))), [logs]);
    const availableSections = useMemo(() => Array.from(new Set(logs.map(log => log.section))), [logs]);

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => {
                const logDate = new Date(log.timestamp);
                const fromDate = dateRange.from;
                const toDate = dateRange.to;

                if (fromDate && logDate < fromDate) return false;
                if (toDate && logDate > toDate) return false;

                if (selectedTypes.length > 0 && !selectedTypes.includes(log.type)) return false;
                if (selectedSections.length > 0 && !selectedSections.includes(log.section)) return false;
                
                if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase()) && !log.user.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                
                return true;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [logs, searchQuery, dateRange, selectedTypes, selectedSections]);
    
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
        setCurrentPage(1);
    };
    
    const handleSectionToggle = (section: string) => {
        setSelectedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
        setCurrentPage(1);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    if (isError) {
        return <div className="text-destructive">Error loading history. Please try again.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-1 sticky top-16">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListFilter className="h-5 w-5" /> Filter History</CardTitle>
                        <CardDescription>Refine the action logs shown in the table.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search actions..." className="pl-8" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} />
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
                                        onSelect={(range) => { setDateRange(range || {}); setCurrentPage(1); }}
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
                             <Label>Page / Section</Label>
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

            <div className="lg:col-span-3">
                 <Card>
                    <CardHeader>
                        <CardTitle>Action History</CardTitle>
                        <CardDescription>A log of all administrative actions taken.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Page</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedLogs.length > 0 ? paginatedLogs.map(log => (
                                    <TableRow key={log._id}>
                                        <TableCell className="font-medium">{log.user}</TableCell>
                                        <TableCell className="max-w-sm truncate">{log.action}</TableCell>
                                        <TableCell>
                                             <Badge variant="outline">{log.section}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={typeColors[log.type] || 'secondary'}>{log.type}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground text-xs">{format(new Date(log.timestamp), 'PPpp')}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No actions match your filters.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="flex items-center justify-between border-t p-4">
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>{paginatedLogs.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedLogs.length}</strong> of <strong>{filteredLogs.length}</strong> logs
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HistoryPage;
