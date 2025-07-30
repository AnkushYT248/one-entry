'use client';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import Button from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/AlertDialog";
import { FileQuestion } from "lucide-react";

const MoodData = ({ data, view = "table", user_id }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState([]);
    const [moods, setMoods] = useState([]);
    const [isSuccess, setIsSuccess] = useState(null);
    const [isError, setIsError] = useState(null);

    const itemsPerPage = view === "table" ? 10 : view === "list" ? 4 : 6;

    // Update moods on data change
    useEffect(() => setMoods(data), [data]);

    const totalPages = Math.ceil(moods.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleData = moods.slice(startIndex, startIndex + itemsPerPage);

    // Toggle selection states
    const toggleSelect = (id) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
    };
    const toggleSelectAll = () => {
        const allIds = visibleData.map(mood => mood._id);
        const allSelected = allIds.every(id => selected.includes(id));
        setSelected(prev =>
            allSelected ? prev.filter(id => !allIds.includes(id)) : [...new Set([...prev, ...allIds])]
        );
    };

    // Delete moods (single or multiple)
    const deleteMoods = async (ids) => {
        if (!ids.length || !user_id) {
            setIsError("Moods or User ID not provided.");
            return;
        }
        try {
            const response = await fetch(`/api/user/mood`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_ids: ids, user_id }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                setIsError(errorResponse.error || "An error occurred.");
                return;
            }

            const result = await response.json();
            setMoods(prev => prev.filter(mood => !ids.includes(mood._id)));
            setSelected([]);
            setIsSuccess(result.message);
            setTimeout(() => setIsSuccess(null), 3000);
        } catch (error) {
            setIsError("An error occurred. Please try again.");
        }
    };

    const deleteSingleMood = (id) => deleteMoods([id]);

    const renderDeleteWarning = (ids) => (
        <AlertDialog>
            <AlertDialogTrigger>
                <span className="text-red-500 cursor-pointer hover:underline">Delete</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Deleting these moods will remove them permanently.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMoods(ids)}>Yes, Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    const formatDate = (date) =>
        new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

    // Unified table view

    if(data.length === 0 || visibleData.length === 0) return (
        <div className="p-4 space-y-6 flex justify-center items-center border-b-2">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <FileQuestion size={40} className="text-gray-500" />
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Feeling a Bit Empty?</h2>
            <p className="text-gray-600">Add your entries — they’ll appear here as soon as you do!</p>
          </div>
        </div>
      </div>
    )
    return (
        <div className="p-4 space-y-6">
            {isSuccess && <div className="alert alert-success">{isSuccess}</div>}
            {isError && <div className="alert alert-danger">{isError}</div>}

            {selected.length > 1 && (
                <Button variant="destructive" size={"small"} className={"rounded-lg"} onClick={() => deleteMoods(selected)}>
                    Delete Selected
                </Button>
            )}

            {view === "table" && (
                <div className="overflow-x-auto border-2 rounded-lg shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox
                                        checked={visibleData.every(mood => selected.includes(mood._id))}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Mood</TableHead>
                                <TableHead>Secondary Mood</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleData.map(mood => (
                                <TableRow key={mood._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected.includes(mood._id)}
                                            onCheckedChange={() => toggleSelect(mood._id)}
                                        />
                                    </TableCell>
                                    <TableCell>{mood.mood}</TableCell>
                                    <TableCell>{mood.secondary_mood}</TableCell>
                                    <TableCell>{mood.mood_comment}</TableCell>
                                    <TableCell>{formatDate(mood.createdAt)}</TableCell>
                                    <TableCell className={"flex gap-2 items-center"}>
                                        <Button variant="default" size="small" className={"rounded-lg"}>Edit</Button>
                                        {renderDeleteWarning([mood._id])}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <Button
                    variant="default"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="default"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default MoodData;