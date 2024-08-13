'use client'
import React, { useState, useEffect } from 'react';

const TypingTest: React.FC = () => {
    const [text] = useState('This is a sample paragraph for the typing test. This is a sample paragraph for the typing test. This is a sample paragraph for the typing test. This is a sample paragraph for the typing test.');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [typedWords, setTypedWords] = useState<{ word: string; correct: boolean }[]>([]);
    const [timer, setTimer] = useState(60); // 60-second timer
    const [activeIndex, setActiveIndex] = useState<number>(0);
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (startTime && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }

        if (timer === 0 && interval) {
            setEndTime(Date.now());
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [startTime, timer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (endTime) return;

        const value = e.target.value;
        setUserInput(value);

        if (startTime === null) {
            setStartTime(Date.now());
        }
        const words = value.trim().split(' ');
        const newTypedWords = words.map((word, index) => {
            const originalWord = text.split(' ')[index];
            return {
                word,
                correct: word === originalWord && typedWords[index]?.correct !== false, // Track if it was correct on the first try
            };
        });

        setTypedWords(newTypedWords);
        if (value === text) {
            setEndTime(Date.now());
        }
    };

    const getWordColor = (word: string, index: number, activeIndex: number) => {
        const userWords = userInput.trim().split(' ');

        if (index === userWords.length - 1) {
            return 'text-white'; // Active or user is typing the word
        }
        if (index < userWords.length) {
            return word === userWords[index] ? 'text-green-500' : 'text-red-500'; // Correct or error
        }
        return 'text-gray-500'; // Default
    };

    const calculateWPM = () => {
        if (startTime && endTime) {
            const words = text.split(' ').length;
            const minutes = (endTime - startTime) / 60000;
            return (words / minutes).toFixed(2);
        }
        return 0;
    };

    const calculateAccuracy = () => {
        const correctWords = text.split(' ').filter((word, index) => word === userInput.trim().split(' ')[index]).length;
        return ((correctWords / text.split(' ').length) * 100).toFixed(2);
    };

    return (
        <div className="w-full flex flex-col items-center p-4 h-full flex-grow">
            <h1 className="text-2xl font-bold mb-4 text-white">Typing Test</h1>
            <div className='flex gap-5 flex-col text-gray-400 font-bold flex-grow'>
                <div className="flex gap-5 justify-center text-lg">
                    <p className={`${timer > 40 ? "text-green-500" : timer > 20 ? "text-yellow-500" : timer <= 20 && "text-red-500"}`}>Seconds Left: {timer}</p>
                    <p className={`text-green-500`}>Words Per Minute: {calculateWPM()}</p>
                    <p className={`${Number(calculateAccuracy()) > 90 ? "text-green-500" : Number(calculateAccuracy()) > 60 ? "text-yellow-500" : Number(calculateAccuracy()) <= 30 && "text-red-500"}`}>Accuracy: {calculateAccuracy()}%</p>
                </div>
                <div className='h-full flex-grow flex flex-col justify-between pb-10'>
                    <div className="">
                        <p className="text-[38px] flex flex-wrap">
                            {text.split(' ').map((word, index) => (
                                <span key={index} className={`${getWordColor(word, index, activeIndex)} mr-2`}>
                                    {word} <br />
                                    {/* {userInput} <br /> */}
                                    {/* {word.split(' ')[index]} */}
                                </span>
                            ))}
                        </p>
                    </div>
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleChange}
                        className="w-full mt-4 p-2 rounded-sm bg-[#333] border"
                        placeholder="Start typing here..."
                        disabled={timer === 0}
                    />
                </div>
            </div>

        </div>
    );
};

export default TypingTest;
