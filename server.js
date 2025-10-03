const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Для демо-режима отключаем CSP
}));
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static('public'));

// API Routes
app.use('/api/demo', require('./src/backend/routes/demo'));
app.use('/api/tasks', require('./src/backend/routes/tasks'));
app.use('/api/users', require('./src/backend/routes/users'));

// SPA fallback - все остальные маршруты ведут на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 CURSOR Pipeline Demo running on port ${PORT}`);
  console.log(`📊 Demo available at: https://cursor-pipeline-demo.glitch.me`);
  console.log(`⏰ Session timeout: 6 hours`);
  console.log(`👥 Max concurrent sessions: 10`);
});

