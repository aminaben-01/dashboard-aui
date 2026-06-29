const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ========== DB 1: attendance_db ==========
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Amina2000',
    database: 'attendance_db'       
});

db.connect((err) => {
    if (err) {
        console.error('Failed attendance_db:', err);
    } else {
        console.log('✅ Connected attendance_db!');
        importStudentsData();
    }
});

// ========== Import JSON => MySQL ==========
function importStudentsData() {
    const filePath = path.join(__dirname, 'students.json');
    
    if (!fs.existsSync(filePath)) {
        console.error('❌ students.json not found at:', filePath);
        return;
    }

    const students = JSON.parse(fs.readFileSync(filePath));

    const shouldHaveFailed = students.filter(s =>
        s.count >= s.absentLimit &&
        s.grade?.trim() !== "WF"
    );

    console.log(`Found ${shouldHaveFailed.length} students who should have failed`);

    const values = shouldHaveFailed.map(s => [
        s.id, s.student_sis_id, s.course_sis_id,
        s.course_name?.trim(), s.instructor_name,
        s.firstName, s.lastName,
        s.count, s.absentLimit,
        s.grade?.trim(), s.seniority,
        s.marked_at, s.attendance
    ]);

    const query = `
        INSERT IGNORE INTO should_have_failed 
        (id, student_sis_id, course_sis_id, course_name, instructor_name, 
         firstName, lastName, count, absentLimit, grade, seniority, marked_at, attendance)
        VALUES ?
    `;

    db.query(query, [values], (err, result) => {
        if (err) console.error('❌ Import error:', err.message);
        else console.log(`✅ Imported ${result.affectedRows} students into should_have_failed`);
    });
}

// ========== API 1: emails ==========
app.get('/api/emails', (req, res) => {
    const query = "SELECT * FROM email_logs ORDER BY sent_at DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 
    });
});

// ========== API 2: should-have-failed ==========
app.get('/api/should-have-failed', (req, res) => {
    const query = "SELECT * FROM should_have_failed ORDER BY (count - absentLimit) DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


const db2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Amina2000',
    database: 'attendance_db'
});

db2.connect((err) => {
    if (err) {
        console.error('Failed :attendance_db', err);
    } else {
        console.log('✅ Connected wf_list!');
    }
});


app.get('/api/wf-records', (req, res) => {
    const query = "SELECT * FROM wf_list ORDER BY request_date DESC";
    db2.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}); 

// ========== Start Server ==========
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});