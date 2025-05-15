module.exports = {
  apps: [
    {
      name: 'chessmate-nextjs',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/chessmate',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'chessmate-websocket',
      script: 'server.ts',
      cwd: '/var/www/chessmate',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
    },
  ],
};
