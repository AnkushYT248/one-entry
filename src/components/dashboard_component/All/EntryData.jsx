'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import Button from "@/components/ui/button";
import {useMediaQuery} from "react-responsive";

const EntryData = ({ data, list = false, table = true, grid = false }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-10">No entries available.</p>;
    }
     const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState([]);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleData = data.slice(startIndex, startIndex + itemsPerPage);

    const toggleSelectAll = () => {
        const allVisibleIds = visibleData.map((_, idx)=> startIndex + idx);
        const areAllSelected = allVisibleIds.every(id => selected.includes(id));

        if (areAllSelected) {
            setSelected(prev => prev.filter(id => !allVisibleIds.includes(id)));
        } else {
            setSelected(prev => [...new Set([...prev, ...allVisibleIds])]);
        }
    }

    const toggleSelect = (index) => {
        if (selected.includes(index)) {
            setSelected(prev => prev.filter(i => i !== index));
        } else {
            setSelected(prev => [...prev, index]);
        }
    };

    if (table) {
        return (
            <div className="p-4 space-y-4">
                {
                    selected.length > 1 &&
                    <Button variant={"destructive"} size={"small"} className={"rounded-lg mb-3"}>Delete All</Button>
                }
                <div className="w-full overflow-x-auto border-2 rounded-lg shadow-sm">
                    <Table className="min-w-[800px] w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={visibleData.every((_, idx) => selected.includes(startIndex + idx))}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="min-w-[150px]">Title</TableHead>
                                <TableHead className="min-w-[120px]">Entry Date</TableHead>
                                <TableHead className="min-w-[200px]">Description</TableHead>
                                <TableHead className="min-w-[150px]">Created At</TableHead>
                                <TableHead className="min-w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {visibleData.map((item, idx) => {
                                const realIndex = startIndex + idx;
                                return (
                                    <TableRow key={realIndex}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selected.includes(realIndex)}
                                                onCheckedChange={() => toggleSelect(realIndex)}
                                            />
                                        </TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.entry_date}</TableCell>
                                        <TableCell className="truncate max-w-[200px]">
                                            {item.description}
                                        </TableCell>
                                        <TableCell>{item.createdAt}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="small" className="mr-2 rounded-lg cursor-pointer">
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="small" className="mr-2 rounded-lg cursor-pointer">
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center pt-2">
                    <Button
                        variant="default"
                        size="base"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={"rounded-lg"}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
        </span>
                    <Button
                        variant="default"
                        size="base"
                        className={"rounded-lg"}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

        );
    }

    if (list) {
        return (
            <div className="p-4 flex flex-col gap-4">
                {data.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between border rounded-lg shadow-sm bg-white dark:bg-zinc-900">
                        <div className={"space-y-4"}>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.entry_date}</p>
                            <p className="mt-2">{item.description.length > 50 ? item.description.slice(0, 50) + "...." : item.description}</p>
                        </div>
                        <div className={`flex flex-row flex-wrap gap-2 items-center justify-end`}>
                            <Button variant="outline" size="small" className="rounded-lg cursor-pointer">
                                Edit
                            </Button>
                            <Button variant="destructive" size="small" className="rounded-lg cursor-pointer">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (grid) {
        return (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {data.map((item, idx) => (
                    <Card key={idx} className="p-4 flex flex-col gap-2 border rounded-lg shadow-sm bg-white dark:bg-zinc-900">
                        <div className={"space-y-4"}>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.entry_date}</p>
                            <p className="mt-2">{item.description.length > 50 ? item.description.slice(0, 50) + "...." : item.description}</p>
                        </div>
                        <div className={`flex flex-row flex-wrap gap-2 items-center justify-end`}>
                            <Button variant="outline" size="small" className="rounded-lg cursor-pointer">
                                Edit
                            </Button>
                            <Button variant="destructive" size="small" className="rounded-lg cursor-pointer">
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return null;
};

export default EntryData;
