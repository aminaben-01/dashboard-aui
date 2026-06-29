// WFDashboard.jsx
import { useState, useEffect, useMemo } from "react";
import { Modal, StatCard } from "./components/modal";

export default function WFDashboard({ onBack }) {
  const [wfData, setWfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/wf-records")
      .then(r => r.json())
      .then(data => { setWfData(data); setLoading(false); })
      .catch(err => { console.error("Error fetching WF data:", err); setLoading(false); });
  }, []);

  const stats = useMemo(() => ({
    total: wfData.length,
    dropped: wfData.filter(w => w.status === "Dropped").length,
    wf_granted: wfData.filter(w => w.status === "WF Granted").length,
    pending: wfData.filter(w => w.status === "Pending").length,
  }), [wfData]);

  const filtered = useMemo(() => {
    let data = wfData;
    if (filter === "dropped") data = data.filter(w => w.status === "Dropped");
    if (filter === "wf") data = data.filter(w => w.status === "WF Granted");
    if (filter === "pending") data = data.filter(w => w.status === "Pending");
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(w =>
        String(w.student_id).includes(q) ||
        w.course_id?.toLowerCase().includes(q) ||
        w.reason?.toLowerCase().includes(q)
      );
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [wfData, filter, search]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Segoe UI, sans-serif", color: "#0f172a" }}>
      <div style={{
        background: "#ffffff", borderBottom: "1px solid #e2e8f0",
        padding: "20px 36px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {onBack && (
            <button onClick={onBack} style={{
              background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#334155",
              cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "8px 16px",
              borderRadius: 8, transition: "all 0.15s"
            }} onMouseEnter={e => e.target.style.background = "#e2e8f0"}
               onMouseLeave={e => e.target.style.background = "#f1f5f9"}>
              ← Back
            </button>
          )}
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "#7C3AED15",
            border: "1px solid #7C3AED30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>📋</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              WF / Withdraw-Fail Dashboard
            </h1>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>
              {wfData.length} total requests · {stats.wf_granted} WF granted
            </div>
          </div>
        </div>
      </div>


      <div style={{ padding: "28px 36px", maxWidth: 1300 }}>
        {loading ? (
          <div style={{ color: "#64748b", padding: 40, textAlign: "center" }}>Loading WF data...</div>
        ) : (
          <>
            {/* STATS*/}
            <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
              <StatCard icon="📊" value={stats.total} label="Total Requests" color="#6366F1" />
              <StatCard icon="⚠️" value={stats.dropped} label="Dropped" color="#EF4444" />
              <StatCard icon="✅" value={stats.wf_granted} label="WF Granted" color="#10B981" />
              <StatCard icon="⏳" value={stats.pending} label="Pending" color="#F59E0B" />
            </div>

            {/* CONTROLS */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by student ID, course, or reason..."
                  style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#ffffff", color: "#0f172a", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              {[
                { k: "all", label: `All (${stats.total})` },
                { k: "dropped", label: `🚨 Dropped (${stats.dropped})` },
                { k: "wf", label: `✅ WF Granted (${stats.wf_granted})` },
                { k: "pending", label: `⏳ Pending (${stats.pending})` },
              ].map(t => (
                <button key={t.k} onClick={() => setFilter(t.k)} style={{
                  padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: filter === t.k ? "#0f172a" : "#ffffff",
                  color: filter === t.k ? "#ffffff" : "#475569",
                  border: `1px solid ${filter === t.k ? "transparent" : "#e2e8f0"}`,
                  cursor: "pointer", transition: "all 0.15s"
                }}>{t.label}</button>
              ))}
            </div>

            {/* TABLE */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", background: "#f1f5f9" }}>
                    <th style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Student ID</th>
                    <th style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Course</th>
                    <th style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Status</th>
                    <th style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Request Date</th>
                    <th style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No WF records found.</td>
                    </tr>
                  )}
                  {filtered.map((record, idx) => (
                    <tr key={idx} onClick={() => setSelected(record)}
                      style={{ borderBottom: "1px solid #e2e8f0", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>#{record.student_id}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{record.course_id}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: record.status === "WF Granted" ? "#dcfce7" :
                                     record.status === "Dropped" ? "#fee2e2" : "#fef9c3",
                          color: record.status === "WF Granted" ? "#16a34a" :
                                 record.status === "Dropped" ? "#dc2626" : "#a16207",
                          border: `1px solid ${record.status === "WF Granted" ? "#86efac" :
                                            record.status === "Dropped" ? "#fca5a5" : "#fde047"}`
                        }}>
                          {record.status === "WF Granted" ? "✅ WF Granted" :
                           record.status === "Dropped" ? "🚨 Dropped" : "⏳ Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#64748b" }}>{record.date}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", maxWidth: 300 }}>
                        {record.reason?.substring(0, 50)}{record.reason?.length > 50 ? "..." : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "10px 14px", borderTop: "1px solid #e2e8f0", fontSize: 11, color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                <span>Showing {filtered.length} of {wfData.length} records</span>
                <span>Click any row for details →</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selected && <Modal record={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
