
import React, { useState, useEffect } from "react";
import "../QuizPage/QuizPage.css";

export default function AreYouReady() {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        // 最初に "Are you ready?" を表示
        setDisplayText("Are you ready?");

        // 2秒後に "Start!" を表示
        const timer1 = setTimeout(() => {
            setDisplayText("Start!");
        }, 2000);

        // 4秒後に何も表示しない
        const timer2 = setTimeout(() => {
            setDisplayText("");
        }, 4000);

        // クリーンアップ関数でタイマーをクリア
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div>
            <h1 style={{ color: "black", fontSize: "20vh", textAlign: "center" }}>{displayText}</h1>
                
        </div>
    );
}

