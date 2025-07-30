"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpNarrowWide,
  Grid3x2,
  LayoutGrid,
  List,
  ListFilter,
} from "lucide-react";

import Dashboard_Header from "@/components/dashboard_component/Dashboard_Header";
import Draft from "@/components/dashboard_component/Draft";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

const Page = () => {
  const [isList, setIsList] = useState(true);
  const [filter, setFilter] = useState("A-Z");

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Dashboard_Header />

      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <ListFilter size={18} />
              <span className="text-sm font-medium">Filter</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => setFilter("A-Z")}>
              <ArrowDownAZ size={16} className="mr-2" /> A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Z-A")}>
              <ArrowUpAZ size={16} className="mr-2" /> Z-A
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("By Date")}>
              <ArrowUpNarrowWide size={16} className="mr-2" /> By Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Display Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
              <LayoutGrid size={18} />
              <span className="text-sm font-medium">Display</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setIsList(true)}>
              <List size={16} className="mr-2" /> List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsList(false)}>
              <Grid3x2 size={16} className="mr-2" /> Grid
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Draft List Component */}
      <main className="flex-1 px-4 py-4">
        <Draft list={isList} filter={filter} />
      </main>
    </div>
  );
};

export default Page;
