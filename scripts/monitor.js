const { exec } = require('child_process');
const { logger } = require('../src/lib/logger');

// システムリソースの監視
function checkSystemResources() {
  exec('wmic cpu get loadpercentage', (error, stdout) => {
    if (!error) {
      const cpuLoad = parseInt(stdout.split('\n')[1]);
      if (cpuLoad > 80) {
        logger.warn(`High CPU usage detected: ${cpuLoad}%`);
      }
    }
  });

  exec('wmic os get freephysicalmemory,totalvisiblememory', (error, stdout) => {
    if (!error) {
      const [total, free] = stdout.split('\n')[1].split(/\s+/);
      const usedPercent = ((total - free) / total) * 100;
      if (usedPercent > 80) {
        logger.warn(`High memory usage detected: ${usedPercent.toFixed(2)}%`);
      }
    }
  });

  exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
    if (!error) {
      const lines = stdout.split('\n').slice(1);
      lines.forEach(line => {
        const [drive, free, total] = line.split(/\s+/);
        if (free && total) {
          const usedPercent = ((total - free) / total) * 100;
          if (usedPercent > 90) {
            logger.warn(`Low disk space on ${drive}: ${usedPercent.toFixed(2)}%`);
          }
        }
      });
    }
  });
}

// データベース接続の監視
function checkDatabaseConnection() {
  const Database = require('better-sqlite3');
  try {
    const db = new Database(process.env.DATABASE_PATH);
    db.prepare('SELECT 1').get();
    db.close();
  } catch (error) {
    logger.error('Database connection failed:', error);
  }
}

// アプリケーションの監視
function monitorApplication() {
  checkSystemResources();
  checkDatabaseConnection();
}

// 5分ごとに監視を実行
setInterval(monitorApplication, 5 * 60 * 1000);
monitorApplication();