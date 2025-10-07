import React, { useState, useEffect } from "react";
import "../QuizPage/QuizPage.css";

export default function QuizText() {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        setDisplayText("");

        const timer3 = setTimeout(() => {
            setDisplayText("サンプルテキスト");
        }, 4000);

        return () => {
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div>
            <h2 style={{ color: "black", fontSize: "10vh" }}>{displayText}</h2>
                
        </div>
    );
}

