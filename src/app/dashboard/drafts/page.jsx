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

const page = () => {
  const [isList, setIsList] = useState(true);
  const [filter, setFilter] = useState("A-Z"); // Default filter is A-Z

  return (
    <div className="relative h-screen overflow-y-auto overflow-x-hidden flex-1">
      <Dashboard_Header />

      <div className="flex items-center justify-between p-3 border-b-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="cursor-pointer p-2 hover:text-accent hover:bg-accent-foreground rounded-lg transition-colors duration-300">
              <p className="text-sm font-medium flex items-center gap-2">
                <ListFilter size={18} /> Filter
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("A-Z")}>
              <ArrowDownAZ /> A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Z-A")}>
              <ArrowUpAZ /> Z-A
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("By Date")}>
              <ArrowUpNarrowWide /> By Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="cursor-pointer p-2 hover:text-accent hover:bg-accent-foreground rounded-lg transition-colors duration-300">
              <p className="text-sm font-medium flex items-center gap-2">
                <LayoutGrid size={18} /> Display
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsList(true)}>
              <List /> List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsList(false)}>
              <Grid3x2 /> Grid
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Draft list={isList} filter={filter} />
    </div>
  );
};

export default page;