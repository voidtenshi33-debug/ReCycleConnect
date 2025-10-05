
"use client"

import { useState, useEffect } from 'react';

const searchSuggestions = [
    "Old laptop for sale",
    "Broken phone for parts",
    "HDMI cables",
    "Used gaming mouse",
    "Monitor stand",
    "iPhone charger",
];

export function TypewriterSearch() {
    const [text, setText] = useState('');
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentSuggestion = searchSuggestions[suggestionIndex];

        const type = () => {
            if (isDeleting) {
                if (charIndex > 0) {
                    setText(currentSuggestion.substring(0, charIndex - 1));
                    setCharIndex(charIndex - 1);
                } else {
                    setIsDeleting(false);
                    setSuggestionIndex((prevIndex) => (prevIndex + 1) % searchSuggestions.length);
                }
            } else {
                if (charIndex < currentSuggestion.length) {
                    setText(currentSuggestion.substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                } else {
                    // Pause at the end of the word
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            }
        };

        const typingSpeed = isDeleting ? 50 : 150;
        const timeout = setTimeout(type, typingSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, suggestionIndex]);

    return (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            {text}
            <span className="animate-ping">|</span>
        </div>
    );
}
