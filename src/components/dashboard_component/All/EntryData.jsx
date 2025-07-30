"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/AlertDialog";
import { useAuth } from "@/context/AuthContext";
import { SearchX } from "lucide-react";

const EntryData = ({ data, view = "table", user_id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [entries, setEntries] = useState([]);
  const [isSuccess, setIsSuccess] = useState(null);
  const [isError, setIsError] = useState(null);

  const itemsPerPage = view === "table" ? 10 : view === "list" ? 4 : 6;

  useEffect(() => {
    setEntries(data);
  }, [data]);

  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = entries.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allVisibleIds = visibleData.map((item) => item._id);
    const allSelected = allVisibleIds.every((id) => selected.includes(id));
    setSelected((prev) =>
      allSelected
        ? prev.filter((id) => !allVisibleIds.includes(id))
        : [...new Set([...prev, ...allVisibleIds])]
    );
  };

  const deleteEntries = async (ids) => {
    if (!ids || ids.length === 0 || !user_id) {
      setIsError("No item IDs or user ID provided.");
      return;
    }
    try {
      const response = await fetch(`/api/user/entry`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_ids: ids, user_id }),
      });
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Failed to delete entries:", errorResponse);
        setIsError("An error occurred. Please try again.");
        return;
      }
      setEntries((prev) => prev.filter((entry) => !ids.includes(entry._id)));
      setSelected([]);
      setIsSuccess("Entries deleted successfully.");
      setTimeout(() => setIsSuccess(null), 3000);
    } catch (error) {
      console.error("Error deleting entries:", error);
      setIsError("An error occurred. Please try again.");
    }
  };

  if (data.length === 0 || visibleData.length === 0)
    return (
      <div className="p-6 border-b-2 flex justify-center items-center">
        <div className="flex flex-col items-center text-center gap-4">
          <SearchX size={48} className="text-muted-foreground" />
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Feeling a Bit Empty?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Start by adding your entries — they’ll show up here right away.
            </p>
          </div>
        </div>
      </div>
    );

  const renderDeleteWarning = (ids) => (
    <AlertDialog>
      <AlertDialogTrigger>
        <span className="text-red-500 cursor-pointer hover:underline">
          Delete
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Deleting this entry will remove
            it permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteEntries(ids)}>
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const filterDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const renderViewContent = (item) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-xs text-gray-500">{filterDate(item.createdAt)}</p>
      <p className="text-sm">{item.description}</p>
    </div>
  );

  const handlePagination = (direction) => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  return (
    <div className="p-4 space-y-6 border-b-2">
      {/* Notifications */}
      {isSuccess && (
        <div className="alert alert-success rounded">{isSuccess}</div>
      )}
      {isError && <div className="alert alert-danger rounded">{isError}</div>}

      {/* Bulk Delete Button */}
      {selected.length > 1 && (
        <AlertDialog>
          <AlertDialogTrigger>
            <span
              className={"rounded-2xl bg-red-800 text-white px-3 py-2 text-xs"}
              
            >
              Delete Selected
            </span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Deleting these entries will remove
                them permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteEntries(selected)}>
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Render View */}
      {view === "table" ? (
        <div className="overflow-x-auto border-2 rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={visibleData.every((item) =>
                      selected.includes(item._id)
                    )}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Entry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(item._id)}
                      onCheckedChange={() => toggleSelect(item._id)}
                    />
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{filterDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <p className="truncate">
                      {item.description?.length > 50
                        ? item.description.slice(0, 50) + "...."
                        : item.description}
                    </p>
                  </TableCell>
                  <TableCell>{item?.entry_date}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="default"
                      size="small"
                      className={"rounded-lg"}
                    >
                      Edit
                    </Button>
                    {renderDeleteWarning([item._id])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : view === "list" ? (
        <div className="space-y-4">
          {visibleData.map((item) => (
            <div
              key={item._id}
              className="flex justify-between p-4 border rounded-md"
            >
              {renderViewContent(item)}
              <div className="space-x-2">
                <Button variant="outline" size="base" className={"rounded-2xl"}>
                  Edit
                </Button>
                {renderDeleteWarning([item._id])}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleData.map((item) => (
            <Card key={item._id} className="p-4">
              {renderViewContent(item)}
              <div className="space-x-2 mt-4">
                <Button variant="outline" size="base" className={"rounded-2xl"}>
                  Edit
                </Button>
                {renderDeleteWarning([item._id])}
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            variant="default"
            onClick={() => handlePagination("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            variant="default"
            onClick={() => handlePagination("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default EntryData;
