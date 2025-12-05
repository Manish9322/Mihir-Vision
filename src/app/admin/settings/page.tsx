
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Loader2, PlusCircle, Trash2, ChevronLeft, ChevronRight, MoreHorizontal, FilePenLine, Eye, Search, AlertTriangle } from 'lucide-react';
import { useGetSettingsDataQuery, useUpdateSettingsDataMutation, useGetCountriesQuery, useUpdateCountriesMutation, useGetStatesQuery, useUpdateStatesMutation, useGetCitiesQuery, useUpdateCitiesMutation, useGetDesignationsQuery, useUpdateDesignationsMutation, useAddActionLogMutation } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 5;

// #region Designations Manager
const DesignationForm = ({ designation, onSave }) => {
    const [name, setName] = useState(designation?.name || '');
    const [description, setDescription] = useState(designation?.description || '');
    const [isUnique, setIsUnique] = useState(designation?.isUnique || false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description, isUnique });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="designation-name">Designation Name</Label>
                <Input id="designation-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="designation-description">Description</Label>
                <Textarea id="designation-description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="is-unique" checked={isUnique} onCheckedChange={setIsUnique} />
                <Label htmlFor="is-unique">Enforce as unique (only one person can have this role)</Label>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save Designation</Button>
            </DialogFooter>
        </form>
    );
};

const DesignationsManager = () => {
    const { toast } = useToast();
    const { data: designations = [], isLoading, isError } = useGetDesignationsQuery();
    const [updateDesignations, { isLoading: isMutating }] = useUpdateDesignationsMutation();
    const [addActionLog] = useAddActionLogMutation();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleSave = async (data) => {
        let updatedItems;
        let action, type;

        if (editingIndex !== null) {
            updatedItems = designations.map((item, index) => index === editingIndex ? { ...item, ...data } : item);
            action = `updated designation "${data.name}"`;
            type = 'UPDATE';
        } else {
            updatedItems = [{ ...data, _id: `new_${Date.now()}` }, ...designations];
            action = `created designation "${data.name}"`;
            type = 'CREATE';
        }

        try {
            await updateDesignations(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'Settings',
                action,
                type,
            }).unwrap();
            toast({ title: `Designation ${editingIndex !== null ? 'Updated' : 'Added'}` });
            setIsFormOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Save Failed' });
        }
    };

    const handleDelete = async (index) => {
        const deletedItem = designations[index];
        const updatedItems = designations.filter((_, i) => i !== index);
        try {
            await updateDesignations(updatedItems).unwrap();
            await addActionLog({
                user: 'Admin User',
                section: 'Settings',
                action: `deleted designation "${deletedItem.name}"`,
                type: 'DELETE',
            }).unwrap();
            toast({ variant: 'destructive', title: 'Designation Deleted' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Deletion Failed' });
        }
    };
    
    if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (isError) return (
        <Card className="flex flex-col items-center justify-center p-4 text-center border-destructive">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <CardTitle className="text-md text-destructive">Error</CardTitle>
            <CardDescription className="mt-1 text-xs">Failed to load designations.</CardDescription>
        </Card>
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Designations</CardTitle>
                    <CardDescription>Define roles for your team members.</CardDescription>
                </div>
                <Button onClick={() => { setSelectedItem(null); setEditingIndex(null); setIsFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Add Designation</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Is Unique</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {designations.map((item, index) => (
                            <TableRow key={item._id || index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.isUnique ? 'Yes' : 'No'}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setEditingIndex(index); setIsFormOpen(true); }}><FilePenLine className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(index)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Designation</DialogTitle></DialogHeader><DesignationForm designation={selectedItem} onSave={handleSave} /></DialogContent></Dialog>
        </Card>
    );
};
// #endregion

// #region Countries Manager
const CountryForm = ({ country, onSave }) => {
    const [name, setName] = useState(country?.name || '');
    const [description, setDescription] = useState(country?.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="country-name">Country Name</Label>
                <Input id="country-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="country-description">Description</Label>
                <Textarea id="country-description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save Country</Button>
            </DialogFooter>
        </form>
    );
};

const ViewCountryDialog = ({ country, open, onOpenChange }) => {
    if (!country) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{country.name}</DialogTitle>
                    <DialogDescription>Viewing country details.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <p className="text-sm text-muted-foreground">{country.description || "No description provided."}</p>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const CountriesManager = () => {
    const { toast } = useToast();
    const { data: countries = [], isLoading, isError } = useGetCountriesQuery();
    const [updateCountries, { isLoading: isMutating }] = useUpdateCountriesMutation();
    const [addActionLog] = useAddActionLogMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    const filteredItems = useMemo(() => {
        return (countries || []).filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [countries, searchQuery]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSave = async (data) => {
        let updatedItems;
        let action, type;

        if (editingIndex !== null) {
            updatedItems = countries.map((item, index) => index === editingIndex ? { ...item, ...data } : item);
            action = `updated country "${data.name}"`;
            type = 'UPDATE';
        } else {
            updatedItems = [{ ...data, _id: `new_${Date.now()}` }, ...countries];
            action = `created country "${data.name}"`;
            type = 'CREATE';
        }

        try {
            await updateCountries(updatedItems).unwrap();
            await addActionLog({ user: 'Admin User', section: 'Settings', action, type }).unwrap();
            toast({ title: `Country ${editingIndex !== null ? 'Updated' : 'Added'}` });
            setIsFormOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Save Failed' });
        }
    };

    const handleDelete = async (index) => {
        const fullIndex = countries.findIndex(c => c.name === paginatedItems[index].name);
        const deletedItem = countries[fullIndex];
        const updatedItems = countries.filter((_, i) => i !== fullIndex);
        try {
            await updateCountries(updatedItems).unwrap();
            await addActionLog({ user: 'Admin User', section: 'Settings', action: `deleted country "${deletedItem.name}"`, type: 'DELETE' }).unwrap();
            toast({ variant: 'destructive', title: 'Country Deleted' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Deletion Failed' });
        }
    };

    if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (isError) return (
        <Card className="flex flex-col items-center justify-center p-4 text-center border-destructive">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <CardTitle className="text-md text-destructive">Error</CardTitle>
            <CardDescription className="mt-1 text-xs">Failed to load countries.</CardDescription>
        </Card>
    );


    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Manage Countries</CardTitle>
                    <CardDescription>Add, edit, or delete countries available for user profiles.</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search countries..." className="pl-8" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                    </div>
                    <Button onClick={() => { setSelectedItem(null); setEditingIndex(null); setIsFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Add Country</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Country Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedItems.length > 0 ? paginatedItems.map((item, index) => (
                            <TableRow key={item._id || index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="hidden md:table-cell max-w-sm truncate">{item.description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsViewOpen(true); }}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setEditingIndex(countries.findIndex(c => c.name === item.name)); setIsFormOpen(true); }}><FilePenLine className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(index)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={3} className="h-24 text-center">No countries found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">Showing <strong>{paginatedItems.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedItems.length}</strong> of <strong>{filteredItems.length}</strong> countries</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Country</DialogTitle></DialogHeader><CountryForm country={selectedItem} onSave={handleSave} /></DialogContent></Dialog>
            <ViewCountryDialog country={selectedItem} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </Card>
    );
};
// #endregion

// #region States Manager
const StateForm = ({ state, countries, onSave }) => {
    const { register, handleSubmit, control } = useForm({ defaultValues: state || { name: '', description: '', country: '' } });
    const onSubmit = (data) => onSave(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="state-name">State Name</Label>
                <Input id="state-name" {...register('name', { required: true })} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="state-description">Description</Label>
                <Textarea id="state-description" {...register('description')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="state-country">Country</Label>
                <Select onValueChange={(value) => control.setValue('country', value)} defaultValue={control._defaultValues.country}>
                    <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                    <SelectContent>
                        {countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save State</Button>
            </DialogFooter>
        </form>
    );
};

const ViewStateDialog = ({ state, open, onOpenChange }) => {
    if (!state) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{state.name}</DialogTitle>
                    <DialogDescription>Viewing state/province details.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <p><strong>Country:</strong> <span className="text-muted-foreground">{state.country}</span></p>
                    <p className="text-sm text-muted-foreground">{state.description || "No description provided."}</p>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const StatesManager = () => {
    const { toast } = useToast();
    const { data: states = [], isLoading: isStatesLoading, isError: isStatesError } = useGetStatesQuery();
    const { data: countries = [], isLoading: isCountriesLoading } = useGetCountriesQuery();
    const [updateStates, { isLoading: isMutating }] = useUpdateStatesMutation();
    const [addActionLog] = useAddActionLogMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    const filteredItems = useMemo(() => {
        return (states || []).filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [states, searchQuery]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSave = async (data) => {
        let updatedItems;
        let action, type;
        if (editingIndex !== null) {
            updatedItems = states.map((item, index) => index === editingIndex ? { ...item, ...data } : item);
            action = `updated state "${data.name}"`;
            type = 'UPDATE';
        } else {
            updatedItems = [{ ...data, _id: `new_${Date.now()}` }, ...states];
            action = `created state "${data.name}"`;
            type = 'CREATE';
        }

        try {
            await updateStates(updatedItems).unwrap();
            await addActionLog({ user: 'Admin User', section: 'Settings', action, type }).unwrap();
            toast({ title: `State ${editingIndex !== null ? 'Updated' : 'Added'}` });
            setIsFormOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Save Failed' });
        }
    };

    const handleDelete = async (index) => {
        const fullIndex = states.findIndex(s => s.name === paginatedItems[index].name && s.country === paginatedItems[index].country);
        const deletedItem = states[fullIndex];
        const updatedItems = states.filter((_, i) => i !== fullIndex);
        try {
            await updateStates(updatedItems).unwrap();
            await addActionLog({ user: 'Admin User', section: 'Settings', action: `deleted state "${deletedItem.name}"`, type: 'DELETE' }).unwrap();
            toast({ variant: 'destructive', title: 'State Deleted' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Deletion Failed' });
        }
    };

    if (isStatesLoading || isCountriesLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (isStatesError) return (
        <Card className="flex flex-col items-center justify-center p-4 text-center border-destructive">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <CardTitle className="text-md text-destructive">Error</CardTitle>
            <CardDescription className="mt-1 text-xs">Failed to load states.</CardDescription>
        </Card>
    );

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Manage States / Provinces</CardTitle>
                    <CardDescription>Add, edit, or delete states and assign them to countries.</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search states..." className="pl-8" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                    </div>
                    <Button onClick={() => { setSelectedItem(null); setEditingIndex(null); setIsFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Add State</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>State Name</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedItems.length > 0 ? paginatedItems.map((item, index) => (
                            <TableRow key={item._id || index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.country}</TableCell>
                                <TableCell className="hidden md:table-cell max-w-sm truncate">{item.description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsViewOpen(true); }}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setEditingIndex(states.findIndex(s => s.name === item.name && s.country === item.country)); setIsFormOpen(true); }}><FilePenLine className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(index)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">No states found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
                 <div className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">Showing <strong>{paginatedItems.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedItems.length}</strong> of <strong>{filteredItems.length}</strong> states</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} State</DialogTitle></DialogHeader><StateForm state={selectedItem} countries={countries} onSave={handleSave} /></DialogContent></Dialog>
            <ViewStateDialog state={selectedItem} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </Card>
    );
};
// #endregion

// #region Cities Manager
const CityForm = ({ city, states, onSave }) => {
    const { register, handleSubmit, control } = useForm({ defaultValues: city || { name: '', description: '', state: '' } });
    const onSubmit = (data) => onSave(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="city-name">City Name</Label>
                <Input id="city-name" {...register('name', { required: true })} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="city-description">Description</Label>
                <Textarea id="city-description" {...register('description')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="city-state">State / Province</Label>
                <Select onValueChange={(value) => control.setValue('state', value)} defaultValue={control._defaultValues.state}>
                    <SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger>
                    <SelectContent>
                        {states.map(s => <SelectItem key={s.name} value={s.name}>{s.name} ({s.country})</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save City</Button>
            </DialogFooter>
        </form>
    );
};

const ViewCityDialog = ({ city, open, onOpenChange }) => {
    if (!city) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{city.name}</DialogTitle>
                    <DialogDescription>Viewing city details.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                     <p><strong>State / Province:</strong> <span className="text-muted-foreground">{city.state}</span></p>
                    <p className="text-sm text-muted-foreground">{city.description || "No description provided."}</p>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const CitiesManager = () => {
    const { toast } = useToast();
    const { data: cities = [], isLoading: isCitiesLoading, isError: isCitiesError } = useGetCitiesQuery();
    const { data: states = [], isLoading: isStatesLoading } = useGetStatesQuery();
    const [updateCities, { isLoading: isMutating }] = useUpdateCitiesMutation();
    const [addActionLog] = useAddActionLogMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    const filteredItems = useMemo(() => {
        return (cities || []).filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.state.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [cities, searchQuery]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSave = async (data) => {
        let updatedItems;
        let action, type;
        if (editingIndex !== null) {
            updatedItems = cities.map((item, index) => index === editingIndex ? { ...item, ...data } : item);
            action = `updated city "${data.name}"`;
            type = 'UPDATE';
        } else {
            updatedItems = [{ ...data, _id: `new_${Date.now()}` }, ...cities];
            action = `created city "${data.name}"`;
            type = 'CREATE';
        }

        try {
            await updateCities(updatedItems).unwrap();
            await addActionLog({ user: 'Admin User', section: 'Settings', action, type }).unwrap();
            toast({ title: `City ${editingIndex !== null ? 'Updated' : 'Added'}` });
            setIsFormOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Save Failed' });
        }
    };

    const handleDelete = async (index) => {
        const fullIndex = cities.findIndex(c => c.name === paginatedItems[index].name && c.state === paginatedItems[index].state);
        const deletedItem = cities[fullIndex];
        const updatedItems = cities.filter((_, i) => i !== fullIndex);
        try {
            await updateCities(updatedItems).unwrap();
            await addActionLog({ user: 'Admin User', section: 'Settings', action: `deleted city "${deletedItem.name}"`, type: 'DELETE' }).unwrap();
            toast({ variant: 'destructive', title: 'City Deleted' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Deletion Failed' });
        }
    };
    
    if (isCitiesLoading || isStatesLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (isCitiesError) return (
        <Card className="flex flex-col items-center justify-center p-4 text-center border-destructive">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <CardTitle className="text-md text-destructive">Error</CardTitle>
            <CardDescription className="mt-1 text-xs">Failed to load cities.</CardDescription>
        </Card>
    );

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Manage Cities</CardTitle>
                    <CardDescription>Add, edit, or delete cities and assign them to states.</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search cities..." className="pl-8" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                    </div>
                    <Button onClick={() => { setSelectedItem(null); setEditingIndex(null); setIsFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Add City</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>City Name</TableHead>
                            <TableHead>State / Province</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedItems.length > 0 ? paginatedItems.map((item, index) => (
                            <TableRow key={item._id || index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.state}</TableCell>
                                <TableCell className="hidden md:table-cell max-w-sm truncate">{item.description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsViewOpen(true); }}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setEditingIndex(cities.findIndex(c => c.name === item.name && c.state === item.state)); setIsFormOpen(true); }}><FilePenLine className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(index)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">No cities found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">Showing <strong>{paginatedItems.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(currentPage - 1) * ITEMS_PER_PAGE + paginatedItems.length}</strong> of <strong>{filteredItems.length}</strong> cities</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} City</DialogTitle></DialogHeader><CityForm city={selectedItem} states={states} onSave={handleSave} /></DialogContent></Dialog>
            <ViewCityDialog city={selectedItem} open={isViewOpen} onOpenChange={setIsViewOpen} />
        </Card>
    );
};
// #endregion

const SettingsPageSkeleton = () => (
    <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile-options">Profile Options</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="profile-options">
            <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-72 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                            <TableHead><Skeleton className="h-5 w-48" /></TableHead>
                                            <TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...Array(3)].map((_, j) => (
                                            <TableRow key={j}>
                                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-56" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex items-center justify-between border-t p-4">
                                    <Skeleton className="h-5 w-40" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="team">
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                    <TableHead><Skeleton className="h-5 w-48" /></TableHead>
                                    <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                                    <TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="notifications">
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-36" />
                            <Skeleton className="h-4 w-80" />
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
);


export default function SettingsPage() {
    const { toast } = useToast();
    const { data: settingsData, isLoading: isSettingsLoading, isError: isSettingsError } = useGetSettingsDataQuery();
    const [updateSettings, { isLoading: isMutationLoading }] = useUpdateSettingsDataMutation();
    const [addActionLog] = useAddActionLogMutation();
    
    const { register, handleSubmit, reset } = useForm({ defaultValues: settingsData });

    // Using a more robust check for loading state across multiple queries
    const { isLoading: isCountriesLoading, isError: isCountriesError } = useGetCountriesQuery();
    const { isLoading: isStatesLoading, isError: isStatesError } = useGetStatesQuery();
    const { isLoading: isCitiesLoading, isError: isCitiesError } = useGetCitiesQuery();
    const { isLoading: isDesignationsLoading, isError: isDesignationsError } = useGetDesignationsQuery();
    
    const isQueryLoading = isSettingsLoading || isCountriesLoading || isStatesLoading || isCitiesLoading || isDesignationsLoading;
    const isError = isSettingsError || isCountriesError || isStatesError || isCitiesError || isDesignationsError;

    useState(() => {
        if (settingsData) {
            reset(settingsData);
        }
    });

    const onSubmit = async (data) => {
        try {
            await updateSettings(data).unwrap();
            await addActionLog({
                user: 'Admin User',
                action: 'updated general settings',
                section: 'Settings',
                type: 'UPDATE',
            }).unwrap();
            toast({
                title: "Settings Saved",
                description: "Your general settings have been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "There was an error saving the settings.",
            });
        }
    };
    
    const handleNotificationsSubmit = async (e) => {
        e.preventDefault();
        try {
            await addActionLog({
                user: 'Admin User',
                action: 'updated notification settings',
                section: 'Settings',
                type: 'UPDATE',
            }).unwrap();
            toast({
                title: "Settings Saved",
                description: `Notification settings have been updated.`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "There was an error saving notification settings.",
            });
        }
    };

    if (isQueryLoading) {
        return <SettingsPageSkeleton />;
    }
    
    if (isError) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">Error Loading Settings</CardTitle>
                <CardDescription className="mt-2">
                    There was a problem fetching the settings data. Please try refreshing the page.
                </CardDescription>
            </Card>
        );
    }

    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="profile-options">Profile Options</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Manage your site's general configuration.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input id="siteName" {...register("siteName")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteTagline">Tagline</Label>
                                <Input id="siteTagline" {...register("siteTagline")} />
                            </div>
                            <Button type="submit" disabled={isMutationLoading}>
                                {isMutationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save General
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="profile-options">
                <div className="space-y-8">
                   <CountriesManager />
                   <StatesManager />
                   <CitiesManager />
                </div>
            </TabsContent>
            <TabsContent value="team">
                <DesignationsManager />
            </TabsContent>
            <TabsContent value="notifications">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Configure how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive an email for every new contact form submission.</p>
                                </div>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get push notifications on your devices. (Coming soon)</p>
                                </div>
                                <Switch id="push-notifications" disabled />
                            </div>
                            <Button type="submit">Save Notifications</Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

    

    
