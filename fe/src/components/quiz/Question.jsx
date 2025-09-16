'use client'

export default function Question({ question, selectedAnswer, onAnswer }) {
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
