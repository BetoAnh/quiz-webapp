import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import QuizCore from '@/components/quiz/QuizCore'
import { decryptData, encryptData } from '@/utils/cryptoStorage'

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function ExamQuiz() {
    const location = useLocation()
    const { storageKey } = location.state || {}

    const [quiz, setQuiz] = useState(null)
    const [time, setTime] = useState(0)
    const [resetKey, setResetKey] = useState(Date.now())
    const [score, setScore] = useState(null) // ✅ lưu điểm sau khi nộp
    const intervalRef = useRef(null)

    // Load quiz + state
    useEffect(() => {
        if (!storageKey) return
        const storedQuiz = decryptData(sessionStorage.getItem(storageKey + '-quiz'))
        if (storedQuiz) {
            setQuiz(storedQuiz)

            let storedState = decryptData(sessionStorage.getItem(storageKey + '-state'))
            if (!storedState) {
                const initialAnswers = storedQuiz.questions.map(() => ({ selectedId: null }))
                storedState = {
                    answers: initialAnswers,
                    currentIndex: 0,
                    startTime: Date.now()
                }
                sessionStorage.setItem(storageKey + '-state', encryptData(storedState))
            }

            if (!storedState.startTime) {
                storedState.startTime = Date.now()
                sessionStorage.setItem(storageKey + '-state', encryptData(storedState))
            }

            setTime(Math.floor((Date.now() - storedState.startTime) / 1000))
        }
    }, [storageKey])

    // Interval update time
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
            if (stored?.startTime) {
                setTime(Math.floor((Date.now() - stored.startTime) / 1000))
            }
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [resetKey, storageKey])

    const handleAnswerSelect = (qIndex, optionId) => {
        const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
        stored.answers[qIndex] = { selectedId: optionId }
        sessionStorage.setItem(storageKey + '-state', encryptData(stored))
    }

    // ✅ Nộp bài và tính điểm
    const handleSubmit = () => {
        const stored = decryptData(sessionStorage.getItem(storageKey + '-state'))
        if (!stored || !quiz) return

        let correct = 0
        quiz.questions.forEach((q, idx) => {
            if (stored.answers[idx]?.selectedId === q.correctId) {
                correct++
            }
        })

        const total = quiz.questions.length
        const percent = Math.round((correct / total) * 100)

        setScore({ correct, total, percent })
    }

    if (!quiz) return <div className="p-4 text-center">Không tìm thấy quiz!</div>

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="text-right text-lg font-semibold mb-2">
                Thời gian làm: {formatTime(time)}
            </div>

            <QuizCore
                key={resetKey}
                quiz={quiz}
                storageKey={storageKey}
                onAnswerSelect={handleAnswerSelect}
                mode={'exam'}
            />

            <div className="mt-4 text-center space-x-2">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Nộp Bài
                </button>
            </div>

            {score && (
                <div className="mt-4 p-4 border rounded bg-white shadow text-center">
                    <p className="text-lg font-bold">
                        Kết quả: {score.correct}/{score.total} ({score.percent}%)
                    </p>
                </div>
            )}
        </div>
    )
}
