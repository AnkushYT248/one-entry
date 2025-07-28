"use client";
import { LifeBuoy, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/AlertDialog";

const truncate = (str, maxLength = 100) => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

const Draft = ({ list = true, filter = "A-Z" }) => {
  const [draftItems, setDraftItems] = useState([]);

  useEffect(() => {
    const storedDrafts = JSON.parse(localStorage.getItem("draft_items") || "[]");
    setDraftItems(storedDrafts);
  }, []);

  // Filter and sort drafts based on the selected filter
  const getFilteredDrafts = () => {
    let sortedDrafts = [...draftItems];
    switch (filter) {
      case "A-Z":
        sortedDrafts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        sortedDrafts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "By Date":
        sortedDrafts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
        break;
      default:
        break;
    }
    return sortedDrafts;
  };

  const handleDelete = (index) => {
    const updatedDrafts = draftItems.filter((_, i) => i !== index);
    setDraftItems(updatedDrafts);
    localStorage.setItem("draft_items", JSON.stringify(updatedDrafts));
  };

  const handleEdit = (item) => {
    console.log("Edit Draft:", item);
    // You can add modal or navigate here
  };

  const filteredDrafts = getFilteredDrafts();

  if (!filteredDrafts || filteredDrafts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <LifeBuoy size={50} className="mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">No Drafts Found</h2>
          <p className="text-sm">Start creating and they’ll show up here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-4 py-6">
      <div
        className={`w-full ${
          list ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"
        }`}
      >
        {filteredDrafts.map((item, index) => (
          <div
            key={index}
            className="w-full p-5 border rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                {truncate(item.title, 40)}
              </h2>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3">
              {truncate(item.content, 120)}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5"
              >
                <Edit size={16} /> Edit
              </button>
             <AlertDialog>
               <AlertDialogTrigger>
                 <p className={"px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-1.5"}><Trash2 size={16} /> Delete</p>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                   <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete your
                     account and remove your data from our servers.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={() => handleDelete(index)}>Continue</AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Draft;