"use client";

import { useState } from "react";
import {
  Angry,
  Annoyed,
  Frown,
  Meh,
  Smile,
  MessageCircleMore,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/Alert";

const moods = [
  {
    id: 1,
    name: "Positive",
    color: "green",
    icon: <Smile size={28} />,
    dialog: "That's great to hear! What's making you feel good today?",
    mood_items: [
      { id: 1, label: "Happy" },
      { id: 2, label: "Excited" },
      { id: 3, label: "Relaxed" },
      { id: 4, label: "Grateful" },
    ],
  },
  {
    id: 2,
    name: "Neutral",
    color: "blue",
    icon: <Meh size={28} />,
    dialog: "Feeling neutral is okay. Want to share what’s on your mind?",
    mood_items: [
      { id: 1, label: "Neutral" },
      { id: 2, label: "Bored" },
      { id: 3, label: "Tired" },
    ],
  },
  {
    id: 3,
    name: "Negative",
    color: "orange",
    icon: <Frown size={28} />,
    dialog: "Oh no, sorry to hear that. Want to talk about what happened?",
    mood_items: [
      { id: 1, label: "Sad" },
      { id: 2, label: "Lonely" },
      { id: 3, label: "Anxious" },
    ],
  },
  {
    id: 4,
    name: "Anger-Related",
    color: "red",
    icon: <Angry size={28} />,
    dialog: "It's okay to feel angry. What triggered this emotion?",
    mood_items: [
      { id: 1, label: "Angry" },
      { id: 2, label: "Annoyed" },
      { id: 3, label: "Frustrated" },
    ],
  },
  {
    id: 5,
    name: "Overwhelmed",
    color: "violet",
    icon: <Annoyed size={28} />,
    dialog: "Sounds like a lot is going on. Want to share what’s overwhelming?",
    mood_items: [
      { id: 1, label: "Stressed" },
      { id: 2, label: "Confused" },
      { id: 3, label: "Panicked" },
    ],
  },
];

const MoodTracker = ({ finalString = null }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [moodComment, setMoodComment] = useState("");
  const [globalError, setGlobalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const { user, refetchData } = useAuth();

  const handlePrimaryMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSelectedMoodId(mood.id);
    setSelectedSecondary(null);
  };

  const handleMoodSubmit = async () => {
    setGlobalError(null);
    setIsSubmitting(null);
    const cleanedComment = moodComment.replace(/\s+/g, " ").trim();
    if (!selectedMood && !selectedSecondary) {
      return setGlobalError("Please select a mood first");
    }
    if (selectedMood && selectedSecondary && moodComment.length > 300) {
      return setGlobalError(
        "Comment length should be less than 300 characters"
      );
    }
    if (cleanedComment === "") {
      return setGlobalError("Comment cannot be empty or only spaces");
    }
    
    if (cleanedComment.length > 300) {
      return setGlobalError("Comment must be less than 300 characters");
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/user/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: selectedMood.name,
          secondary_mood: selectedSecondary,
          mood_comment: cleanedComment,
          userId: user._id,
        }),
      }).then((res) => {
        if (!res.ok) {
          setGlobalError("Something went wrong");
        } else {
          setGlobalError(null);
          setSelectedMood(null);
          setSelectedSecondary(null);
          setMoodComment("");
          setIsSuccess("Mood set successfully");
          setTimeout(() => {
            refetchData();
          }, 4000);
        }
      });
    } catch (e) {
      setGlobalError("Something went wrong");
      console.error(e);
      setIsSuccess(null);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setGlobalError(null);
        setIsSuccess(null);
      }, 3000);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full px-4 py-8 bg-cover bg-no-repeat rounded-2xl my-4"
      style={{ backgroundImage: "url('/images/nature_menta.webp')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0 rounded-2xl"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-white">
        {finalString && <p className="text-emerald-300 mb-2">{finalString}</p>}

        <h2 className="text-3xl font-bold mb-6 text-white">Track Your Mood</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {moods.map((mood) => (
            <button
            key={mood.id}
            onClick={() => handlePrimaryMoodSelect(mood)}
            className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:scale-105 transition-all shadow-sm backdrop-blur
              ${selectedMoodId === mood.id ? "bg-emerald-700 text-white" : "bg-white/20 dark:bg-black/80"}`}
          >
            {mood.icon}
            <span className="font-semibold text-sm">{mood.name}</span>
          </button>
          ))}
        </div>

        {globalError && (
          <Alert variant="destructive" className="text-nowrap my-3">
            <X /> {globalError}
          </Alert>
        )}

        {isSuccess && (
          <Alert
            variant="success"
            className="text-nowrap my-3 flex items-center gap-2"
          >
            <Check /> {isSuccess}
          </Alert>
        )}

        {selectedMood && (
          <div className="relative w-full max-w-md p-6 border rounded-xl shadow-lg bg-white dark:bg-[#121212] border-gray-200 dark:border-[#212121] transition">
            <div
              className="absolute top-2 right-2 p-1 rounded-full text-accent-foreground bg-accent hover:bg-accent hover:text-accent-foreground cursor-pointer transition"
              onClick={() => setSelectedMood(null)}
            >
              <X size={20} />
            </div>

            <div className="relative flex items-center gap-2 mb-4">
              <MessageCircleMore className="text-gray-500 dark:text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
                {selectedMood.name} Mood Selected
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedMood.dialog}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {selectedMood.mood_items.map((item) => {
                const isSelected = selectedSecondary === item.label;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSecondary(item.label)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                      isSelected ? "ring-2 ring-offset-2 ring-emerald-400" : ""
                    } bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-emerald-700 dark:text-emerald-200`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {selectedSecondary && (
              <div className="mt-6 text-gray-700 dark:text-gray-200">
                <strong>Secondary Mood:</strong> {selectedSecondary}
                <br />
                <span className="text-sm italic text-gray-500 dark:text-gray-400">
                  <textarea
                    cols={10}
                    rows={3}
                    maxLength={300}
                    value={moodComment}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const cleaned = raw.replace(/\s+g/, " ")
                      .replace(/^\s+$/g, "");

                      if(cleaned.length <= 300) {
                        setMoodComment(raw);
                      }
                    }}
                    className="w-full resize-none mt-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent p-2 outline-none"
                    placeholder="Add a comment..."
                  />
                  <p
                    className={
                      moodComment.replace(/\s+/g, " ").trim().length === 300
                        ? "line-through text-red-400"
                        : ""
                    }
                  >
                    { moodComment.replace(/\s+/g, " ").trim().length == 300 && "Limit reached - "}
                    {moodComment.replace(/\s+/g, " ").trim().length}/300 Characters
                  </p>
                </span>
              </div>
            )}

            {selectedMood && selectedSecondary && (
              <button
                onClick={handleMoodSubmit}
                className="w-full p-4 mt-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Set Today's Mood"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
