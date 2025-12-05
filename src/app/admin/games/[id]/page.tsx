
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useGetMatchByIdQuery, useGetSportByIdQuery, useUpdateMatchMutation } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, PlusCircle, Trash2, SlidersHorizontal, Users, Video, List, Clock } from 'lucide-react';
import { format, formatDuration, intervalToDuration } from 'date-fns';

// Helper to format time from seconds
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration, { format: ['minutes', 'seconds'], zero: true, delimiter: ':' }).padStart(5, '0');
};

const PlayerManager = ({ match, onUpdate, isMutating }) => {
    const [newPlayerId, setNewPlayerId] = useState('');

    const handleAddPlayer = () => {
        if (newPlayerId && !match.players.includes(newPlayerId)) {
            const updatedPlayers = [...match.players, newPlayerId];
            onUpdate({ players: updatedPlayers });
            setNewPlayerId('');
        }
    };

    const handleDeletePlayer = (playerToDelete) => {
        const updatedPlayers = match.players.filter(p => p !== playerToDelete);
        onUpdate({ players: updatedPlayers });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Player Roster</CardTitle>
                <CardDescription>Define player IDs for this match.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input value={newPlayerId} onChange={(e) => setNewPlayerId(e.target.value)} placeholder="Enter new player ID" />
                    <Button onClick={handleAddPlayer} disabled={isMutating}>Add Player</Button>
                </div>
                <div className="space-y-2">
                    {match.players.map(player => (
                        <div key={player} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <span className="font-mono">{player}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeletePlayer(player)} disabled={isMutating}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const SliceManager = ({ session, onUpdate, players, isMutating, videoRef }) => {
    const [isSliceFormOpen, setIsSliceFormOpen] = useState(false);
    const [activePlayers, setActivePlayers] = useState([]);

    const handleCreateSlice = () => {
        const currentTime = videoRef.current?.currentTime || 0;
        const lastSlice = session.slices[session.slices.length - 1];
        
        const newSlice = {
            id: `slice_${Date.now()}`,
            startTime: lastSlice ? lastSlice.endTime : 0,
            endTime: currentTime,
            activePlayers: lastSlice ? lastSlice.activePlayers : []
        };
        
        const updatedSlices = [...session.slices, newSlice];
        onUpdate({ slices: updatedSlices });
    };

    const handleUpdateSlicePlayers = (sliceId, newPlayers) => {
        const updatedSlices = session.slices.map(slice => 
            slice.id === sliceId ? { ...slice, activePlayers: newPlayers } : slice
        );
        onUpdate({ slices: updatedSlices });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><SlidersHorizontal /> Player Slices</CardTitle>
                <CardDescription>Track which players are on the field over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleCreateSlice} className="mb-4">Create Slice at Current Time</Button>
                <div className="space-y-2">
                    {session.slices?.map(slice => (
                        <div key={slice.id} className="p-3 border rounded-md">
                            <p className="font-semibold">Slice: {formatTime(slice.startTime)} - {formatTime(slice.endTime)}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {players.map(p => (
                                     <Button 
                                        key={p}
                                        variant={slice.activePlayers.includes(p) ? 'default' : 'outline'}
                                        size="sm"
                                        className="font-mono"
                                        onClick={() => {
                                            const newPlayers = slice.activePlayers.includes(p)
                                                ? slice.activePlayers.filter(ap => ap !== p)
                                                : [...slice.activePlayers, p];
                                            handleUpdateSlicePlayers(slice.id, newPlayers);
                                        }}
                                     >
                                        {p}
                                     </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const EventManager = ({ session, sport, onUpdate, isMutating, videoRef }) => {
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [selectedEventType, setSelectedEventType] = useState('');
    
    const handleAddEvent = () => {
        if (!selectedEventType) return;
        
        const newEvent = {
            id: `event_${Date.now()}`,
            timestamp: videoRef.current?.currentTime || 0,
            type: selectedEventType,
            details: 'New Event', // Default detail
        };

        const updatedEvents = [...session.events, newEvent];
        onUpdate({ events: updatedEvents });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><List /> Event Log</CardTitle>
                <CardDescription>Log important actions and events in this session.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Select onValueChange={setSelectedEventType} value={selectedEventType}>
                        <SelectTrigger><SelectValue placeholder="Select Event Type" /></SelectTrigger>
                        <SelectContent>
                            {sport?.eventTypes?.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddEvent} disabled={!selectedEventType || isMutating}>Add Event</Button>
                </div>
                <Table>
                    <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Type</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {session.events?.map(event => (
                            <TableRow key={event.id}>
                                <TableCell className="font-mono">{formatTime(event.timestamp)}</TableCell>
                                <TableCell>{event.type}</TableCell>
                                <TableCell>{event.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};


const AnalysisPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id: matchId } = params;
    const videoRef = useRef(null);

    const { data: match, isLoading: isMatchLoading, isError: isMatchError } = useGetMatchByIdQuery(matchId);
    const { data: sport, isLoading: isSportLoading } = useGetSportByIdQuery(match?.sport, { skip: !match });
    const [updateMatch, { isLoading: isMutating }] = useUpdateMatchMutation();
    
    const [activeTab, setActiveTab] = useState('session-0');

    useEffect(() => {
        if (match && match.sessions.length > 0) {
            setActiveTab(`session-${match.sessions[0].id}`);
        }
    }, [match]);

    const activeSession = useMemo(() => {
        if (!match) return null;
        const sessionId = activeTab.replace('session-', '');
        return match.sessions.find(s => s.id === sessionId);
    }, [match, activeTab]);

    const handleSessionUpdate = async (sessionUpdate) => {
        const updatedSessions = match.sessions.map(s => s.id === activeSession.id ? { ...s, ...sessionUpdate } : s);
        try {
            await updateMatch({ _id: matchId, sessions: updatedSessions }).unwrap();
            toast({ title: 'Session updated successfully!' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update Failed' });
        }
    };
    
    const handleMatchUpdate = async (matchUpdate) => {
        try {
            await updateMatch({ _id: matchId, ...matchUpdate }).unwrap();
            toast({ title: 'Match updated successfully!' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update Failed' });
        }
    };

    if (isMatchLoading || isSportLoading) return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>;
    if (isMatchError) return <div className="text-destructive">Error loading match data.</div>;

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.push('/admin/games')}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Matches</Button>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{match.name}</CardTitle>
                    <CardDescription>{sport?.name} - {format(new Date(match.matchDate), 'PPP')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {match.videoUrl ? (
                         <video ref={videoRef} src={match.videoUrl} controls className="w-full rounded-md aspect-video bg-black" />
                    ) : (
                        <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center">
                            <Video className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <PlayerManager match={match} onUpdate={handleMatchUpdate} isMutating={isMutating} />
                </div>
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                             {match.sessions.map((session, index) => (
                                <TabsTrigger key={session.id} value={`session-${session.id}`}>
                                    <Clock className="mr-2 h-4 w-4" /> {session.name || `Session ${index + 1}`}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {match.sessions.map(session => (
                            <TabsContent key={session.id} value={`session-${session.id}`} className="space-y-6">
                                <SliceManager session={session} onUpdate={handleSessionUpdate} players={match.players} isMutating={isMutating} videoRef={videoRef} />
                                <EventManager session={session} sport={sport} onUpdate={handleSessionUpdate} isMutating={isMutating} videoRef={videoRef} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
