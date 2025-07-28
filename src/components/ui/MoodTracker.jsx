'use client';

import {useState} from 'react';
import {
    Angry,
    Annoyed,
    Frown,
    Meh,
    Smile,
    MessageCircleMore, X, Check,
} from 'lucide-react';
import {useAuth} from "@/context/AuthContext";
import {Alert} from "@/components/Alert";

const moods = [
    {
        id: 1,
        name: 'Positive',
        color: 'green',
        icon: <Smile size={28}/>,
        dialog: "That's great to hear! What's making you feel good today?",
        mood_items: [
            {id: 1, label: 'Happy'},
            {id: 2, label: 'Excited'},
            {id: 3, label: 'Relaxed'},
            {id: 4, label: 'Grateful'},
        ],
    },
    {
        id: 2,
        name: 'Neutral',
        color: 'blue',
        icon: <Meh size={28}/>,
        dialog: "Feeling neutral is okay. Want to share what’s on your mind?",
        mood_items: [
            {id: 1, label: 'Neutral'},
            {id: 2, label: 'Bored'},
            {id: 3, label: 'Tired'},
        ],
    },
    {
        id: 3,
        name: 'Negative',
        color: 'orange',
        icon: <Frown size={28}/>,
        dialog: "Oh no, sorry to hear that. Want to talk about what happened?",
        mood_items: [
            {id: 1, label: 'Sad'},
            {id: 2, label: 'Lonely'},
            {id: 3, label: 'Anxious'},
        ],
    },
    {
        id: 4,
        name: 'Anger-Related',
        color: 'red',
        icon: <Angry size={28}/>,
        dialog: "It's okay to feel angry. What triggered this emotion?",
        mood_items: [
            {id: 1, label: 'Angry'},
            {id: 2, label: 'Annoyed'},
            {id: 3, label: 'Frustrated'},
        ],
    },
    {
        id: 5,
        name: 'Overwhelmed',
        color: 'violet',
        icon: <Annoyed size={28}/>,
        dialog: "Sounds like a lot is going on. Want to share what’s overwhelming?",
        mood_items: [
            {id: 1, label: 'Stressed'},
            {id: 2, label: 'Confused'},
            {id: 3, label: 'Panicked'},
        ],
    },
];

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedSecondary, setSelectedSecondary] = useState(null);
    const [moodComment, setMoodComment] = useState("");
    const [globalError, setGlobalError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);
    const { user } = useAuth();

    const handlePrimaryMoodSelect = (mood) => {
        setSelectedMood(mood);
        setSelectedSecondary(null);
    };

    const handleSecondaryMoodSelect = (mood) => {
        setSelectedSecondary(mood);
    }

    const handleMoodSubmit = async  () => {
        setGlobalError(null);
        setIsSubmitting(null);
        if(!selectedMood && !selectedSecondary ){
            return setGlobalError("Please select a mood first");
        }
        if(selectedMood && selectedSecondary && moodComment.length > 300){
            return setGlobalError("Comment length should be less than 300 characters");
        }

        setIsSubmitting(true);
        try {
            await fetch('/api/user/mood', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mood: selectedMood.name,
                    secondary_mood: selectedSecondary,
                    mood_comment: moodComment,
                    userId: user._id,
                })
            }).then((res)=> {
                if(!res.ok) {
                    setGlobalError("Something went wrong");
                }else {
                    setGlobalError(null);
                    setSelectedMood(null);
                    setSelectedSecondary(null);
                    setMoodComment("");
                    setIsSuccess("Mood set successfully");
                }
            });
        }catch (e) {
            setGlobalError("Something went wrong");
            console.error(e);
            setIsSuccess(null);
        }finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Track Your Mood
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mb-4">
                {moods.map((mood) => (
                    <button
                        key={mood.id}
                        onClick={() => handlePrimaryMoodSelect(mood)}
                        className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition shadow-sm cursor-pointer hover:scale-105`}
                    >
                        {mood.icon}
                        <span className="font-semibold">{mood.name}</span>
                    </button>
                ))}
            </div>
            {globalError && (
                <Alert variant={"destructive"} className={"text-nowrap my-3"}><X /> {globalError}</Alert>
            )}

            {isSuccess && (
                <Alert variant={"success"} className={"text-nowrap my-3 flex items-center gap-2"}><Check /> {isSuccess}</Alert>
            )}

            {selectedMood && (
                <div
                    className="relative w-full max-w-md shadow-lg bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#212121] rounded-xl p-6 transition">
                    <div
                        className={"absolute top-2 right-2 bg-accent-foreground text-accent rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-300 cursor-pointer"}
                        onClick={() => setSelectedMood(null)}>
                        <X size={20}/>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircleMore className="text-gray-500 dark:text-gray-300"/>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
                            {selectedMood.name} Mood Selected
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {selectedMood.dialog}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {selectedMood.mood_items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedSecondary(item.label)}
                                className={`py-2 px-3 rounded-md text-sm font-medium transition
                bg-${selectedMood.color}-50 hover:bg-${selectedMood.color}-100 
                dark:bg-${selectedMood.color}-800 dark:hover:bg-${selectedMood.color}-700
                text-${selectedMood.color}-700 dark:text-${selectedMood.color}-200
                ${selectedSecondary === item.label ? 'ring-2 ring-offset-2 ring-' + selectedMood.color + '-400' : ''}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {selectedSecondary && (
                        <div className="mt-6 text-gray-700 dark:text-gray-200">
                            <strong>Secondary Mood:</strong> {selectedSecondary}
                            <br/>
                            <span className="text-sm italic text-gray-500 dark:text-gray-400">
                <textarea cols={10} rows={3} minLength={0} maxLength={300} value={moodComment}
                          onChange={(e) => setMoodComment(e.target.value)}
                          className="w-full resize-none mt-2 border-none outline-none bg-transparent"
                          placeholder="Add a comment..."/>
                      <p className={`${moodComment.length === 300 && 'line-through'}`}> {moodComment.length === 300 && "Limit reached - "}{moodComment.length}/300 Character </p>
              </span>
                        </div>
                    )}

                    {selectedMood && selectedSecondary && (
                        <button onClick={handleMoodSubmit}
                            className={"p-4 mx-auto w-full bg-emerald-700 text-white rounded-lg mt-2 cursor-pointer hover:bg-green-800 transition-colors duration-300"}>Set
                            Today's Mood</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MoodTracker;
