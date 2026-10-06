import { useState } from "react";
import { ArrowRight, Battery, HeartHandshake } from "lucide-react";
import { emotions } from "../data";

export default function WellBeing({ onContinue }) {
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [energy, setEnergy] = useState(3);

  return (
    <main className="section narrow-page">
      <div className="page-intro">
        <span className="kicker">STEP 02 · PRE-ASSESSMENT WELL-BEING CHECK</span>
        <h1>Before we begin, how are you feeling right now?</h1>
        <p>This is a self-reported check-in. It helps us compare how you felt before and after the challenge. It is not a medical or psychological assessment.</p>
      </div>

      <div className="checkin-card">
        <div className="question-block">
          <div className="question-title"><HeartHandshake size={20}/> Your current state</div>
          <div className="emotion-grid">
            {emotions.map(([id,emoji,label]) => (
              <button key={id} className={emotion === id ? "emotion active" : "emotion"} onClick={() => setEmotion(id)}>
                <span>{emoji}</span><b>{label}</b>
              </button>
            ))}
          </div>
        </div>

        <div className="scale-block">
          <div className="scale-head">
            <div><span className="question-title">How confident do you feel about today's challenge?</span><small>1 = not confident · 5 = very confident</small></div>
            <strong>{confidence}/5</strong>
          </div>
          <input type="range" min="1" max="5" value={confidence} onChange={e => setConfidence(+e.target.value)} />
          <div className="range-labels"><span>Not yet</span><span>Ready</span><span>Very ready</span></div>
        </div>

        <div className="scale-block">
          <div className="scale-head">
            <div><span className="question-title"><Battery size={19}/> How is your energy right now?</span><small>Choose what feels closest.</small></div>
            <strong>{energy}/5</strong>
          </div>
          <input type="range" min="1" max="5" value={energy} onChange={e => setEnergy(+e.target.value)} />
          <div className="range-labels"><span>Low</span><span>Okay</span><span>High</span></div>
        </div>

        <button className="primary-btn" disabled={!emotion} onClick={() => onContinue({
          initialEmotion: emotion,
          initialConfidence: confidence,
          energyLevel: energy,
          timestamp: Date.now()
        })}>
          Continue <ArrowRight size={18}/>
        </button>
      </div>
    </main>
  );
}
