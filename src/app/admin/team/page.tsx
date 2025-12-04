
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, MoreHorizontal, FilePenLine, Eye, Loader2, Search, Link as LinkIcon, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetTeamDataQuery, useUpdateTeamDataMutation, useGetDesignationsQuery } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SocialLink = {
    platform: 'LinkedIn' | 'Twitter' | 'Other';
    url: string;
};

type TeamMember = {
    _id?: string;
    name: string;
    designation: string;
    avatarUrl: string;
    bio: string;
    socialLinks?: SocialLink[];
    isVisible: boolean;
};

type Designation = {
    _id: string;
    name: string;
    isUnique: boolean;
};

const ITEMS_PER_PAGE = 5;

const TeamMemberForm = ({ member, onSave, designations, allMembers }: { member?: TeamMember | null, onSave: (member: Omit<TeamMember, '_id'>) => void, designations: Designation[], allMembers: TeamMember[] }) => {
    const [name, setName] = useState(member?.name || '');
    const [designation, setDesignation] = useState(member?.designation || '');
    const [bio, setBio] = useState(member?.bio || '');
    const [linkedinUrl, setLinkedinUrl] = useState(member?.socialLinks?.find(l => l.platform === 'LinkedIn')?.url || '');
    const [twitterUrl, setTwitterUrl] = useState(member?.socialLinks?.find(l => l.platform === 'Twitter')?.url || '');
    const { toast } = useToast();
    
    const availableDesignations = useMemo(() => {
        const assignedUniqueDesignations = allMembers
            .filter(m => m._id !== member?._id)
            .map(m => m.designation);
        
        return designations.filter(d => {
            if (d.isUnique) {
                return !assignedUniqueDesignations.includes(d.name);
            }
            return true;
        });
    }, [designations, allMembers, member]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const socialLinks: SocialLink[] = [];
        if (linkedinUrl) socialLinks.push({ platform: 'LinkedIn', url: linkedinUrl });
        if (twitterUrl) socialLinks.push({ platform: 'Twitter', url: twitterUrl });

        const newMember: Omit<TeamMember, '_id'> = {
            name,
            designation,
            bio,
            socialLinks,
            avatarUrl: member?.avatarUrl || 'https://placehold.co/200x200/white/black?text=Avatar', // Placeholder
            isVisible: member?.isVisible ?? true,
        };
        onSave(newMember);
        toast({
            title: `Team Member ${member ? 'Updated' : 'Added'}`,
            description: `"${name}" has been saved.`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                 <Select onValueChange={setDesignation} defaultValue={designation} required>
                    <SelectTrigger id="designation">
                        <SelectValue placeholder="Select a designation" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableDesignations.map(d => (
                            <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input id="twitter" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://twitter.com/..." />
                </div>
            </div>
             <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex items-center gap-4">
                    <Image src={member?.avatarUrl || 'https://placehold.co/200x200/white/black?text=Avatar'} alt={member?.name || 'New Member'} width={100} height={100} className="rounded-full object-cover bg-muted p-1" />
                    <Input type="file" className="max-w-xs" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Member</Button>
            </DialogFooter>
        </form>
    )
}

const ViewTeamMemberDialog = ({ member, open, onOpenChange }: { member: TeamMember | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    if (!member) return null;
    
    const SocialIcon = ({platform}: {platform: string}) => {
        switch(platform) {
            case 'LinkedIn': return <Linkedin className="h-4 w-4" />;
            case 'Twitter': return <Twitter className="h-4 w-4" />;
            default: return <LinkIcon className="h-4 w-4" />;
        }
    }

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{member.name}</DialogTitle>
                    <DialogDescription>{member.designation}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center p-4 bg-muted rounded-full my-4 w-32 h-32 mx-auto">
                    <Image src={member.avatarUrl} alt={member.name} width={128} height={128} className="object-cover rounded-full" />
                </div>
                <div className="space-y-4 text-sm">
                   <p className="text-center">{member.bio}</p>
                   <div className="flex justify-center items-center gap-4">
                       {member.socialLinks?.map(link => (
                           <Button key={link.platform} variant="outline" size="icon" asChild>
                               <a href={link.url} target="_blank" rel="noopener noreferrer">
                                   <SocialIcon platform={link.platform} />
                               </a>
                           </Button>
                       ))}
                   </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};


const TeamAdminPage = () => {
    const { toast } = useToast();
    const { data: teamMembers = [], isLoading: isQueryLoading, isError } = useGetTeamDataQuery();
    const { data: designations = [], isLoading: isDesignationsLoading } = useGetDesignationsQuery();
    const [updateTeam, { isLoading: isMutationLoading }] = useUpdateTeamDataMutation();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const filteredMembers = useMemo(() => {
        return teamMembers.filter(member =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.designation.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [teamMembers, searchQuery]);
    
    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const triggerUpdate = async (updatedItems: TeamMember[]) => {
        try {
            await updateTeam(updatedItems).unwrap();
            toast({
                title: 'Content Saved',
                description: 'Team list has been updated successfully.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'There was an error saving the team members.',
            });
        }
    };

    const handleAddClick = () => {
        setSelectedMember(null);
        setEditingIndex(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (member: TeamMember, index: number) => {
        const fullIndex = teamMembers.findIndex(m => m._id === member._id);
        setSelectedMember(member);
        setEditingIndex(fullIndex);
        setIsFormOpen(true);
    };

    const handleViewClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsViewOpen(true);
    };

    const handleDelete = (memberId: string) => {
        const newMembers = teamMembers.filter(m => m._id !== memberId);
        triggerUpdate(newMembers);
        toast({
            variant: "destructive",
            title: "Team Member Deleted",
            description: "The team member has been removed from the list.",
        });
    };
    
    const handleSave = (memberData: Omit<TeamMember, '_id'>) => {
        let newItems: TeamMember[];
        if (editingIndex !== null) {
            newItems = teamMembers.map((member, index) => index === editingIndex ? { ...teamMembers[editingIndex], ...memberData } : member);
        } else {
            const newMember = { ...memberData, _id: `new_${Date.now()}` } as TeamMember;
            newItems = [newMember, ...teamMembers];
        }
        triggerUpdate(newItems);
        setIsFormOpen(false);
    };
    
    const handleVisibilityChange = (memberId: string, isVisible: boolean) => {
        const newItems = teamMembers.map((item) =>
            item._id === memberId ? { ...item, isVisible } : item
        );
        triggerUpdate(newItems);
    }

    if (isQueryLoading || isDesignationsLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (isError) {
        return <div>Error loading data. Please try again.</div>;
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>Manage your company's team members.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or designation..."
                                className="pl-8 sm:w-[200px] lg:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                         <Button onClick={handleAddClick} disabled={isMutationLoading}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Card className="relative">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] hidden md:table-cell">Avatar</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead className="w-[100px]">Visible</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMembers.map((member, index) => (
                                    <TableRow key={member._id || index}>
                                        <TableCell className="hidden md:table-cell">
                                            <Image src={member.avatarUrl} alt={member.name} width={40} height={40} className="rounded-full object-cover bg-muted" />
                                        </TableCell>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.designation}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={member.isVisible}
                                                onCheckedChange={(checked) => handleVisibilityChange(member._id, checked)}
                                                disabled={isMutationLoading}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" disabled={isMutationLoading}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewClick(member)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(member, index)}>
                                                        <FilePenLine className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(member._id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {isMutationLoading && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>{paginatedMembers.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedMembers.length}</strong> of <strong>{filteredMembers.length}</strong> members
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
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                        <DialogDescription>
                            Fill out the details for the team member.
                        </DialogDescription>
                    </DialogHeader>
                    <TeamMemberForm member={selectedMember} onSave={handleSave} designations={designations} allMembers={teamMembers} />
                </DialogContent>
            </Dialog>

            <ViewTeamMemberDialog member={selectedMember} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </>
    );
}

export default TeamAdminPage;
