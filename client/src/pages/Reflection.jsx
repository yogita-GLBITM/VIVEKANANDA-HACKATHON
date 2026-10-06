import { useState } from "react";
import { ArrowRight, MessageCircleHeart } from "lucide-react";
import { reflectionFeelings } from "../data";

export default function Reflection({ onFinish }) {
  const [feeling, setFeeling] = useState("");
  const [confidence, setConfidence] = useState(4);
  const [choice, setChoice] = useState("try");

  const choices = [
    ["try", "A", "I tried another approach"],
    ["hint", "B", "I used a hint"],
    ["skip", "C", "I skipped it immediately"],
    ["guess", "D", "I guessed"],
    ["return", "E", "I returned to it later"]
  ];

  return (
    <main className="section narrow-page">
      <div className="page-intro">
        <span className="kicker">FINAL STEP · REFLECTION</span>
        <h1>How do you feel now?</h1>
        <p>There is no right answer. Your reflection helps us compare your own experience before and after the challenge.</p>
      </div>

      <div className="reflection-card">
        <div className="question-title"><MessageCircleHeart size={20}/> After the assessment</div>
        <div className="emotion-grid">
          {reflectionFeelings.map(([id,emoji,label]) => (
            <button className={`emotion ${feeling === id ? "active" : ""}`} key={id} onClick={() => setFeeling(id)}>
              <span>{emoji}</span><b>{label}</b>
            </button>
          ))}
        </div>

        <div className="scale-block">
          <div className="scale-head"><div><span className="question-title">How confident do you feel now?</span><small>1 = not confident · 5 = very confident</small></div><strong>{confidence}/5</strong></div>
          <input type="range" min="1" max="5" value={confidence} onChange={e => setConfidence(+e.target.value)} />
        </div>

        <div className="reflection-question">
          <span className="question-title">What did you do when you found a question difficult?</span>
          <div className="reflection-options">
            {choices.map(([id,letter,label]) => (
              <button className={choice === id ? "reflection-option active" : "reflection-option"} key={id} onClick={() => setChoice(id)}>
                <b>{letter}</b>{label}
              </button>
            ))}
          </div>
        </div>

        <button className="primary-btn" disabled={!feeling} onClick={() => onFinish({
          feelingAfter: feeling,
          postConfidence: confidence,
          difficultChoice: choice,
          timestamp: Date.now()
        })}>
          Generate my growth report <ArrowRight size={18}/>
        </button>
      </div>
    </main>
  );
}
