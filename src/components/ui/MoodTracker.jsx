'use client';

import {useState} from 'react';
import {
    Angry,
    Annoyed,
    Frown,
    Meh,
    Smile,
    MessageCircleMore, X,
} from 'lucide-react';

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

    const handlePrimaryMoodSelect = (mood) => {
        setSelectedMood(mood);
        setSelectedSecondary(null);
    };

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
                        <button
                            className={"p-4 mx-auto w-full bg-emerald-700 text-white rounded-lg mt-2 cursor-pointer hover:bg-green-800 transition-colors duration-300"}>Set
                            Today's Mood</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MoodTracker;
