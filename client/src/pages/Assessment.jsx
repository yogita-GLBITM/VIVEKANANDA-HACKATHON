import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock3, Lightbulb, RotateCcw, SkipForward } from "lucide-react";

export default function Assessment({ questions, onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintAt, setHintAt] = useState(null);
  const [changed, setChanged] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [logs, setLogs] = useState([]);
  const startedAt = useRef(Date.now());
  const question = questions[index];

  useEffect(() => {
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [index]);

  useEffect(() => {
    setSelected(null);
    setAttempt(0);
    setHintUsed(false);
    setHintAt(null);
    setChanged(false);
    setFeedback("");
    startedAt.current = Date.now();
    setSeconds(0);
  }, [index]);

  const choose = (letter) => {
    if (selected && selected !== letter) setChanged(true);
    setSelected(letter);
    setFeedback("");
  };

  const useHint = () => {
    if (!hintUsed) {
      setHintUsed(true);
      setHintAt(Date.now());
    }
  };

  const next = () => {
    const answerTime = Date.now();
    const isCorrect = selected === question.correctAnswer;
    const current = {
      questionId: question.id,
      startTime: startedAt.current,
      answerTime: selected ? answerTime : null,
      finalAnswer: selected,
      isCorrect: selected ? isCorrect : false,
      numberOfAttempts: attempt + (selected ? 1 : 0),
      hintUsed,
      hintTime: hintAt,
      timeBeforeHint: hintAt ? hintAt - startedAt.current : null,
      timeToFinalAnswer: selected ? answerTime - startedAt.current : answerTime - startedAt.current,
      changedAnswer: changed,
      skipped: !selected,
      retryCount: attempt,
      subject: question.subject,
      difficulty: question.difficulty
    };

    if (selected && !isCorrect && attempt < 2) {
      setAttempt(a => a + 1);
      setFeedback("Not quite. Would you like to try again? You can reconsider the question or use a hint.");
      return;
    }

    const nextLogs = [...logs, current];
    if (index === questions.length - 1) onFinish(nextLogs);
    else {
      setLogs(nextLogs);
      setIndex(i => i + 1);
    }
  };

  const progress = Math.round(((index + 1) / questions.length) * 100);

  return (
    <main className="assessment-page">
      <div className="assessment-top">
        <div>
          <span className="kicker">LIVE ASSESSMENT · CLASS 6 DEMO</span>
          <div className="progress-track"><span style={{width:`${progress}%`}} /></div>
        </div>
        <div className="timer"><Clock3 size={16}/> {formatTime(seconds)}</div>
      </div>

      <div className="assessment-layout">
        <aside className="question-rail">
          <span className="rail-label">QUESTIONS</span>
          <div className="question-dots">
            {questions.map((q,i) => <button key={q.id} className={i === index ? "dot current" : i < index ? "dot done" : "dot"} onClick={() => i < index && setIndex(i)}>{i+1}</button>)}
          </div>
          <div className="privacy-card">
            <strong>Private by design</strong>
            <p>No webcam, mic, face scan or eye tracking. Only assessment interactions are recorded.</p>
          </div>
        </aside>

        <section className="question-panel">
          <div className="question-meta">
            <span>Question {index + 1} of {questions.length}</span>
            <span>{question.subject} · {question.difficulty}</span>
          </div>
          <h1>{question.question}</h1>

          <div className="options">
            {question.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              return (
                <button key={letter} className={`option ${selected === letter ? "selected" : ""}`} onClick={() => choose(letter)}>
                  <span className="option-letter">{letter}</span>
                  <span>{option}</span>
                  {selected === letter && <Check size={18}/>}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className="retry-box">
              <div><RotateCcw size={19}/><strong>{feedback}</strong></div>
              <small>Your previous attempt is recorded as part of your learning journey — not as a judgement.</small>
            </div>
          )}

          {hintUsed && (
            <div className="hint-box"><Lightbulb size={18}/><div><b>Think about this:</b><p>{question.hint}</p></div></div>
          )}

          <div className="question-actions">
            <button className="hint-btn" onClick={useHint}><Lightbulb size={17}/> Need a hint?</button>
            <button className="skip-btn" onClick={() => { setSelected(null); next(); }}><SkipForward size={16}/> Skip</button>
            <button className="primary-btn" disabled={!selected && !feedback} onClick={next}>
              {feedback ? "Submit my attempt" : index === questions.length - 1 ? "Finish assessment" : "Next question"} <ChevronRight size={18}/>
            </button>
          </div>
          <p className="assessment-note">Tip: Try your own approach first. Using a hint is completely okay.</p>
        </section>
      </div>
    </main>
  );
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}
