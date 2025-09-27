import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, utils } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import QuizForm from "../../components/QuizForm";

export default function QuizCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [questionCount, setQuestionCount] = useState(5);
  
  // Tính số câu hỏi tự động dựa trên text
  const autoQuestionCount = useMemo(() => {
    if (!text.trim()) return 0;
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.length;
  }, [text]);

  // Cập nhật questionCount khi text thay đổi
  useEffect(() => {
    if (autoQuestionCount > 0) {
      setQuestionCount(autoQuestionCount);
    }
  }, [autoQuestionCount]);
  const [questionType, setQuestionType] = useState("mixed");
  const [choicesPerQuestion, setChoicesPerQuestion] = useState(4);
  const [englishLevel, setEnglishLevel] = useState("B1");
  const [displayLanguage, setDisplayLanguage] = useState("english");
  const [promptExtension, setPromptExtension] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Tự sinh title nếu chưa nhập
    let nextTitle = title.trim();
    if (!nextTitle) {
      nextTitle = utils.deriveTitleFromText(text).trim();
      if (nextTitle) setTitle(nextTitle);
    }

    if (!nextTitle) {
      setError("Vui lòng nhập tiêu đề (title)");
      return;
    }
    if (!text.trim()) {
      setError("Vui lòng nhập nội dung text");
      return;
    }
    if (!user?.email) {
      setError("Vui lòng đăng nhập để tạo quiz");
      return;
    }
    try {
      setLoading(true);
      await api.createQuiz({ 
        title: nextTitle, 
        text, 
        model,
        questionCount,
        questionType,
        choicesPerQuestion,
        englishLevel,
        displayLanguage,
        promptExtension
      });
      navigate("/quizzes");
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Tạo bài kiểm tra
          </h1>
          <Link 
            to="/quizzes" 
            className="px-4 py-2 rounded-lg border transition-colors"
            style={{ 
              borderColor: 'var(--border-color)', 
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--card-bg)'
            }}
          >
            ← Danh sách
          </Link>
        </div>

        <QuizForm
          title={title}
          setTitle={setTitle}
          text={text}
          setText={setText}
          model={model}
          setModel={setModel}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          questionType={questionType}
          setQuestionType={setQuestionType}
          choicesPerQuestion={choicesPerQuestion}
          setChoicesPerQuestion={setChoicesPerQuestion}
          englishLevel={englishLevel}
          setEnglishLevel={setEnglishLevel}
          displayLanguage={displayLanguage}
          setDisplayLanguage={setDisplayLanguage}
          promptExtension={promptExtension}
          setPromptExtension={setPromptExtension}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
