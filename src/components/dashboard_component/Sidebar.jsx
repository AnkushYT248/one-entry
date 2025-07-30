"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import TextProfile from "@/components/profile/TextProfile";
import {
  BookDashed,
  Box,
  ChevronDown,
  Clock,
  Edit,
  FileText,
  Flame,
  Globe,
  GlobeLock,
  Notebook,
  PenLine,
  Plus,
  Rss,
  Search,
  Settings,
  Sparkles,
  SquareSlash,
  Star,
  Target,
  Trash,
  User,
  X,
  Zap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import Image from "next/image";
import { Separator } from "@/components/Separator";
import LinkItems from "@/components/LinkItems";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";

const navLinks = [
  { title: "Daily Momentum", href: "/dashboard", icon: <Zap size={17} /> },
  {
    title: "Drafts",
    href: "/dashboard/drafts",
    icon: <BookDashed size={17} />,
  },
  // { title: "Starred", href: "/dashboard/starred", icon: <Star size={17} /> },
  { title: "Archive", href: "/dashboard/archive", icon: <Box size={17} /> },
  { title: "Trash", href: "/dashboard/trash", icon: <Trash size={17} /> },
];

const productivity = [
  {
    title: "All Journal",
    href: "/dashboard/productivity/journal/all",
    icon: <Globe size={17} />,
  },
  // {
  //   title: "Journal Prompts",
  //   href: "/dashboard/productivity/prompts",
  //   icon: <Sparkles size={17} />,
  // },
  {
    title: "Writing Streak",
    href: "/dashboard/productivity/streak",
    icon: <Flame size={17} />,
  },
  {
    title: "Goals",
    href: "/dashboard/productivity/goals",
    icon: <Target size={17} />,
  },
];

const blogging = [
  { title: "My Blog", href: "/dashboard/blog", icon: <FileText size={17} /> },
  {
    title: "New Post",
    href: "/dashboard/blog/new",
    icon: <PenLine size={17} />,
  },
];

const Sidebar = ({ user, isOpen, toggleSidebar, isLoading }) => {
  const pathname = usePathname();

  const profileAvatarLoading = (
    <div className={"flex items-center gap-2"}>
      <Skeleton className={"h-6 w-6 rounded-full"} />
      <Skeleton className={"h-6 w-16 rounded-md"} />
    </div>
  );
  return (
    <aside
      className={`fixed z-50 lg:relative top-0 left-0 h-screen w-[80vw] p-4 md:w-[40vw] lg:w-[30vw] xl:w-[20vw] bg-[#fcfcfc] dark:bg-[#101012] shadow-2xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300`}
    >
      <div className={"flex items-center justify-between gap-10"}>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none gap-2 flex items-center cursor-pointer select-none">
            {isLoading ? (
              profileAvatarLoading
            ) : !user?.profile?.avatar ? (
              <TextProfile
                content={user?.username?.charAt(0).toUpperCase() || "?"}
                size="xs"
                bg="bg-emerald-600"
                radius="rounded"
              />
            ) : (
              <>
                <div className="relative w-6 h-6 rounded-full border-2 border-accent-foreground">
                  <Image
                    src={user?.profile?.avatar}
                    alt={user?.username}
                    fill
                    sizes="100"
                    className="rounded-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">
                    {user?.username
                      ? user.username.toUpperCase()
                      : "Anonymous User"}
                  </h2>
                </div>
              </>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={20} className="ml-2 w-56">
            <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <span className="flex items-center gap-2"><User size={28} strokeWidth={1.5} /> Profile</span>
                <DropdownMenuShortcut className={"hidden md:block"}>Ctrl+⇧+P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <span className="flex items-center gap-2"><Settings size={28} strokeWidth={1.5} /> Settings</span>
                <DropdownMenuShortcut className={"hidden md:block"}>Ctrl+⇧+S</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger><span className="flex items-center gap-2"><Box size={18} strokeWidth={1.5} /> Productivity</span></DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className={"flex items-center gap-3"}><Notebook size={28} strokeWidth={1.5} /> My Journals</DropdownMenuItem>
                  <DropdownMenuItem className={"flex items-center gap-3"}><Rss size={28} strokeWidth={1.5} /> My Blogs</DropdownMenuItem>
                  <DropdownMenuItem className={"flex items-center gap-3"}> <Flame size={28} strokeWidth={1.5} />Streak Of The Month</DropdownMenuItem>
                  <DropdownMenuItem className={"flex items-center gap-3"}><PenLine size={28} strokeWidth={1.5} /> Write A Blog</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem>
                <span className="flex items-center gap-2"><SquareSlash size={28} strokeWidth={1.5} /> Keyboard Shortcuts</span>
                <DropdownMenuShortcut className={"hidden md:block"}>Ctrl+⇧+K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className={"flex items-center gap-3"}>
          <Tooltip>
            <TooltipTrigger>
              <Search size={17} />
            </TooltipTrigger>
            <TooltipContent>Search Workspace</TooltipContent>
          </Tooltip>
          <div
            className={
              "p-2 bg-stone-100 shadow-2xl  dark:bg-black rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:text-white transition-all duration-300 select-none"
            }
          >
            <Edit size={17} />
          </div>

          <button className="lg:hidden flex-1" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
      </div>
      <button
        className={
          "flex items-center gap-4 my-3 bg-emerald-700 shadow-2xl rounded px-3 py-2 w-full cursor-pointer text-sm text-white transition-all duration-300 hover:bg-emerald-800"
        }
      >
        <Plus size={18} /> Create New
      </button>
      <div className={"flex flex-col gap-3"}>
        <Separator />

        {navLinks.map((link, index) => {
          return (
            <LinkItems
              key={index}
              title={link.title}
              href={link.href}
              className={`${
                link.href === pathname && "bg-accent-foreground text-accent"
              } rounded-lg`}
              icon={link.icon}
              onClick={toggleSidebar}
            />
          );
        })}
      </div>
      <Separator />

      <Accordion defaultValue={"item-1"} collapsible={true}>
        <AccordionItem value={"item-1"}>
          <AccordionTrigger>Productivity Menu</AccordionTrigger>
          <AccordionContent className={"p-2 space-y-2"}>
            {productivity.map((link, index) => {
              return (
                <LinkItems
                  key={index}
                  title={link.title}
                  href={link.href}
                  className={`${
                    link.href === pathname && "bg-accent-foreground text-accent"
                  } rounded-lg`}
                  icon={link.icon}
                  onClick={toggleSidebar}
                />
              );
            })}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={"item-2"}>
          <AccordionTrigger>Blogging </AccordionTrigger>
          <AccordionContent className={"p-2 space-y-2"}>
            {blogging.map((link, index) => {
              return (
                <LinkItems
                  key={index}
                  title={link.title}
                  href={link.href}
                  className={`${
                    link.href === pathname && "bg-accent-foreground text-accent"
                  } rounded-lg`}
                  icon={link.icon}
                  onClick={toggleSidebar}
                />
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

export default Sidebar;
