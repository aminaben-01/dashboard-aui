// modal.jsx

export function Modal({ record, onClose }) {
  if (!record) return null;
  
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20
    }} onClick={onClose}>
      <div style={{
        background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 20,
        maxWidth: 500, width: "100%", padding: 28, position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "#f1f5f9",
          border: "none", color: "#475569", fontSize: 16, cursor: "pointer",
          borderRadius: 8, padding: "4px 10px"
        }}>✕</button>
        
        <h3 style={{ fontSize: 18, marginBottom: 20, color: "#0f172a", fontWeight: 800 }}>
          📋 WF Request Details
        </h3>

        <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f8fafc", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" }}>Student ID</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>#{record.student_id}</div>
        </div>

        <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f8fafc", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" }}>Teacher</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{record.teacher_name}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>ID: {record.teacher_id}</div>
        </div>

        <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f8fafc", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" }}>Course</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{record.course}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{record.course_cde}</div>
        </div>

        <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f8fafc", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" }}>Status</div>
          <span style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: record.status === "WF Granted" ? "#dcfce7" :
                       record.status === "SSD" ? "#fee2e2" : "#fef9c3",
            color: record.status === "WF Granted" ? "#16a34a" :
                   record.status === "SSD" ? "#dc2626" : "#a16207",
          }}>
            {record.status === "WF Granted" ? "✅ WF Granted" :
             record.status === "SSD" ? "⚠️ SSD" : "⏳ Pending"}
          </span>
        </div>

        <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f8fafc", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" }}>Absences</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            {record.count} / {record.absent_limit}
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginLeft: 8 }}>
              ({Math.round((record.count / record.absent_limit) * 100)}%)
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f8fafc", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" }}>Request Date</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            {record.request_date ? new Date(record.request_date).toLocaleString('en-US') : "—"}
          </div>
        </div>

        {record.approve_date && (
          <div style={{ marginBottom: 14, padding: "12px 14px", background: "#dcfce7", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "#16a34a", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" }}>Approve Date</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#15803d" }}>
              {new Date(record.approve_date).toLocaleString('en-US')}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export function StatCard({ icon, value, label, color }) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14,
      padding: "20px 24px", flex: 1, minWidth: 140, borderTop: `3px solid ${color}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}>
      <div style={{ fontSize: 26 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
    </div>
  );
}