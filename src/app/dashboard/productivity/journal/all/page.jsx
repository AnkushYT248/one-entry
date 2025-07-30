"use client";

import { useState, useEffect } from "react";
import Dashboard_Header from "@/components/dashboard_component/Dashboard_Header";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  BookOpenText,
  Calendar,
  List,
  SlidersHorizontal,
  SmilePlus,
  Table,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import EntryData from "@/components/dashboard_component/All/EntryData";
import MoodData from "@/components/dashboard_component/All/MoodData";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const [view, setView] = useState("table"); // Unified state for the view type
  const [filter, setFilter] = useState("A-Z");
  const [search, setSearch] = useState("");

  const [entries, setEntries] = useState([]);
  const [moodData, setMoodData] = useState([]);

  const { user, isLoading } = useAuth();

  // Fetch user data on component mount or when the user changes
  useEffect(() => {
    if (user) {
      setEntries(user.entries_data || []);
      setMoodData(user.moods_data || []);
    }
  }, [user]);

  // Unified filter logic for entries
  const getFilteredEntries = () => {
    let sorted = [...entries];

    if (filter === "A-Z") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (filter === "Z-A")
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    else if (filter === "date")
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Search filtering
    return sorted.filter((entry) =>
      entry.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredEntries = getFilteredEntries();

  const handleViewChange = (viewType) => setView(viewType);
  const handleFilterChange = (filterType) => setFilter(filterType);

  return (
    <div className="relative h-screen overflow-y-auto overflow-x-hidden flex-1">
      <Dashboard_Header />

      {/* Header with Filters */}
      <div className="flex items-center gap-4 justify-between p-3 flex-wrap border-b-2">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          All Journals & User Data
        </p>
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent-foreground hover:text-accent cursor-pointer text-xs">
                <SlidersHorizontal size={18} /> Sort By
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleFilterChange("A-Z")} className={`${filter === "A-Z" && "bg-accent-foreground text-accent"}`}>
                <ArrowDownAZ /> A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("Z-A")}className={`${filter === "Z-A" && "bg-accent-foreground text-accent"}`}>
                <ArrowUpAZ /> Z-A
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("date")} className={`${filter === "date" && "bg-accent-foreground text-accent"}`}>
                <Calendar /> By Date
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1 rounded-lg border-2 border-emerald-600"
                  value={search}
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-xs flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent-foreground hover:text-accent cursor-pointer">
                <SlidersHorizontal size={18} /> Display
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleViewChange("list")} className={`${view === "list" && "bg-accent-foreground text-accent"}`}>
                  <List /> List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewChange("grid")} className={`${view === "grid" && "bg-accent-foreground text-accent"}`}>
                  <SlidersHorizontal /> Grid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewChange("table")} className={`${view === "table" && "bg-accent-foreground text-accent"}`}>
                  <Table /> Table
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Display Data */}
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <p className="text-4xl font-bold">Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 p-2">
            <BookOpenText className="text-primary" size={20} />
            <p className="text-lg font-bold tracking-tight">Entry Data</p>
          </div>
          <EntryData data={filteredEntries} view={view} user_id={user?._id} />

          <div className="flex items-center gap-2 p-2 mt-4">
            <SmilePlus className="text-primary" size={20} />
            <p className="text-lg font-bold tracking-tight">Mood Data</p>
          </div>
          <MoodData data={moodData} view={view} user_id={user?._id} />
        </>
      )}
    </div>
  );
};

export default Page;
