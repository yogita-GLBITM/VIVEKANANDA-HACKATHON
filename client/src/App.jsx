import { useState } from "react";
import { Brain, ChevronRight, ClipboardCheck, GraduationCap, ShieldCheck, Sparkles, Users, ArrowLeft } from "lucide-react";
import { levels, futureLevels } from "./data";
import { vivekanandaPhoto } from "./vivekananda";
import { generateQuestions, saveReport, getReports } from "./api";
import Landing from "./pages/Landing";
import LevelSelect from "./pages/LevelSelect";
import WellBeing from "./pages/WellBeing";
import Guidance from "./pages/Guidance";
import Assessment from "./pages/Assessment";
import Reflection from "./pages/Reflection";
import Report from "./pages/Report";
import TeacherReport from "./pages/TeacherReport";

const initial = {
  level: null,
  wellbeing: {},
  questions: [],
  interactions: [],
  reflection: {},
  result: null
};

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [session, setSession] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectLevel = async (level) => {
    setError("");
    setLoading(true);
    try {
      const data = await generateQuestions({ level, count: 12 });
      setSession((s) => ({ ...s, level, questions: data.questions }));
      setScreen("wellbeing");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const finishAssessment = (interactions) => {
    setSession((s) => ({ ...s, interactions }));
    setScreen("reflection");
  };

  const finishReflection = async (reflection) => {
    const result = buildResult(session, reflection);
    const next = { ...session, reflection, result };
    setSession(next);
    try {
      const saved = await saveReport({
        ...next,
        createdAt: new Date().toISOString()
      });
      setSession((s) => ({ ...s, result: saved.report || result }));
    } catch {
      // Demo still works if the backend is temporarily unavailable.
      localStorage.setItem("vivek-last-report", JSON.stringify(next));
    }
    setScreen("report");
  };

  const reset = () => {
    setSession(initial);
    setError("");
    setScreen("landing");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={reset}>
          <span className="brand-photo-wrap">
            <img
              className="brand-photo"
              src={vivekanandaPhoto}
              alt="Swami Vivekananda"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <span className="brand-mark">V</span>
          </span>
          <span>
            <strong>VIVEK</strong>
            <small>Beyond Marks · Inspired by Swami Vivekananda</small>
          </span>
        </button>
        <div className="top-actions">
          <button className="teacher-link" onClick={() => setScreen("teacher")}>
            <Users size={16} /> Teacher view
          </button>
          {screen !== "landing" && screen !== "teacher" && (
            <button className="back-link" onClick={reset}><ArrowLeft size={16}/> Home</button>
          )}
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {loading && (
        <div className="loading-overlay">
          <div className="loader-card">
            <div className="spinner" />
            <h3>Preparing your challenge…</h3>
            <p>Creating age-appropriate questions. Your learning journey comes first.</p>
          </div>
        </div>
      )}

      {screen === "landing" && <Landing onStart={() => setScreen("levels")} />}
      {screen === "levels" && (
        <LevelSelect
          levels={levels}
          futureLevels={futureLevels}
          onSelect={selectLevel}
        />
      )}
      {screen === "wellbeing" && (
        <WellBeing
          onContinue={(wellbeing) => {
            setSession((s) => ({ ...s, wellbeing }));
            setScreen("guidance");
          }}
        />
      )}
      {screen === "guidance" && (
        <Guidance
          emotion={session.wellbeing.initialEmotion}
          onReady={() => setScreen("assessment")}
        />
      )}
      {screen === "assessment" && (
        <Assessment
          questions={session.questions}
          onFinish={finishAssessment}
        />
      )}
      {screen === "reflection" && (
        <Reflection
          onFinish={finishReflection}
        />
      )}
      {screen === "report" && (
        <Report
          session={session}
          onTeacher={() => setScreen("teacher")}
          onRestart={reset}
        />
      )}
      {screen === "teacher" && <TeacherReport onBack={reset} />}

      <footer className="vivek-footer">
        <div className="footer-photo-wrap">
          <img
            src={vivekanandaPhoto}
            alt="Swami Vivekananda"
            className="footer-photo"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
        <div className="footer-copy">
          <span className="footer-kicker">VIVEK · BEYOND MARKS</span>
          <strong>Learn with character. Grow with courage.</strong>
          <p>Inspired by the educational vision of Swami Vivekananda.</p>
        </div>
        <div className="footer-pillars">
          <span>Concentration (एकाग्रता)</span>
          <span>Self-Confidence (आत्मश्रद्धा)</span>
          <span>Perseverance (अध्यवसाय)</span>
          <span>Self-Reliance (स्वावलम्बन)</span>
          <span>Strength of Mind (मनःशक्ति)</span>
        </div>
      </footer>
    </div>
  );
}

function buildResult(session, reflection) {
  const q = session.questions;
  const logs = session.interactions;
  const correct = logs.filter(x => x.isCorrect).length;
  const attempted = logs.filter(x => x.finalAnswer !== null).length;
  const hints = logs.filter(x => x.hintUsed).length;
  const retries = logs.reduce((n, x) => n + x.retryCount, 0);
  const changed = logs.filter(x => x.changedAnswer).length;
  const completed = logs.length === q.length;
  const independent = logs.filter(x => x.finalAnswer !== null && !x.hintUsed).length;
  const rapid = logs.filter(x => x.timeToFinalAnswer < 3000).length;
  const avgTime = logs.length
    ? Math.round(logs.reduce((n, x) => n + x.timeToFinalAnswer, 0) / logs.length / 1000)
    : 0;

  const accuracy = q.length ? Math.round((correct / q.length) * 100) : 0;
  const independentPct = attempted ? Math.round((independent / attempted) * 100) : 0;
  const completionPct = q.length ? Math.round((attempted / q.length) * 100) : 0;
  const persistencePct = Math.min(100, 55 + retries * 12 + (completed ? 25 : 0));
  const engagementLabel =
    rapid >= Math.max(3, Math.ceil(q.length * 0.35))
      ? "Mixed pace"
      : avgTime >= 8
      ? "Sustained engagement"
      : "Steady engagement";

  return {
    accuracy,
    attempted,
    correct,
    hints,
    retries,
    changed,
    completed,
    independent,
    independentPct,
    completionPct,
    persistencePct,
    avgTime,
    engagementLabel,
    confidenceBefore: session.wellbeing.initialConfidence || 0,
    confidenceAfter: reflection.postConfidence || 0,
    emotionBefore: session.wellbeing.initialEmotion || "unsure",
    feelingAfter: reflection.feelingAfter || "calm",
    initiative: reflection.difficultChoice || "try",
    questionsCount: q.length,
    observations: [
      independentPct >= 70
        ? "You attempted most questions independently before requesting support."
        : "You used support on several questions; next time, try one independent approach before asking for help.",
      retries > 0
        ? "You continued working after an initial mistake on some questions."
        : "You did not retry an incorrect answer in this attempt; give difficult questions another approach next time.",
      changed > 0
        ? "You reconsidered and changed an answer on at least one question."
        : "Your first choices were mostly stable throughout the assessment.",
      engagementLabel === "Sustained engagement"
        ? "Your interaction pattern shows sustained engagement across most questions."
        : "Your pace varied across questions, which is useful information for future practice."
    ]
  };
}
