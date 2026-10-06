const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function generateQuestions({ level, count = 12 }) {
  const res = await fetch(`${API}/questions/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level, count })
  });
  if (!res.ok) throw new Error("Could not generate the assessment.");
  return res.json();
}

export async function saveReport(report) {
  const res = await fetch(`${API}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report)
  });
  if (!res.ok) throw new Error("Could not save the report.");
  return res.json();
}

export async function getReports() {
  const res = await fetch(`${API}/reports`);
  if (!res.ok) throw new Error("Could not load teacher reports.");
  return res.json();
}
