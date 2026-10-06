import { useEffect, useState } from "react";
import { ArrowRight, Wind } from "lucide-react";

const messages = {
  nervous: ["You don't need to be perfect.", "Take one question at a time.", "A difficult question is an opportunity to learn."],
  scared: ["It is okay to make mistakes.", "This assessment measures your learning journey, not your worth.", "Give yourself permission to try."],
  confident: ["Great. Stay focused.", "Give every question your own attempt.", "Use support when it genuinely helps."],
  tired: ["Take a breath.", "Work at your own comfortable pace.", "There is no need to rush."],
  okay: ["Settle into the challenge.", "Read each question carefully.", "Your effort matters."],
  unsure: ["You can start without having every answer.", "Take one question at a time.", "Try your own approach first."]
};

export default function Guidance({ emotion, onReady }) {
  const [breathing, setBreathing] = useState(false);
  const lines = messages[emotion] || messages.unsure;

  useEffect(() => {
    if (!breathing) return;
    const t = setTimeout(() => setBreathing(false), 5000);
    return () => clearTimeout(t);
  }, [breathing]);

  return (
    <main className="section narrow-page centered">
      <div className="guidance-orb"><Wind size={28}/></div>
      <span className="kicker">STEP 03 · MIND PREPARATION</span>
      <h1>Arrive before you begin.</h1>
      <div className="guidance-card">
        <div className="guidance-quote">“Arise, awake, and do not stop until the goal is reached.”<small>— Swami Vivekananda</small></div>
        {lines.map(x => <p key={x}>{x}</p>)}
        <div className={`breath ${breathing ? "breathing" : ""}`}>
          <span>{breathing ? "Breathe slowly…" : "Pause. Take a slow breath."}</span>
        </div>
        <button className="secondary-btn" onClick={() => setBreathing(true)}>
          <Wind size={17}/> {breathing ? "Breathing…" : "1-minute focus pause"}
        </button>
      </div>
      <p className="small-muted">When you are ready, the challenge will begin. We only observe your interactions with the assessment itself.</p>
      <button className="primary-btn" onClick={onReady}>I'm Ready <ArrowRight size={18}/></button>
    </main>
  );
}
