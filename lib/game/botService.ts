import { spawn } from 'child_process';

function getBestMove(fen: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const engine = spawn('stockfish');
    engine.stdin.write('uci\n');
    engine.stdin.write(`position fen ${fen}\n`);
    engine.stdin.write('go depth 3\n');

    engine.stdout.on('data', (data) => {
      const output = data.toString();
      const match = output.match(/bestmove\s(\w+)/);
      if (match) {
        engine.kill();
        resolve(match[1]);
      }
    });

    engine.stderr.on('data', (err) => reject(err.toString()));
  });
}

export async function getBestMoveForPosition(fen: string): Promise<string> {
  try {
    const bestMove = await getBestMove(fen);
    return bestMove;
  } catch (error) {
    console.error('Error getting best move:', error);
    throw error;
  }
}