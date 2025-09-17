import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { encryptData } from '@/utils/cryptoStorage'
import { quizService } from '@/services'

// Hàm shuffle array
const shuffleArray = (arr) => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
}

export default function QuizDetail() {
    const { idAndSlug } = useParams()
    const [id] = idAndSlug.split('-') // tách id từ URL
    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shuffleQuestions, setShuffleQuestions] = useState(false)
    const [shuffleOptions, setShuffleOptions] = useState(false)
    const navigate = useNavigate()

    // 🔥 Lấy quiz từ API theo id
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await quizService.getById(id)
                setQuiz(res.data)
            } catch (err) {
                console.error('Lỗi khi lấy quiz:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchQuiz()
    }, [id])

    const prepareQuiz = () => {
        const storageKey = `quiz-${quiz.id}-${quiz.title.replace(/\s/g, '-')}`

        // Xóa dữ liệu cũ
        sessionStorage.removeItem(storageKey + '-quiz')
        sessionStorage.removeItem(storageKey + '-state')

        // Chuẩn bị quiz mới
        let preparedQuiz = JSON.parse(JSON.stringify(quiz))

        if (shuffleQuestions) {
            preparedQuiz.questions = shuffleArray(preparedQuiz.questions)
        }

        if (shuffleOptions) {
            preparedQuiz.questions = preparedQuiz.questions.map((q) => ({
                ...q,
                options: shuffleArray(q.options),
            }))
        }

        // ✅ Lưu quiz gốc vào sessionStorage
        sessionStorage.setItem(storageKey + '-quiz', encryptData(preparedQuiz))

        // ✅ Khởi tạo state answers trống
        const initialAnswers = preparedQuiz.questions.map(() => ({ selectedId: null }))
        sessionStorage.setItem(
            storageKey + '-state',
            encryptData({ answers: initialAnswers, currentIndex: 0, startTime: Date.now() })
        )

        return storageKey
    }

    const handleStartQuiz = (mode) => {
        const storageKey = prepareQuiz()

        let path = '/quiz/practice'
        if (mode === 'exam') path = '/quiz/exam'
        else if (mode === 'review') path = '/quiz/review'

        navigate(path, { state: { storageKey } })
    }

    if (loading) return <p>Đang tải quiz...</p>
    if (!quiz) return <p>Không tìm thấy quiz</p>

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-3xl font-bold">{quiz.title}</h2>
            <p className="text-gray-700">{quiz.description || 'Không có mô tả'}</p>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    id="shuffleQuestions"
                />
                <label htmlFor="shuffleQuestions">Đảo câu hỏi</label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    id="shuffleOptions"
                />
                <label htmlFor="shuffleOptions">Đảo đáp án</label>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={() => handleStartQuiz('practice')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Luyện tập
                </button>

                <button
                    onClick={() => handleStartQuiz('exam')}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Thi thử
                </button>
            </div>
        </div>
    )
}
