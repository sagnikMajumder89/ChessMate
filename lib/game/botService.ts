import { spawn } from "child_process";

// Add move parsing function based on search results [1][2]
function parseBestMove(moveStr: string): {
  from: string;
  to: string;
  promotion: string;
} {
  const match = moveStr.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?$/);
  if (!match) {
    throw new Error(`Invalid move format: ${moveStr}`);
  }
  return {
    from: match[1],
    to: match[2],
    promotion: match[3] || "",
  };
}

async function getBestMove(
  fen: string
): Promise<{ from: string; to: string; promotion: string }> {
  return new Promise((resolve, reject) => {
    const engine = spawn("stockfish");
    let buffer = "";
    let isReady = false;
    const timeout = setTimeout(() => {
      engine.kill();
      reject("Stockfish timeout after 10 seconds");
    }, 10000);

    engine.stdin.write("uci\n");

    engine.stdout.on("data", (data) => {
      buffer += data.toString();

      if (!isReady) {
        if (buffer.includes("uciok")) {
          isReady = true;
          buffer = "";
          engine.stdin.write(`position fen ${fen}\n`);
          engine.stdin.write("go depth 15\n");
        }
        return;
      }

      const match = buffer.match(/bestmove\s(\w+)/);
      if (match) {
        clearTimeout(timeout);
        engine.stdin.write("quit\n");
        resolve(parseBestMove(match[1]));
      }
    });

    engine.stderr.on("data", (err) => {
      clearTimeout(timeout);
      reject(err.toString());
    });
  });
}

// Update return type signature
export async function getBestMoveForPosition(
  fen: string
): Promise<{ from: string; to: string; promotion: string }> {
  try {
    const bestMove = await getBestMove(fen);
    return bestMove;
  } catch (error) {
    console.error("Error getting best move:", error);
    throw error;
  }
}
