import { useState } from "react";

export default function FlashcardView({ questions, current, setCurrent, showAnswer, setShowAnswer }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
        Không có câu hỏi nào.
      </div>
    );
  }

  const q = questions[current];
  const correctAnswer = q.choices?.find(c => c.isCorrect);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    setCurrent((c) => (c + 1) % questions.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    setCurrent((c) => (c - 1 + questions.length) % questions.length);
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-center space-x-4">
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {current + 1} / {questions.length}
        </div>
        <div className="w-64 rounded-full h-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <div 
          className={`w-full max-w-2xl mx-auto h-96 perspective-1000 ${isFlipped ? 'flip-card' : ''}`}
          onClick={handleFlip}
        >
          <div className="relative w-full h-full preserve-3d cursor-pointer">
            {/* Front of card */}
            <div className={`absolute inset-0 w-full h-full backface-hidden transition-all duration-500 ${
              isFlipped ? 'rotate-y-180' : 'rotate-y-0'
            }`}>
              <div 
                className="border rounded-2xl shadow-xl h-full flex flex-col items-center justify-center text-center p-6"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--border-color)' 
                }}
              >
                <div className="text-sm uppercase tracking-wide mb-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Thuật ngữ
                </div>
                <div className="text-lg font-semibold leading-relaxed whitespace-pre-line overflow-y-auto max-h-64 w-full px-4" style={{ color: 'var(--text-primary)' }}>
                  {q.prompt}
                </div>
                <div className="mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Nhấp để xem định nghĩa
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className={`absolute inset-0 w-full h-full backface-hidden transition-all duration-500 ${
              isFlipped ? 'rotate-y-0' : 'rotate-y-180'
            }`}>
              <div 
                className="border rounded-2xl shadow-xl h-full flex flex-col items-center justify-center text-center p-6"
                style={{ 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  borderColor: 'rgba(59, 130, 246, 0.3)' 
                }}
              >
                <div className="text-sm uppercase tracking-wide text-blue-600 mb-4 font-medium">
                  Định nghĩa
                </div>
                <div className="text-lg font-medium leading-relaxed whitespace-pre-line overflow-y-auto max-h-64 w-full px-4" style={{ color: 'var(--text-primary)' }}>
                  {correctAnswer?.text || "Chưa có định nghĩa"}
                </div>
                {q.explanation && (
                  <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                    <h4 className="text-sm font-medium mb-1" style={{ color: 'rgba(59, 130, 246, 0.9)' }}>
                      Giải thích:
                    </h4>
                    <p className="text-sm whitespace-pre-line" style={{ color: 'rgba(59, 130, 246, 0.8)' }}>
                      {q.explanation}
                    </p>
                  </div>
                )}
                <div className="mt-6 text-sm text-blue-600">
                  Nhấp để xem thuật ngữ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 rounded-xl border transition-colors font-medium"
          style={{ 
            borderColor: 'var(--border-color)', 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-secondary)' 
          }}
        >
          ← Trước
        </button>
        
        <button
          onClick={handleFlip}
          className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors shadow-lg"
        >
          {showAnswer ? "Xem thuật ngữ" : "Xem định nghĩa"}
        </button>
        
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-xl border transition-colors font-medium"
          style={{ 
            borderColor: 'var(--border-color)', 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-secondary)' 
          }}
        >
          Tiếp →
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
        Sử dụng phím mũi tên trái/phải để điều hướng • Phím cách để lật thẻ
      </div>
    </div>
  );
}
