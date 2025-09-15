'use client'

import { useState, useEffect } from 'react'

function Question({ question, selectedAnswer, onAnswer }) {
    return (
        <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
            <div className="space-y-2">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAnswer(option)}
                        className={`block w-full text-left px-4 py-2 rounded border ${selectedAnswer === option
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function Quiz({ quiz }) {
    const storageKey = `quiz-${quiz.title.replace(/\s/g, '-')}`

    // khởi tạo state từ sessionStorage ngay lập tức
    const [answers, setAnswers] = useState(() => {
        const savedState = sessionStorage.getItem(storageKey)
        if (savedState) {
            const parsed = JSON.parse(savedState)
            return parsed.answers || Array(quiz.questions.length).fill(null)
        }
        return Array(quiz.questions.length).fill(null)
    })

    const [currentIndex, setCurrentIndex] = useState(() => {
        const savedState = sessionStorage.getItem(storageKey)
        if (savedState) {
            const parsed = JSON.parse(savedState)
            return parsed.currentIndex || 0
        }
        return 0
    })

    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify({ answers, currentIndex }))
    }, [answers, currentIndex])

    const handleAnswer = (answer) => {
        const newAnswers = [...answers]
        newAnswers[currentIndex] = answer
        setAnswers(newAnswers)
    }

    const handleSubmit = () => {
        setSubmitted(true)
        // sessionStorage.removeItem(storageKey) // nếu muốn xóa khi submit
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>

            {/* Question Navigator */}
            <div className="flex flex-wrap gap-2 mb-6">
                {quiz.questions.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-10 h-10 flex items-center justify-center rounded border font-semibold ${currentIndex === idx
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : answers[idx]
                                    ? 'bg-green-100 border-green-300'
                                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>

            {/* Current Question */}
            <Question
                question={quiz.questions[currentIndex]}
                selectedAnswer={answers[currentIndex]}
                onAnswer={handleAnswer}
            />

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700"
            >
                Submit
            </button>

            {/* Answers Summary */}
            {submitted && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                    <h3 className="font-semibold text-green-800 mb-2">Your answers:</h3>
                    <ul className="list-disc list-inside">
                        {answers.map((ans, idx) => (
                            <li key={idx}>
                                Question {idx + 1}: {ans || 'Not answered'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
