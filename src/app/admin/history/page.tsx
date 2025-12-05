
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useGetActionLogsQuery } from '@/services/api';
import { format } from 'date-fns';
import { Loader2, Search, CalendarIcon, ListFilter, ChevronLeft, ChevronRight, ChevronDown, History as HistoryIcon, Users, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';


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

const HistoryPageSkeleton = () => (
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
        </div>
        <div className="space-y-4">
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                <TableHead><Skeleton className="h-5 w-48" /></TableHead>
                                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                                <TableHead className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="flex items-center justify-between border-t p-4">
                    <Skeleton className="h-5 w-40" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </Card>
        </div>
    </div>
);


const FilterControls = ({
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    availableTypes,
    selectedTypes,
    handleTypeToggle,
    availableSections,
    selectedSections,
    handleSectionToggle,
    setCurrentPage,
}) => (
     <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><ListFilter className="h-5 w-5" /> Filter History</CardTitle>
            <CardDescription>Refine the action logs shown in the table.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search actions or users..." className="pl-8 w-full" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} />
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto justify-between">
                            Type {selectedTypes.length > 0 && `(${selectedTypes.length})`} <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Action Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableTypes.map(type => (
                            <DropdownMenuCheckboxItem key={type} checked={selectedTypes.includes(type)} onCheckedChange={() => handleTypeToggle(type)}>
                                {type}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto justify-between">
                            Page {selectedSections.length > 0 && `(${selectedSections.length})`} <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Page / Section</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableSections.map(section => (
                            <DropdownMenuCheckboxItem key={section} checked={selectedSections.includes(section)} onCheckedChange={() => handleSectionToggle(section)}>
                                {section}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardContent>
    </Card>
);

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
    
    const stats = useMemo(() => {
        const today = new Date().toDateString();
        return {
            total: logs.length,
            today: logs.filter(log => new Date(log.timestamp).toDateString() === today).length,
            users: new Set(logs.map(log => log.user)).size,
        };
    }, [logs]);

    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
        setCurrentPage(1);
    };
    
    const handleSectionToggle = (section: string) => {
        setSelectedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
        setCurrentPage(1);
    };

    if (isLoading) {
        return <HistoryPageSkeleton />;
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading History</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the action logs. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }
    
    const filterProps = {
        searchQuery, setSearchQuery, dateRange, setDateRange,
        availableTypes, selectedTypes, handleTypeToggle,
        availableSections, selectedSections, handleSectionToggle,
        setCurrentPage
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                        <HistoryIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Total actions recorded</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Logs Today</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.today}</div>
                         <p className="text-xs text-muted-foreground">Actions recorded today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                        <p className="text-xs text-muted-foreground">Distinct users who performed actions</p>
                    </CardContent>
                </Card>
            </div>
            
            <FilterControls {...filterProps} />

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
                                <TableHead className="hidden sm:table-cell">Page</TableHead>
                                <TableHead className="hidden md:table-cell">Type</TableHead>
                                <TableHead className="text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedLogs.length > 0 ? paginatedLogs.map(log => (
                                <TableRow key={log._id}>
                                    <TableCell className="font-medium">{log.user}</TableCell>
                                    <TableCell className="max-w-xs truncate">{log.action}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="outline">{log.section}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
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
    );
};

export default HistoryPage;
