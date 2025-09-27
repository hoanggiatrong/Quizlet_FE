export default function TestView({ questions, shuffledChoicesByQ, selected, onSelect, score, total }) {
  return (
    <div 
      className="border rounded-2xl shadow-xl"
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      <div 
        className="px-8 py-6 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Kiểm tra</div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Điểm: <span className="font-semibold text-blue-600">{score}/{total}</span>
        </div>
      </div>
      <div style={{ borderColor: 'var(--border-color)' }}>
        {questions.map((q, idx) => (
          <div key={idx} className="p-8" style={{ borderBottom: idx < questions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
            <div className="mb-6 text-lg font-medium whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
              {idx + 1}. {q.prompt}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shuffledChoicesByQ[idx]?.map((c, cIdx) => {
                const isSelected = selected[idx] === cIdx;
                const isCorrect = c.isCorrect === true;
                
                let bgColor = 'var(--card-bg)';
                let borderColor = 'var(--border-color)';
                let textColor = 'var(--text-primary)';
                
                if (isSelected) {
                  if (isCorrect) {
                    bgColor = 'rgba(34, 197, 94, 0.1)';
                    borderColor = 'rgba(34, 197, 94, 0.3)';
                    textColor = 'rgb(34, 197, 94)';
                  } else {
                    bgColor = 'rgba(239, 68, 68, 0.1)';
                    borderColor = 'rgba(239, 68, 68, 0.3)';
                    textColor = 'rgb(239, 68, 68)';
                  }
                }
                
                return (
                  <button
                    key={cIdx}
                    className="px-6 py-4 rounded-xl border transition-all cursor-pointer text-left hover:shadow-md"
                    style={{
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                      color: textColor
                    }}
                    onClick={() => onSelect(idx, cIdx)}
                  >
                    {c.text}
                  </button>
                );
              })}
            </div>
            
            {/* Explanation */}
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
          </div>
        ))}
      </div>
    </div>
  );
}
