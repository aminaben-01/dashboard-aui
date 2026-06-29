import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, AlertTriangle, UserCheck, Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Warned() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from Backend API
  useEffect(() => {
    axios.get('http://localhost:8080/api/email-logs')
      .then(res => {setLogs(res.data)})
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Helper to determine email_type based on absence_count and absent_limit
  const getEmailType = (absenceCount, absentLimit) => {
    const percentage = (absenceCount / absentLimit) * 100;
    if (percentage >= 100) return 'Over_100%';
    if (percentage >= 50) return '50%';
    return null;
  };

  

  // Transform logs to include computed fields
  const enrichedLogs = logs.map(log => ({
    ...log,
    
    absence_percentage: Math.round((log.absence_count / log.absent_limit) * 100),
    email_type: getEmailType(log.absence_count, log.absent_limit)
  })).filter(log => log.email_type !== null); // Only show emails that were sent

  // Calculate stats
  const totalEmails = enrichedLogs.length;
  const emails50 = enrichedLogs.filter(log => log.email_type === '50%').length;
  const emails100 = enrichedLogs.filter(log => log.email_type === '100%').length;
  const emailsOver100 = enrichedLogs.filter(log => log.email_type === 'Over_100%').length;

  // Filter search by student ID
  const filteredLogs = enrichedLogs.filter(log =>
    log.sis_student_id.toString().includes(searchTerm)
  );

  return (
  <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
  <Link to='/wf' style={{ textDecoration: 'none' }}>
    <button style={{
      background: '#224188',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background 0.2s'
    }}
    onMouseEnter={e => e.target.style.background = '#1e293b'}
    onMouseLeave={e => e.target.style.background = '#0f172a'}
    >
      📋 Go to WF List →
    </button>
  </Link>
</div>

        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#020814', fontSize: '28px', margin: '0 0 5px 0' }}>Student Attendance Dashboard</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Monitor automated emails sent based on absence thresholds</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={cardStyle}>
            <Users size={24} color="#3b82f6" />
            <div><p style={cardLabel}>Total Emails</p><h3 style={cardValue}>{totalEmails}</h3></div>
          </div>
          <div style={cardStyle}>
            <UserCheck size={24} color="#eab308" />
            <div><p style={cardLabel}>50% Warning</p><h3 style={cardValue}>{emails50}</h3></div>
          </div>
          <div style={cardStyle}>
            <AlertTriangle size={24} color="#f97316" />
            <div><p style={cardLabel}>100% Warning</p><h3 style={cardValue}>{emails100}</h3></div>
          </div>
          <div style={cardStyle}>
            <Mail size={24} color="#ef4444" />
            <div><p style={cardLabel}>Faculty Alerts (&gt;100%)</p><h3 style={cardValue}>{emailsOver100}</h3></div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '300px' }}>
          <Search size={18} color="#94a3b8" style={{ marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search by student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} />
        </div>

        {/* Main Table with Scrollbar */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          maxHeight: '500px',
          overflowY: 'auto',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>Student ID</th>
                <th style={thStyle}>Course ID</th>
                <th style={thStyle}>Absence Rate</th>
                <th style={thStyle}>Alert Type</th>
                <th style={thStyle}>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={`${log.id}-${log.sis_course_id}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tdStyle}>{log.sis_student_id}</td>
                  <td style={tdStyle}>{log.sis_course_id}</td>
                  <td style={tdStyle}>{log.absence_percentage}% ({log.absence_count}/{log.absent_limit})</td>
                  <td style={tdStyle}>{getBadge(log.email_type)}</td>
                  <td style={tdStyle}>{new Date(log.sent_at).toLocaleString('en-US')}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                    {enrichedLogs.length === 0 ? 'No email records found. Please make sure your backend server is running.' : 'No matching students found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}

// Badge color based on alert type
const getBadge = (type) => {
  let styles = { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' };
  if (type === '50%') return <span style={{ ...styles, backgroundColor: '#fef9c3', color: '#a16207' }}>⚠️ 50% Threshold</span>;
  if (type === '100%') return <span style={{ ...styles, backgroundColor: '#ffedd5', color: '#ea580c' }}>⚠️ 100% Critical</span>;
  if (type === 'Over_100%') return <span style={{ ...styles, backgroundColor: '#fee2e2', color: '#dc2626' }}>⚠️ Course Dropped</span>;
  return <span style={{ ...styles, backgroundColor: '#e2e3e5', color: '#383d41' }}>Unknown</span>;
};

// Styles CSS-in-JS
const cardStyle = { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const cardLabel = { margin: 0, color: '#64748b', fontSize: '14px' };
const cardValue = { margin: '5px 0 0 0', color: '#0f172a', fontSize: '24px' };
const thStyle = { padding: '15px', color: '#475569', fontSize: '14px', fontWeight: '600' };
const tdStyle = { padding: '15px', color: '#334155', fontSize: '14px' };
