import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { vivekanandaPhoto } from "../vivekananda";

export default function LevelSelect({ levels, futureLevels, onSelect }) {
  return (
    <main className="section selection-page">
      <div className="page-intro">
        <span className="kicker">STEP 01 · CHOOSE YOUR LEVEL</span>
        <h1>Where are you on your learning journey?</h1>
        <p>For the hackathon demo, choose an age group. <strong>Class 6 / ages 12–15 style reasoning</strong> is the primary showcase path.</p>
      </div>
      <div className="vivek-welcome">
        <div className="vivek-welcome-photo">
          <img src={vivekanandaPhoto} alt="Swami Vivekananda" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        </div>
        <div className="vivek-welcome-mark">ॐ</div>
        <div>
          <span className="kicker">INSPIRED BY SWAMI VIVEKANANDA</span>
          <h3>“Strength is life, weakness is death.”</h3>
          <p>Choose your learning stage. This journey is about discovering your strengths, building confidence and learning to trust your own effort.</p>
        </div>
      </div>
      <div className="level-grid">
        {levels.map((level) => (
          <button className={`level-card ${level.id === "12-15" ? "featured" : ""}`} key={level.id} onClick={() => onSelect(level.id)}>
            {level.id === "12-15" && <span className="demo-tag"><Sparkles size={13}/> Demo focus</span>}
            <span className="level-icon">{level.icon}</span>
            <span className="level-label">{level.label}</span>
            <span className="level-note">{level.note}</span>
            <span className="level-subjects">{level.subjects}</span>
            <span className="level-arrow"><ArrowRight size={18}/></span>
          </button>
        ))}
      </div>
      <div className="future-box">
        <div>
          <span className="kicker">ROADMAP</span>
          <h3>Built to grow beyond the demo.</h3>
          <p>Higher classes and competitive exams can use the same assessment engine later.</p>
        </div>
        <div className="future-pills">
          {futureLevels.map(x => <span key={x}><Lock size={13}/>{x}</span>)}
        </div>
      </div>
      <div className="honesty-note">
        <strong>Important:</strong> VIVEK provides a learning-behaviour assessment, not a clinical psychological test or scientific IQ test.
      </div>
    </main>
  );
}
