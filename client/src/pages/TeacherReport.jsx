import { useEffect, useState } from "react";
import { ArrowLeft, BarChart3, Clock3, Download, ShieldCheck, Users, Quote, Sparkles } from "lucide-react";
import { getReports } from "../api";

export default function TeacherReport({ onBack }) {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports().then(data => setReports(data.reports || [])).catch(e => setError(e.message));
  }, []);

  const active = selected || reports[0];

  const learningApproach = (result) => {
    if (!result) return "Learning in progress";
    if (result.independentPct >= 70 && result.retries > 0) return "Independent & persistent";
    if (result.independentPct >= 70) return "Growing independence";
    if (result.retries > 0) return "Keeps trying";
    return "Building confidence";
  };

  return (
    <main className="section teacher-page">
      <div className="teacher-header">
        <div>
          <span className="kicker">TEACHER INSIGHT · DEMO</span>
          <h1>See the learner beyond the marks.</h1>
          <p>Activity signals are presented as observations that can guide encouragement, not psychological diagnoses.</p>
        </div>
        <button className="secondary-btn" onClick={onBack}><ArrowLeft size={16}/> Back to learner</button>
      </div>

      <div className="teacher-philosophy">
        <Quote size={20}/>
        <div>
          <strong>“Education is the manifestation of the perfection already in man.”</strong>
          <span>— Swami Vivekananda · Look for growth, not just results.</span>
        </div>
        <Sparkles size={19}/>
      </div>

      {error && <div className="honesty-note">{error}. Complete a demo assessment first, or restart the backend.</div>}

      {!reports.length ? (
        <div className="empty-teacher">
          <Users size={32}/>
          <h2>No reports yet.</h2>
          <p>Run the Class 6 demo assessment. The completed learning journey will appear here for the teacher.</p>
        </div>
      ) : (
        <>
          <div className="teacher-summary">
            <div className="teacher-stat"><span>Learning journeys</span><strong>{reports.length}</strong><small>completed in this demo</small></div>
            <div className="teacher-stat"><span>Learning approach</span><strong>{learningApproach(active?.result)}</strong><small>based on observed interactions</small></div>
            <div className="teacher-stat"><span>Self-reliance</span><strong>{active?.result?.independentPct >= 70 ? "Growing strong" : "Keep building"}</strong><small>independent thinking before support</small></div>
            <div className="teacher-stat"><span>Perseverance (अध्यवसाय)</span><strong>{active?.result?.retries > 0 ? "Keeps trying" : "Room to practise"}</strong><small>response to challenging questions</small></div>
          </div>

          <div className="teacher-layout">
            <aside className="student-list">
              <span className="kicker">RECENT LEARNERS</span>
              {reports.map((r, i) => (
                <button key={r.id || i} className={active === r ? "student-item active" : "student-item"} onClick={() => setSelected(r)}>
                  <span className="avatar">S</span>
                  <span><b>Student {reports.length - i}</b><small>{new Date(r.createdAt).toLocaleString()}</small></span>
                </button>
              ))}
            </aside>

            <section className="teacher-detail">
              <div className="detail-top">
                <div><span className="kicker">LEARNING BEHAVIOUR REPORT</span><h2>Student activity overview</h2></div>
                <button className="secondary-btn" onClick={() => window.print()}><Download size={15}/> Print</button>
              </div>

              <div className="teacher-pillars">
                <TeacherMetric title="Concentration (एकाग्रता) / engagement" value={active.result.engagementLabel} />
                <TeacherMetric title="Self-Reliance (स्वावलम्बन)" value={active.result.independentPct >= 70 ? "Growing strong" : "Building confidence"} />
                <TeacherMetric title="Perseverance (अध्यवसाय)" value={active.result.retries > 0 ? "Keeps trying" : "Keep practising" } />
                <TeacherMetric title="Strength of Mind (मनःशक्ति)" value={active.result.completed ? "Challenge completed" : "Keep going"} />
              </div>

              <div className="teacher-quote-strip">
                <Quote size={16}/>
                <span>“Arise, awake, and do not stop until the goal is reached.” — Swami Vivekananda</span>
              </div>

              <div className="activity-table-wrap">
                <div className="table-title"><BarChart3 size={17}/> Question-by-question learning activity</div>
                <table>
                  <thead><tr><th>#</th><th>Subject</th><th>Thinking time</th><th>Reconsidered</th><th>Support</th><th>Try again</th><th>Outcome</th></tr></thead>
                  <tbody>
                    {(active.interactions || []).map((x, i) => (
                      <tr key={i}>
                        <td>{i+1}</td><td>{x.subject}</td><td><Clock3 size={13}/> {Math.max(1, Math.round(x.timeToFinalAnswer/1000))}s</td>
                        <td>{x.changedAnswer ? "Yes" : "No"}</td><td>{x.hintUsed ? "Used" : "Not needed"}</td><td>{x.retryCount > 0 ? `${x.retryCount} time${x.retryCount > 1 ? "s" : ""}` : "Not needed"}</td><td className={x.isCorrect ? "good" : "neutral"}>{x.isCorrect ? "Correct" : x.skipped ? "Skipped" : "Not correct"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="teacher-note"><ShieldCheck size={18}/><p><b>Privacy note:</b> This report contains only assessment interaction data and learner self-reflections. No webcam, facial recognition, eye tracking or microphone data is collected.</p></div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

function TeacherMetric({ title, value }) {
  return <div className="teacher-metric"><span>{title}</span><strong>{value}</strong></div>;
}
