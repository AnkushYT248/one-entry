"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Edit,
  Send,
  Save,
  LibraryBig,
  XCircle,
  Check,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import Calendar from "@/components/Calender";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/Alert";
import { HashLoader } from "react-spinners";

const JournalInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  isTextArea = false,
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-semibold text-primary">
      {label}
    </label>
    <div className="relative flex gap-2 items-start bg-muted rounded-xl px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-primary transition">
      <div className="pt-1">
        {type === "text" ? (
          <Edit className="text-muted-foreground w-5 h-5" />
        ) : (
          <LibraryBig className="text-muted-foreground w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        {isTextArea ? (
          <textarea
            id={id}
            rows={5}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-transparent text-accent-foreground outline-none placeholder:text-muted-foreground resize-none"
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
            className="w-full bg-transparent text-accent-foreground outline-none placeholder:text-muted-foreground"
            maxLength={100}
            minLength={5}
          />
        )}
        {error && (
          <Alert
            variant="destructive"
            className="mt-1 flex items-center gap-1 text-sm"
          >
            <XCircle className="h-4 w-4" />
            {error}
          </Alert>
        )}
      </div>
    </div>
  </div>
);

const AutoSave = ({ title, content }) => {
  useEffect(() => {
    if (!title.trim() && !content.trim()) {
      localStorage.removeItem("draft_entry");
      return;
    }
    localStorage.setItem("draft_entry", JSON.stringify({ title, content }));
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

  const handleSubmit = useCallback(
    async (e) => {
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
        setTimeout(() => {
          refetchData();
        }, 3000);
      } catch (error) {
        setFeedback({ error: error.message, success: null });
      } finally {
        setIsSubmitting(false);
      }
    },
    [entryTitle, entryContent, selectedDate, user]
  );

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-3xl shadow-xl border border-border bg-card backdrop-blur-md transition-colors">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <CalendarDays
                size={28}
                className="text-primary cursor-pointer hover:text-primary/80 transition"
                onClick={() => setCalendarOpen(!calendarOpen)}
              />
            </TooltipTrigger>
            <TooltipContent>Select Date</TooltipContent>
          </Tooltip>
          {calendarOpen && (
            <div className="absolute z-55 bottom-10 mt-2">
              <Calendar onDateChange={handleDateChange} />
            </div>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            {isToday ? "Today's Journal" : selectedDate.toDateString()}
          </h2>
          <p className="text-sm text-muted-foreground">
            Reflect on your day, thoughts, and emotions.
          </p>
        </div>
      </header>

      <div className="mt-6 text-center space-y-1">
        <p className="text-lg font-semibold text-accent-foreground/60">
          Write. Reflect. Grow.
        </p>
        <p className="text-sm text-muted-accent">
          Let your words shape your path.
        </p>
      </div>

      {feedback.error && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" /> {feedback.error}
        </Alert>
      )}
      {feedback.success && (
        <Alert variant="default" className="mt-4">
          <Check className="h-4 w-4" /> {feedback.success}
        </Alert>
      )}

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <JournalInput
          id="journal-title"
          label="Entry Title"
          value={entryTitle}
          onChange={(e) => setEntryTitle(e.target.value)}
          placeholder="E.g., A lesson learned..."
          error={feedback.error?.includes("Title") ? feedback.error : null}
        />
        <JournalInput
          id="journal-content"
          label="Your Story"
          value={entryContent}
          onChange={(e) => setEntryContent(e.target.value)}
          placeholder="Share your thoughts..."
          error={feedback.error?.includes("Content") ? feedback.error : null}
          isTextArea
        />
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleDraftSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-md"
          >
            <Save size={18} /> Save Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition font-medium shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <HashLoader size={18} color="#fff" />
            ) : (
              <>
                <Send size={18} /> Submit
              </>
            )}
          </button>
        </div>
      </form>

      <AutoSave title={entryTitle} content={entryContent} />
    </div>
  );
};

export default Journey;
