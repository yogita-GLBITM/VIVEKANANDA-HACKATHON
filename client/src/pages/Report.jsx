import { ArrowRight, Download, RotateCcw, Sparkles, Users, Quote } from "lucide-react";
import { vivekanandaPhoto } from "../vivekananda";

export default function Report({ session, onTeacher, onRestart }) {
  const r = session.result;
  const independence = r.independentPct >= 70
    ? "Growing independence"
    : "Building independence";
  const perseverance = r.retries > 0
    ? "You kept going"
    : "A new chance to keep trying";
  const confidenceJourney = r.confidenceAfter > r.confidenceBefore
    ? "Confidence is growing"
    : r.confidenceAfter === r.confidenceBefore
    ? "Steady confidence"
    : "Keep believing in yourself";

  return (
    <main className="section report-page">
      <div className="report-header">
        <div>
          <span className="kicker">YOUR VIVEK GROWTH REPORT</span>
          <h1>More than a score.</h1>
          <p>Your journey today is a story of effort, reflection and growth.</p>
        </div>
        <div className="report-actions">
          <button className="secondary-btn" onClick={() => window.print()}><Download size={16}/> Print / Save</button>
          <button className="secondary-btn" onClick={onTeacher}><Users size={16}/> Teacher view</button>
        </div>
      </div>

      <div className="score-hero">
        <div className="score-hero-photo">
          <img src={vivekanandaPhoto} alt="Swami Vivekananda" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        </div>
        <div className="vivek-seal"><Quote size={22}/><span>VIVEK</span></div>
        <div>
          <span className="kicker light-kicker">A MESSAGE FOR YOUR JOURNEY</span>
          <blockquote>“Arise, awake, and do not stop until the goal is reached.”</blockquote>
          <p className="quote-author">— Swami Vivekananda</p>
          <div className="growth-message"><Sparkles size={16}/> Every thoughtful attempt is a step forward.</div>
        </div>
      </div>

      <div className="metric-grid">
        <Metric label="Self-Reliance (स्वावलम्बन)" value={independence} note="You are learning to trust your own thinking." />
        <Metric label="Perseverance (अध्यवसाय)" value={perseverance} note="Every challenge is a chance to grow stronger." />
        <Metric label="Concentration (एकाग्रता)" value={r.engagementLabel} note={`Your average thinking time was ${r.avgTime}s per question.`} />
        <Metric label="Self-Confidence (आत्मश्रद्धा)" value={confidenceJourney} note="Based on your own reflection before and after." />
      </div>

      <div className="report-columns">
        <section className="report-card">
          <span className="kicker">THE VIVEK FIVE</span>
          <h2>What your learning journey shows</h2>
          <Observation icon="◌" title="Concentration (एकाग्रता) & engagement" text={r.engagementLabel === "Sustained engagement" ? "You stayed thoughtfully engaged across the challenge." : "Your pace changed from question to question. That is useful feedback for your next practice session."} />
          <Observation icon="↻" title="Perseverance (अध्यवसाय)" text={r.retries > 0 ? "You chose to continue after an initial mistake — that is part of becoming stronger through effort." : "Next time, give a difficult question another approach before moving on."} />
          <Observation icon="◇" title="Self-Reliance (स्वावलम्बन)" text={r.independentPct >= 70 ? "You gave yourself space to think independently before using support." : "You used support when needed. Next time, try one independent approach first."} />
          <Observation icon="↗" title="Self-Confidence (आत्मश्रद्धा)" text={`You began feeling ${r.confidenceBefore}/5 confident and finished at ${r.confidenceAfter}/5. Keep building trust in your own effort.`} />
          <Observation icon="✦" title="Strength of Mind (मनःशक्ति)" text={r.completed ? "You stayed with the full challenge. That willingness to continue matters." : "Coming back to complete the full challenge next time will strengthen your learning habit."} />
        </section>

        <section className="report-card recommendation">
          <span className="kicker">VIVEKANANDA'S WAY FORWARD</span>
          <h2>Keep going. Keep growing.</h2>
          <div className="vivek-quote-box">
            <Quote size={18}/>
            <p>“Education is the manifestation of the perfection already in man.”</p>
            <small>— Swami Vivekananda</small>
          </div>
          <div className="recommendation-box"><Sparkles size={18}/><p>For your next practice session, choose a few questions that feel challenging. Try your own approach first, reflect on what changed, and use support when it genuinely helps.</p></div>
          <div className="report-facts">
            <span><b>{r.hints}</b> support moments</span>
            <span><b>{r.changed}</b> thoughtful reconsiderations</span>
            <span><b>{r.retries}</b> try-again moments</span>
          </div>
        </section>
      </div>

      <div className="report-disclaimer">
        <strong>What this report can and cannot say:</strong> VIVEK reports observable interactions and self-reported reflections from this assessment. It does not scientifically measure IQ, personality, clinical concentration, mental health or resilience.
      </div>

      <div className="bottom-actions">
        <button className="secondary-btn" onClick={onRestart}><RotateCcw size={16}/> Try another assessment</button>
        <button className="primary-btn" onClick={onTeacher}>Open teacher report <ArrowRight size={17}/></button>
      </div>
    </main>
  );
}

function Metric({ label, value, note }) {
  return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}
function Observation({ icon, title, text }) {
  return <div className="observation"><div className="obs-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></div>;
}
