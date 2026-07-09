const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// 🔓 ปลดล็อกการเชื่อมต่อข้ามพอร์ต (CORS) เพื่อให้หน้าบ้านพอร์ต 8080 คุยกับหลังบ้านพอร์ต 3000 ได้
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ดึงค่าการตั้งค่าฐานข้อมูลจาก docker-compose.yml
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// ฟังก์ชันสร้างตารางหนังสืออัตโนมัติเมื่อเปิดเครื่อง (อิงตามฟิลด์ที่โจทย์กำหนด)
const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                isbn VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                year INT NOT NULL,
                status VARCHAR(50) NOT NULL
            );
        `);
        console.log("⚡ สร้างตารางข้อมูลหนังสือสำเร็จหรือมีอยู่แล้ว");
    } catch (err) {
        console.error("❌ ไม่สามารถสร้างตารางได้:", err);
    }
};
initDatabase();

// 1. API: ดึงข้อมูลหนังสือทั้งหมด (GET)
app.get('/api/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 2. API: เพิ่มข้อมูลหนังสือใหม่ (POST)
app.post('/api/books', async (req, res) => {
    const { isbn, title, author, category, year, status } = req.body;
    try {
        await pool.query(
            'INSERT INTO books (isbn, title, author, category, year, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [isbn, title, author, category, year, status]
        );
        res.status(201).send("บันทึกข้อมูลสำเร็จ");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 3. API: ลบข้อมูลหนังสือ (DELETE)
app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM books WHERE id = $1', [id]);
        res.send("ลบข้อมูลสำเร็จ");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log('🚀 Backend API กำลังทำงานที่พอร์ต 3000'));