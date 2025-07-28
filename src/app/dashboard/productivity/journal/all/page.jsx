'use client';
import Dashboard_Header from "@/components/dashboard_component/Dashboard_Header";
import {List, SlidersHorizontal, Table} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/dropdown-menu";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthContext";
import EntryData from "@/components/dashboard_component/All/EntryData";

const Page = () => {
    const [isList, setIsList] = useState(false);
    const [isGrid, setIsGrid] = useState(false);
    const [isTable, setIsTable] = useState(true);
    const [filter, setFilter] = useState("A-Z");
    const [search, setSearch] = useState("");
    const { user, isLoading } = useAuth();
    const [entries, setEntries] = useState([]);
    const [mood_data, setMoodData] = useState([]);

    // Fetch user data on mount or whenever user changes
    useEffect(() => {
        setEntries(user?.entries_data || []);
        setMoodData(user?.moods_data || []);
    }, [user]);

    const handleFilterChange = (filter) => {
        setFilter(filter);
    };

    const handleSearchChange = (searchTerm) => {
        setSearch(searchTerm.toLowerCase());
    };

    // Filter and sort entries
    const getFilteredEntries = () => {
        let sortedEntries = [...entries];

        if (filter === "A-Z") {
            sortedEntries.sort((a, b) => a.title.localeCompare(b.title));
        } else if (filter === "Z-A") {
            sortedEntries.sort((a, b) => b.title.localeCompare(a.title));
        } else if (filter === "date") {
            sortedEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        // Filter by search term
        return sortedEntries.filter((entry) =>
            entry.title.toLowerCase().includes(search)
        );
    };

    const filteredEntries = getFilteredEntries();

    const handleViewChange = (view) => {
        setIsList(view === "list");
        setIsGrid(view === "grid");
        setIsTable(view === "table");
    };

    return (
        <div className="relative h-screen overflow-y-auto overflow-x-hidden flex-1">
            <Dashboard_Header />
            <div className={"flex items-center gap-4 justify-between p-3 flex-wrap border-b-2"}>
                <p className={"text-gray-600 dark:text-gray-400 text-sm"}>All Journals & User Data</p>
                <div className={"flex items-center gap-2"}>
                    {/* Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className={"outline-none"}>
                            <p className={"flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent-foreground hover:text-accent cursor-pointer text-xs"}>
                                <SlidersHorizontal size={18} /> Sort By</p>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleFilterChange("A-Z")}>A-Z</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange("Z-A")}>Z-A</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange("date")}>By Date</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Filter Search</DropdownMenuLabel>
                                <input
                                    type={"text"}
                                    placeholder={"Search"}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className={"w-full px-3 py-1 rounded-lg border-2 border-emerald-600"}
                                />
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* View Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className={"outline-none"}>
                            <p className={"text-xs flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent-foreground hover:text-accent cursor-pointer"}>
                                <SlidersHorizontal size={18} /> Display</p>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Display data as</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewChange("list")}>
                                    <List /> List
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewChange("grid")}>
                                    <SlidersHorizontal /> Grid
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewChange("table")}>
                                    <Table /> Table
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Display Entries */}
            {isLoading ? (
                <div className={"flex items-center justify-center w-full h-screen"}>
                    <p className={"text-4xl font-bold -tracking-normal"}>Loading...</p>
                </div>
            ) : (
                <EntryData data={filteredEntries} list={isList} grid={isGrid} table={isTable} />
            )}
        </div>
    );
};

export default Page;