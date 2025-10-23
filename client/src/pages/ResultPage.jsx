import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/ResultPage.css";

export default function ResultPage() {
    // ダミーの結果データ。TrueFalse.jsxのロジックとは直接関係なく、問題ごとの結果を想定しています。
    const questionResults = ["T", "F", "T", "T", "F"];
    const navigate = useNavigate(); // Initialize useNavigate

    const handleGoHome = () => {
        navigate("/"); // Navigate to the home page
    };

    return (
        <div className="ResultPage">
            <div className="header-container">
                <h2>おつかれええええ</h2>
            </div>
            <div className="results-centering-container">
                <div className="results-container">
                    {questionResults.map((result, index) => (
                        <div key={index} className="result-item-container">
                            <p className="question-number">第{index + 1}問</p>
                            <div className={`result-item ${result === 'T' ? 'true' : 'false'}`}>
                                {result === 'T' ? '○' : '×'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button className="home-button" onClick={handleGoHome}>
                Home Pageに戻る
            </button>
        </div>
    );
}