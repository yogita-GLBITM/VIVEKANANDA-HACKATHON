import { Brain, CheckCircle2, ChevronRight, Compass, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { vivekanandaPhoto } from "../vivekananda";

export default function Landing({ onStart }) {
  return (
    <main>
      <section className="hero section">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> Education that awakens potential</div>
          <h1>Beyond <em>Marks.</em></h1>
          <p className="hero-lead">Education is not only about what you know. <strong>It is also about how you learn.</strong></p>
          <p className="hero-text">
            VIVEK turns everyday assessments into a learning-behaviour mirror — inspired by Swami Vivekananda's vision of education that develops concentration, character, confidence and self-reliance.
          </p>
          <button className="primary-btn large" onClick={onStart}>
            Start Assessment <ChevronRight size={19}/>
          </button>
          <div className="trust-row">
            <span><ShieldCheck size={16}/> No webcam</span>
            <span><ShieldCheck size={16}/> No surveillance</span>
            <span><ShieldCheck size={16}/> Behaviour, not diagnosis</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="vivek-hero-photo">
            <img src={vivekanandaPhoto} alt="Swami Vivekananda" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
          <div className="sun-disc" />
          <div className="hero-card card-float">
            <span className="mini-label">YOUR LEARNING JOURNEY</span>
            <div className="journey-line"><i/><i/><i/><i/><i/></div>
            <div className="journey-labels"><span>Focus</span><span>Effort</span><span>Retry</span><span>Independence</span><span>Growth</span></div>
          </div>
          <div className="quote-card">
            <span>VIVEK · SWAMI VIVEKANANDA</span>
            <p>“Education is the manifestation of the perfection already in man.”</p>
          </div>
        </div>
      </section>

      <section className="principles section">
        <div className="section-heading">
          <span className="kicker">THE FIVE PILLARS</span>
          <h2>What we look beyond the marks for.</h2>
          <p>VIVEK translates educational principles into observable assessment behaviour.</p>
        </div>
        <div className="principle-grid">
          {[
            ["01","Concentration (एकाग्रता)","Sustained interaction with the task","◌"],
            ["02","Self-Confidence (आत्मश्रद्धा)","Self-reported confidence + willingness to attempt","↗"],
            ["03","Perseverance (अध्यवसाय)","Retrying and continuing after mistakes","↻"],
            ["04","Self-Reliance (स्वावलम्बन)","Independent attempts before using support","◇"],
            ["05","Strength of Mind (मनःशक्ति)","Effort on challenging questions + completion","✦"]
          ].map(([n,title,desc,icon]) => (
            <article className="principle-card" key={title}>
              <span className="principle-no">{n}</span>
              <div className="principle-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how section">
        <div className="how-panel">
          <div>
            <span className="kicker">ONE ASSESSMENT. MORE THAN A SCORE.</span>
            <h2>From “What did you get?” to “How did you learn?”</h2>
          </div>
          <div className="steps">
            {["Well-being check","Mind preparation","MCQ challenge","Behaviour signals","Growth report"].map((x,i) =>
              <div className="step" key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
