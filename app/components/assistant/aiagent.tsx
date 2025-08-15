import { useEffect, useState }  from "react";

const aiSuggestions = [ 
    "Remember to take reqular breaks to stay productive.",
    "Try to focus on one task at a time for better results.",
    "Set realistic goals to avoid burnout.",
    "Dont't forget to hydrate and stretch during work sessions.",
    "Review your completed tasks to see your progress."
];

export default function AIAgent() {
    const [suggestion, setSuggestion] = useState("");

    useEffect(() => {
        const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
        setSuggestion(randomSuggestion);
    }, []);

    return (
        <div className="bg-[var(--app-card-bg] backdrop-blur-md rounded-xl shadow-lg border-[var(--app-card-border)] p-4">
            <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-2">
                AI Assistant
            </h3>
            <p className="text-[var(--app-foreground-muted)]">{suggestion}</p>
        </div>
    );
}