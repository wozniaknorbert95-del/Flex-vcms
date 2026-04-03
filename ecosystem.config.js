module.exports = {
  apps: [{
    name: 'vcms-core',
    script: 'server.js',
    cwd: '/var/www/vcms/current',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000,
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: '/var/www/vcms/logs/vcms-error.log',
    out_file: '/var/www/vcms/logs/vcms-out.log',
    merge_logs: true,
    env: {
      NODE_ENV: 'production',
      PORT: 8001
    }
  }]
};
