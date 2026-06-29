import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function ShouldHaveFailed() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/should-have-failed')
      .then(r => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then(d => { 
        setData(d); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Error fetching data:', err); 
        setLoading(false); 
      });
  }, []);

  // Extract unique grades from data
  const grades = useMemo(() => {
    const unique = new Set(data.map(s => s.grade).filter(Boolean));
    return Array.from(unique).sort();
  }, [data]);

  // Filter data based on search and grade filter
  const filtered = useMemo(() => {
    let d = data;
    
    if (filterGrade !== 'all') {
      d = d.filter(s => s.grade === filterGrade);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      d = d.filter(s =>
        String(s.student_sis_id).toLowerCase().includes(q) ||
        s.firstName?.toLowerCase().includes(q) ||
        s.lastName?.toLowerCase().includes(q) ||
        s.course_sis_id?.toLowerCase().includes(q) ||
        s.instructor_name?.toLowerCase().includes(q)
      );
    }
    
    return d;
  }, [data, search, filterGrade]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: data.length,
    byGrade: grades.map(g => ({ 
      grade: g, 
      count: data.filter(s => s.grade === g).length 
    }))
  }), [data, grades]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle grade filter change
  const handleGradeChange = (e) => {
    setFilterGrade(e.target.value);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>Loading...</div>
          <div style={{ fontSize: 14 }}>Please wait while we fetch the data</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '20px 36px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 14 
      }}>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            color: '#334155',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          >
            ← Back
          </button>
        </Link>
        <div style={{ 
          width: 36, 
          height: 36, 
          borderRadius: 10, 
          background: '#EF444415', 
          border: '1px solid #EF444430', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: 16 
        }}>
          ⚠️
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Should Have Failed
          </h1>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
            Students who exceeded absence limit but were not given WF
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 36px', maxWidth: 1300, margin: '0 auto' }}>
        {/* STATS */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ 
            background: '#fff', 
            border: '1px solid #e2e8f0', 
            borderTop: '3px solid #6366F1', 
            borderRadius: 14, 
            padding: '20px 24px', 
            flex: 1, 
            minWidth: 140 
          }}>
            <div style={{ fontSize: 26 }}>👥</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
              {stats.total}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
              Total Students
            </div>
          </div>
          {stats.byGrade.map(g => (
            <div key={g.grade} style={{ 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderTop: '3px solid #F59E0B', 
              borderRadius: 14, 
              padding: '20px 24px', 
              flex: 1, 
              minWidth: 100 
            }}>
              <div style={{ fontSize: 26 }}>📊</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
                {g.count}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                Grade {g.grade}
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div style={{ 
          display: 'flex', 
          gap: 10, 
          marginBottom: 16, 
          flexWrap: 'wrap', 
          alignItems: 'center' 
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8' 
            }}>
              🔍
            </span>
            <input 
              value={search} 
              onChange={handleSearchChange}
              placeholder="Search by name, ID, course, or instructor..."
              style={{ 
                width: '100%', 
                padding: '9px 12px 9px 36px', 
                borderRadius: 8, 
                border: '1px solid #e2e8f0', 
                background: '#fff', 
                color: '#0f172a', 
                fontSize: 13, 
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
              onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>
          <select 
            value={filterGrade} 
            onChange={handleGradeChange}
            style={{ 
              padding: '9px 16px', 
              borderRadius: 8, 
              border: '1px solid #e2e8f0', 
              background: '#fff', 
              color: '#475569', 
              fontSize: 13, 
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
            onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <option value="all">All Grades</option>
            {grades.map(g => (
              <option key={g} value={g}>Grade: {g}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div style={{ 
          background: '#fff', 
          border: '1px solid #e2e8f0', 
          borderRadius: 14, 
          overflow: 'hidden', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                {['Student ID', 'Name', 'Course', 'Instructor', 'Absences', 'Grade', 'Seniority'].map(h => (
                  <th key={h} style={{ 
                    padding: '13px 14px', 
                    textAlign: 'left', 
                    fontSize: 11, 
                    fontWeight: 700, 
                    color: '#475569', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                    No records found matching your criteria.
                  </td>
                </tr>
              )}
              {filtered.map((s, idx) => (
                <tr key={`${s.student_sis_id}-${idx}`}
                  style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#334155' }}>
                    #{s.student_sis_id}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#0f172a', fontWeight: 600 }}>
                    {s.firstName} {s.lastName}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#475569' }}>
                    {s.course_sis_id}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#475569' }}>
                    {s.instructor_name}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 9px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5'
                    }}>
                      {s.count} / {s.absentLimit}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 9px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#fef9c3',
                      color: '#a16207',
                      border: '1px solid #fde047'
                    }}>
                      {s.grade}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>
                    {s.seniority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ 
            padding: '10px 14px', 
            borderTop: '1px solid #e2e8f0', 
            fontSize: 11, 
            color: '#94a3b8', 
            display: 'flex', 
            justifyContent: 'space-between' 
          }}>
            <span>Showing {filtered.length} of {data.length} records</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}