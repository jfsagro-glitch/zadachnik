const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Для демо-режима отключаем CSP
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Статические файлы
app.use(express.static('public'));

// API Routes с обработкой ошибок
try {
  app.use('/api/demo', require('./src/backend/routes/demo'));
  app.use('/api/tasks', require('./src/backend/routes/tasks'));
  app.use('/api/users', require('./src/backend/routes/users'));
} catch (error) {
  console.error('Ошибка загрузки маршрутов:', error);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// SPA fallback - все остальные маршруты ведут на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CURSOR Pipeline Demo running on port ${PORT}`);
  console.log(`📊 Demo available at:`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - GitHub Codespaces: https://${process.env.CODESPACE_NAME ? process.env.CODESPACE_NAME + '-3000.app.github.dev' : 'localhost:' + PORT}`);
  console.log(`⏰ Session timeout: 6 hours`);
  console.log(`👥 Max concurrent sessions: 10`);
  console.log(`💾 Database: SQLite (demo_sessions.db)`);
  
  // Информация о Codespaces
  if (process.env.CODESPACE_NAME) {
    console.log(`\n🎉 GitHub Codespaces detected!`);
    console.log(`📱 Open the app: https://${process.env.CODESPACE_NAME}-3000.app.github.dev`);
  }
});

