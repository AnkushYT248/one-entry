'use client';

import { useState, useEffect, useCallback } from "react";
import { CalendarDays, Edit, Send, Save, LibraryBig, XCircle, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import Calendar from "@/components/Calender";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/Alert";
import { HashLoader } from "react-spinners";

const JournalInput = ({ id, label, value, onChange, placeholder, error, type = "text", isTextArea = false }) => (
    <div>
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="mt-2 flex gap-2">
            {type === 'text' ? <Edit className="text-zinc-400 dark:text-zinc-500 mt-4" /> : <LibraryBig className="mt-2 text-zinc-400 dark:text-zinc-500" />}
            <div className="flex flex-col gap-2 w-full">
                {isTextArea ? (
                    <textarea
                        id={id}
                        rows={6}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[#111112] border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                        maxLength={500}
                        minLength={10}
                        spellCheck
                    />
                ) : (
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[#111112] border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        maxLength={100}
                        minLength={5}
                    />
                )}
                {error && <Alert variant="destructive" className="text-nowrap"><XCircle /> {error}</Alert>}
            </div>
        </div>
    </div>
);

const AutoSave = ({ title, content }) => {
    useEffect(() => {
        const autoSaveHandler = () => {
            if (!title.trim() && !content.trim()) {
                localStorage.removeItem("draft_entry");
                return;
            }
            localStorage.setItem("draft_entry", JSON.stringify({ title: title.trim(), content: content.trim() }));
        };
        autoSaveHandler();
    }, [title, content]);
    return null;
};

const Journey = () => {
    const [entryTitle, setEntryTitle] = useState("");
    const [entryContent, setEntryContent] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ success: null, error: null });
    const { user, refetchData } = useAuth();
    const date = new Date();

    const resetFields = () => {
        setEntryTitle("");
        setEntryContent("");
        localStorage.removeItem("draft_entry");
    };

    const validateFields = () => {
        if (!entryTitle.trim()) {
            setFeedback({ error: "Title is required", success: null });
            return false;
        }
        if (!entryContent.trim()) {
            setFeedback({ error: "Content is required", success: null });
            return false;
        }
        setFeedback({ error: null, success: null });
        return true;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setCalendarOpen(false);
    };

    const handleDraftSave = () => {
        if (!validateFields()) return;

        const draft_items = JSON.parse(localStorage.getItem("draft_items")) || [];
        draft_items.push({
            title: entryTitle.trim(),
            content: entryContent.trim(),
            date: selectedDate.toDateString(),
            createdAt: new Date().toISOString(),
        });
        localStorage.setItem("draft_items", JSON.stringify(draft_items));
        setFeedback({ success: "Draft saved successfully", error: null });
        resetFields();
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/user/entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: entryTitle.trim(),
                    description: entryContent.trim(),
                    date: selectedDate.toDateString(),
                    userId: user._id,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Submission failed");
            setFeedback({ success: "Entry saved successfully", error: null });
            resetFields();
            refetchData();
        } catch (error) {
            setFeedback({ error: error.message, success: null });
        } finally {
            setIsSubmitting(false);
        }
    }, [entryTitle, entryContent, selectedDate, user]);

    return (
        <div className="w-full mx-auto p-6 bg-white dark:bg-[#18181a] rounded-2xl shadow-lg border border-gray-200 dark:border-[#2a2a2c] transition-colors">
            <header className="flex gap-3 border-b pb-5">
                <div className="relative flex-1">
                    <Tooltip>
                        <TooltipTrigger>
                            <CalendarDays
                                size={32}
                                className="text-emerald-600 dark:text-emerald-400 cursor-pointer"
                                onClick={() => setCalendarOpen(!calendarOpen)}
                            />
                        </TooltipTrigger>
                        <TooltipContent><p>Select Date</p></TooltipContent>
                    </Tooltip>

                    {calendarOpen && (
                        <div className="absolute -bottom-10 left-0 w-screen max-w-[90vw] sm:max-w-sm flex z-40">
                            <Calendar onDateChange={handleDateChange} />
                        </div>
                    )}
                </div>
                <div className="flex-1 text-right">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {selectedDate.toDateString() === date.toDateString() ? "Today's Journal" : selectedDate.toDateString()}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reflect on your day, thoughts, and emotions.</p>
                </div>
            </header>

            <div className="mt-6 text-center">
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Write. Reflect. Grow.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Let your words shape your path.</p>
            </div>

            {feedback.error && <Alert variant="destructive"><XCircle /> {feedback.error}</Alert>}
            {feedback.success && <Alert variant="default"><Check /> {feedback.success}</Alert>}

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <JournalInput
                    id="journal-title"
                    label="Entry Title"
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                    placeholder="E.g., A lesson learned..."
                    error={feedback.error && feedback.error.includes("Title") && feedback.error}
                />
                <JournalInput
                    id="journal-content"
                    label="Your Story"
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    error={feedback.error && feedback.error.includes("Content") && feedback.error}
                    isTextArea
                />
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        onClick={handleDraftSave}
                    >
                        <Save size={18} /> Save Draft
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-700 text-white hover:bg-emerald-600 transition"
                    >
                        {isSubmitting ? <HashLoader size={18} /> : <><Send size={18} /> Submit</>}
                    </button>
                </div>
            </form>

            <AutoSave title={entryTitle} content={entryContent} />
        </div>
    );
};

export default Journey;