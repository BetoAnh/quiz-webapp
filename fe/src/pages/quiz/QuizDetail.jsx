import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { encryptData } from '@/utils/cryptoStorage'

const sampleQuiz = {
    id: 0,
    title: 'Sample Quiz 20 Questions',
    description: 'Luyện tập 20 câu hỏi mẫu',
    questions: [
        {
            id: 0,
            text: 'Thủ đô của Việt Nam là gì?',
            options: [
                { id: 0, text: 'Hà Nội' },
                { id: 1, text: 'TP. Hồ Chí Minh' },
                { id: 2, text: 'Đà Nẵng' },
                { id: 3, text: 'Huế' }
            ],
            correctId: 0
        },
        {
            id: 1,
            text: '2 + 3 × 4 = ?',
            options: [
                { id: 0, text: '14' },
                { id: 1, text: '20' },
                { id: 2, text: '24' },
                { id: 3, text: '18' }
            ],
            correctId: 0
        },
        {
            id: 2,
            text: 'Nguyên tố hóa học có ký hiệu O là gì?',
            options: [
                { id: 0, text: 'Osmium' },
                { id: 1, text: 'Oxygen' },
                { id: 2, text: 'Gold' },
                { id: 3, text: 'Silver' }
            ],
            correctId: 1
        },
        {
            id: 3,
            text: 'Ai là tác giả “Truyện Kiều”?',
            options: [
                { id: 0, text: 'Nguyễn Trãi' },
                { id: 1, text: 'Nguyễn Du' },
                { id: 2, text: 'Hồ Xuân Hương' },
                { id: 3, text: 'Nguyễn Công Trứ' }
            ],
            correctId: 1
        },
        {
            id: 4,
            text: 'Quốc gia nào có diện tích lớn nhất thế giới?',
            options: [
                { id: 0, text: 'Mỹ' },
                { id: 1, text: 'Canada' },
                { id: 2, text: 'Nga' },
                { id: 3, text: 'Trung Quốc' }
            ],
            correctId: 2
        },
        {
            id: 5,
            text: 'Trong tin học, HTML được viết tắt của cụm từ nào?',
            options: [
                { id: 0, text: 'HighText Markup Language' },
                { id: 1, text: 'HyperText Markup Language' },
                { id: 2, text: 'Hyperlink Text Management Language' },
                { id: 3, text: 'Home Tool Markup Language' }
            ],
            correctId: 1
        },
        {
            id: 6,
            text: 'Ai là nhà bác học đã phát minh định luật vạn vật hấp dẫn?',
            options: [
                { id: 0, text: 'Albert Einstein' },
                { id: 1, text: 'Isaac Newton' },
                { id: 2, text: 'Galileo Galilei' },
                { id: 3, text: 'Nikola Tesla' }
            ],
            correctId: 1
        },
        {
            id: 7,
            text: 'Sông nào dài nhất thế giới?',
            options: [
                { id: 0, text: 'Amazon' },
                { id: 1, text: 'Nile' },
                { id: 2, text: 'Yangtze' },
                { id: 3, text: 'Mississippi' }
            ],
            correctId: 1
        },
        {
            id: 8,
            text: 'Trong hệ Mặt Trời, hành tinh nào gần Mặt Trời nhất?',
            options: [
                { id: 0, text: 'Sao Thủy (Mercury)' },
                { id: 1, text: 'Sao Kim (Venus)' },
                { id: 2, text: 'Trái Đất (Earth)' },
                { id: 3, text: 'Sao Hỏa (Mars)' }
            ],
            correctId: 0
        },
        {
            id: 9,
            text: 'Cấu trúc nào trong tế bào chứa thông tin di truyền?',
            options: [
                { id: 0, text: 'Ty thể' },
                { id: 1, text: 'Ribosome' },
                { id: 2, text: 'Nhân tế bào' },
                { id: 3, text: 'Lưới nội chất' }
            ],
            correctId: 2
        },
        {
            id: 10,
            text: '“Romeo và Juliet” là tác phẩm của ai?',
            options: [
                { id: 0, text: 'William Shakespeare' },
                { id: 1, text: 'Victor Hugo' },
                { id: 2, text: 'Charles Dickens' },
                { id: 3, text: 'Leo Tolstoy' }
            ],
            correctId: 0
        },
        {
            id: 11,
            text: 'Trong bảng tuần hoàn, ký hiệu Na là nguyên tố nào?',
            options: [
                { id: 0, text: 'Nitrogen' },
                { id: 1, text: 'Sodium' },
                { id: 2, text: 'Neon' },
                { id: 3, text: 'Nickel' }
            ],
            correctId: 1
        },
        {
            id: 12,
            text: 'Quốc kỳ Nhật Bản có hình gì?',
            options: [
                { id: 0, text: 'Hình vuông màu đỏ' },
                { id: 1, text: 'Vòng tròn đỏ trên nền trắng' },
                { id: 2, text: 'Ngôi sao đỏ trên nền vàng' },
                { id: 3, text: 'Hai vạch đỏ ngang' }
            ],
            correctId: 1
        },
        {
            id: 13,
            text: 'Ngôn ngữ lập trình nào được dùng để phát triển React?',
            options: [
                { id: 0, text: 'Java' },
                { id: 1, text: 'Python' },
                { id: 2, text: 'JavaScript' },
                { id: 3, text: 'C++' }
            ],
            correctId: 2
        },
        {
            id: 14,
            text: 'Châu lục nào có diện tích nhỏ nhất?',
            options: [
                { id: 0, text: 'Châu Úc' },
                { id: 1, text: 'Châu Âu' },
                { id: 2, text: 'Châu Nam Mỹ' },
                { id: 3, text: 'Châu Phi' }
            ],
            correctId: 0
        },
        {
            id: 15,
            text: 'Ai là tác giả của “Tắt đèn”?',
            options: [
                { id: 0, text: 'Ngô Tất Tố' },
                { id: 1, text: 'Nam Cao' },
                { id: 2, text: 'Vũ Trọng Phụng' },
                { id: 3, text: 'Nguyễn Công Hoan' }
            ],
            correctId: 0
        },
        {
            id: 16,
            text: 'Trong bóng đá, một đội có bao nhiêu cầu thủ chính thức trên sân?',
            options: [
                { id: 0, text: '9' },
                { id: 1, text: '10' },
                { id: 2, text: '11' },
                { id: 3, text: '12' }
            ],
            correctId: 2
        },
        {
            id: 17,
            text: 'Người đầu tiên đặt chân lên Mặt Trăng là ai?',
            options: [
                { id: 0, text: 'Yuri Gagarin' },
                { id: 1, text: 'Neil Armstrong' },
                { id: 2, text: 'Buzz Aldrin' },
                { id: 3, text: 'Michael Collins' }
            ],
            correctId: 1
        },
        {
            id: 18,
            text: 'Phần mềm nào là trình duyệt web?',
            options: [
                { id: 0, text: 'Microsoft Word' },
                { id: 1, text: 'Google Chrome' },
                { id: 2, text: 'Adobe Photoshop' },
                { id: 3, text: 'Visual Studio Code' }
            ],
            correctId: 1
        },
        { id: 19, text: 'Quốc gia nào nổi tiếng với kim tự tháp?', options: [{ id: 0, text: 'Hy Lạp' }, { id: 1, text: 'Ấn Độ' }, { id: 2, text: 'Ai Cập' }, { id: 3, text: 'Mexico' }], correctId: 2 },
        { id: 20, text: 'C++ là ngôn ngữ lập trình thuộc loại nào?', options: [{ id: 0, text: 'Ngôn ngữ lập trình bậc cao' }, { id: 1, text: 'Ngôn ngữ lập trình bậc thấp' }, { id: 2, text: 'Ngôn ngữ lập trình hướng đối tượng' }, { id: 3, text: 'Ngôn ngữ lập trình hàm' }], correctId: 2 },
        { id: 21, text: 'Ai là tác giả của tác phẩm "Chiếc thuyền ngoài xa"?', options: [{ id: 0, text: 'Nguyễn Minh Châu' }, { id: 1, text: 'Nguyễn Tuân' }, { id: 2, text: 'Nam Cao' }, { id: 3, text: 'Tô Hoài' }], correctId: 0 },
        { id: 22, text: 'Trong toán học, số π (pi) xấp xỉ bằng bao nhiêu?', options: [{ id: 0, text: '3.14' }, { id: 1, text: '2.71' }, { id: 2, text: '1.61' }, { id: 3, text: '1.41' }], correctId: 0 },
        { id: 23, text: 'Ai là người sáng lập ra công ty Microsoft?', options: [{ id: 0, text: 'Steve Jobs' }, { id: 1, text: 'Bill Gates' }, { id: 2, text: 'Mark Zuckerberg' }, { id: 3, text: 'Larry Page' }], correctId: 1 },
        { id: 24, text: 'Trong lịch sử Việt Nam, vua nào đã cho xây dựng kinh thành Thăng Long?', options: [{ id: 0, text: 'Lý Thái Tổ' }, { id: 1, text: 'Trần Nhân Tông' }, { id: 2, text: 'Lê Lợi' }, { id: 3, text: 'Nguyễn Huệ' }], correctId: 0 },
        { id: 25, text: 'Hệ điều hành nào được phát triển bởi Apple?', options: [{ id: 0, text: 'Windows' }, { id: 1, text: 'Linux' }, { id: 2, text: 'macOS' }, { id: 3, text: 'Android' }], correctId: 2 },
        { id: 26, text: 'Ai là tác giả của tác phẩm "Số đỏ"?', options: [{ id: 0, text: 'Vũ Trọng Phụng' }, { id: 1, text: 'Nam Cao' }, { id: 2, text: 'Nguyễn Công Trứ' }, { id: 3, text: 'Nguyễn Tuân' }], correctId: 0 },
        { id: 27, text: 'Trong vật lý, đơn vị đo cường độ dòng điện là gì?', options: [{ id: 0, text: 'Volt' }, { id: 1, text: 'Watt' }, { id: 2, text: 'Ampere' }, { id: 3, text: 'Ohm' }], correctId: 2 },
        { id: 28, text: 'Ai là người phát minh ra bóng đèn điện?', options: [{ id: 0, text: 'Nikola Tesla' }, { id: 1, text: 'Thomas Edison' }, { id: 2, text: 'Alexander Graham Bell' }, { id: 3, text: 'James Watt' }], correctId: 1 },
        { id: 29, text: 'Trong lịch sử thế giới, cuộc cách mạng công nghiệp bắt đầu từ quốc gia nào?', options: [{ id: 0, text: 'Pháp' }, { id: 1, text: 'Đức' }, { id: 2, text: 'Anh' }, { id: 3, text: 'Mỹ' }], correctId: 2 },
        { id: 30, text: 'Nguyên tố hóa học có ký hiệu Fe là gì?', options: [{ id: 0, text: 'Kẽm' }, { id: 1, text: 'Sắt' }, { id: 2, text: 'Đồng' }, { id: 3, text: 'Nhôm' }], correctId: 1 },
        { id: 31, text: 'Ai là tác giả của tác phẩm "Dế mèn phiêu lưu ký"?', options: [{ id: 0, text: 'Hồ Xuân Hương' }, { id: 1, text: 'Nguyễn Du' }, { id: 2, text: 'Nguyễn Nhật Ánh' }, { id: 3, text: 'Nguyễn Công Trứ' }], correctId: 2 },
        { id: 32, text: 'Trong toán học, số nguyên tố là gì?', options: [{ id: 0, text: 'Số chia hết cho 2' }, { id: 1, text: 'Số chỉ có hai ước là 1 và chính nó' }, { id: 2, text: 'Số chia hết cho 3' }, { id: 3, text: 'Số lớn hơn 10' }], correctId: 1 },
        { id: 33, text: 'Ai là người sáng lập ra công ty Apple?', options: [{ id: 0, text: 'Steve Jobs' }, { id: 1, text: 'Bill Gates' }, { id: 2, text: 'Mark Zuckerberg' }, { id: 3, text: 'Larry Page' }], correctId: 0 },
        { id: 34, text: 'Trong lịch sử Việt Nam, vua nào đã cho xây dựng chùa Một Cột?', options: [{ id: 0, text: 'Lý Thái Tổ' }, { id: 1, text: 'Trần Nhân Tông' }, { id: 2, text: 'Lê Lợi' }, { id: 3, text: 'Nguyễn Huệ' }], correctId: 0 },
        { id: 35, text: 'Hệ điều hành nào được phát triển bởi Google?', options: [{ id: 0, text: 'Windows' }, { id: 1, text: 'Linux' }, { id: 2, text: 'macOS' }, { id: 3, text: 'Android' }], correctId: 3 },
        { id: 36, text: 'Ai là tác giả của tác phẩm "Lão Hạc"?', options: [{ id: 0, text: 'Nguyễn Minh Châu' }, { id: 1, text: 'Nam Cao' }, { id: 2, text: 'Nguyễn Công Trứ' }, { id: 3, text: 'Nguyễn Tuân' }], correctId: 1 },
        { id: 37, text: 'Trong vật lý, đơn vị đo công suất là gì?', options: [{ id: 0, text: 'Volt' }, { id: 1, text: 'Watt' }, { id: 2, text: 'Ampere' }, { id: 3, text: 'Ohm' }], correctId: 1 },
        { id: 38, text: 'Ai là người phát minh ra máy bay?', options: [{ id: 0, text: 'Nikola Tesla' }, { id: 1, text: 'Wright Brothers' }, { id: 2, text: 'Alexander Graham Bell' }, { id: 3, text: 'James Watt' }], correctId: 1 },
        { id: 39, text: 'Trong lịch sử thế giới, cuộc cách mạng Pháp diễn ra vào năm nào?', options: [{ id: 0, text: '1789' }, { id: 1, text: '1776' }, { id: 2, text: '1812' }, { id: 3, text: '1848' }], correctId: 0 }

    ]
}


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
    const [shuffleQuestions, setShuffleQuestions] = useState(false)
    const [shuffleOptions, setShuffleOptions] = useState(false)
    const navigate = useNavigate()

    const prepareQuiz = () => {
        const storageKey = `quiz-${sampleQuiz.id}-${sampleQuiz.title.replace(/\s/g, '-')}`

        // Xóa dữ liệu cũ
        sessionStorage.removeItem(storageKey + '-quiz')
        sessionStorage.removeItem(storageKey + '-state')

        // Chuẩn bị quiz mới
        let preparedQuiz = JSON.parse(JSON.stringify(sampleQuiz))

        if (shuffleQuestions) {
            preparedQuiz.questions = shuffleArray(preparedQuiz.questions)
        }

        if (shuffleOptions) {
            preparedQuiz.questions = preparedQuiz.questions.map(q => ({
                ...q,
                options: shuffleArray(q.options)
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


    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <h2 className="text-3xl font-bold">{sampleQuiz.title}</h2>
            <p className="text-gray-700">{sampleQuiz.description || 'Không có mô tả'}</p>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={e => setShuffleQuestions(e.target.checked)}
                    id="shuffleQuestions"
                />
                <label htmlFor="shuffleQuestions">Đảo câu hỏi</label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={e => setShuffleOptions(e.target.checked)}
                    id="shuffleOptions"
                />
                <label htmlFor="shuffleOptions">Đảo đáp án</label>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={() => handleStartQuiz("practice")}
                    className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Luyện tập
                </button>

                <button
                    onClick={() => handleStartQuiz("exam")}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Thi thử
                </button>

                <button
                    onClick={() => handleStartQuiz("review")}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Ôn lại
                </button>
            </div>
        </div>
    )
}
