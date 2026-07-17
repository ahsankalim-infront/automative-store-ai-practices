"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const W = 300;
const H = 360;
const LANES = 3;
const LANE_W = W / LANES;
const PLAYER_Y = H - 58;
const PLAYER_H = 58;
const PLAYER_W = 40;
const OB_H = 58;
const OB_W = 40;

interface Obstacle {
  lane: number;
  y: number;
  hue: number;
}

type CarFacing = "up" | "down";

interface CarDrawOptions {
  facing: CarFacing;
  highlight?: boolean;
  hue?: number;
}

/** Top-down sedan — matches reference bird's-eye car shape, nose points "up". */
function drawTopDownSedan(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  options: CarDrawOptions
) {
  const { facing, highlight, hue = 38 } = options;

  ctx.save();
  ctx.translate(cx, cy);
  if (facing === "down") ctx.scale(1, -1);

  const hw = w / 2;
  const hh = h / 2;

  const body = highlight ? "#ffb300" : `hsl(${hue}, 88%, 52%)`;
  const bodyDark = highlight ? "#e69500" : `hsl(${hue}, 82%, 42%)`;
  const bodyLight = highlight ? "#ffd54f" : `hsl(${hue}, 90%, 62%)`;
  const glass = "#2d3436";
  const glassGrad = ctx.createLinearGradient(0, -hh, 0, hh);
  glassGrad.addColorStop(0, "#3d4852");
  glassGrad.addColorStop(1, "#1e272e");

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(0, hh * 0.08, hw * 0.92, hh * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Side mirrors
  ctx.fillStyle = body;
  ctx.strokeStyle = bodyDark;
  ctx.lineWidth = 0.8;
  const mirrorY = -hh * 0.22;
  ctx.beginPath();
  ctx.moveTo(-hw * 1.02, mirrorY - hh * 0.04);
  ctx.lineTo(-hw * 0.88, mirrorY + hh * 0.04);
  ctx.lineTo(-hw * 0.78, mirrorY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(hw * 1.02, mirrorY - hh * 0.04);
  ctx.lineTo(hw * 0.88, mirrorY + hh * 0.04);
  ctx.lineTo(hw * 0.78, mirrorY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Main body — rounded rect, wider at front
  const bodyGrad = ctx.createLinearGradient(-hw, 0, hw, 0);
  bodyGrad.addColorStop(0, bodyDark);
  bodyGrad.addColorStop(0.2, body);
  bodyGrad.addColorStop(0.5, bodyLight);
  bodyGrad.addColorStop(0.8, body);
  bodyGrad.addColorStop(1, bodyDark);

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-hw * 0.72, -hh * 0.96);
  ctx.quadraticCurveTo(0, -hh * 1.02, hw * 0.72, -hh * 0.96);
  ctx.quadraticCurveTo(hw * 0.92, -hh * 0.55, hw * 0.9, 0);
  ctx.quadraticCurveTo(hw * 0.88, hh * 0.72, hw * 0.65, hh * 0.94);
  ctx.quadraticCurveTo(0, hh * 1.0, -hw * 0.65, hh * 0.94);
  ctx.quadraticCurveTo(-hw * 0.88, hh * 0.72, -hw * 0.9, 0);
  ctx.quadraticCurveTo(-hw * 0.92, -hh * 0.55, -hw * 0.72, -hh * 0.96);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Front bumper / headlight strip
  ctx.fillStyle = "#9ca3af";
  ctx.beginPath();
  ctx.roundRect(-hw * 0.68, -hh * 0.94, hw * 1.36, hh * 0.1, 3);
  ctx.fill();
  ctx.fillStyle = "#fef9c3";
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(-hw * 0.48, -hh * 0.88, hw * 0.1, hh * 0.035, 0, 0, Math.PI * 2);
  ctx.ellipse(hw * 0.48, -hh * 0.88, hw * 0.1, hh * 0.035, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Windshield
  ctx.fillStyle = glassGrad;
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-hw * 0.62, -hh * 0.78);
  ctx.lineTo(hw * 0.62, -hh * 0.78);
  ctx.lineTo(hw * 0.52, -hh * 0.48);
  ctx.lineTo(-hw * 0.52, -hh * 0.48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Rear window
  ctx.beginPath();
  ctx.moveTo(-hw * 0.5, hh * 0.48);
  ctx.lineTo(hw * 0.5, hh * 0.48);
  ctx.lineTo(hw * 0.42, hh * 0.72);
  ctx.lineTo(-hw * 0.42, hh * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Side windows + center pillar (B-pillar)
  const drawSideWindows = (side: -1 | 1) => {
    const x = side * hw * 0.78;
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.moveTo(x, -hh * 0.38);
    ctx.lineTo(x + side * hw * 0.02, -hh * 0.38);
    ctx.lineTo(x + side * hw * 0.02, -hh * 0.08);
    ctx.lineTo(x, -hh * 0.08);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, hh * 0.06);
    ctx.lineTo(x + side * hw * 0.02, hh * 0.06);
    ctx.lineTo(x + side * hw * 0.02, hh * 0.38);
    ctx.lineTo(x, hh * 0.38);
    ctx.closePath();
    ctx.fill();
    // B-pillar
    ctx.fillStyle = body;
    ctx.fillRect(side * hw * 0.74, -hh * 0.02, side * hw * 0.08, hh * 0.1);
  };
  drawSideWindows(-1);
  drawSideWindows(1);

  // Roof highlight
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.moveTo(-hw * 0.18, -hh * 0.35);
  ctx.lineTo(hw * 0.18, -hh * 0.35);
  ctx.lineTo(hw * 0.12, hh * 0.35);
  ctx.lineTo(-hw * 0.12, hh * 0.35);
  ctx.closePath();
  ctx.fill();

  // Taillights
  ctx.fillStyle = highlight ? "#ef4444" : `hsl(${(hue + 180) % 360}, 75%, 48%)`;
  ctx.beginPath();
  ctx.roundRect(-hw * 0.62, hh * 0.82, hw * 0.22, hh * 0.08, 2);
  ctx.roundRect(hw * 0.4, hh * 0.82, hw * 0.22, hh * 0.08, 2);
  ctx.fill();

  ctx.restore();
}

interface MiniCarGameProps {
  autoStart?: boolean;
  className?: string;
}

export function MiniCarGame({ autoStart = false, className }: MiniCarGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tickRef = useRef(0);
  const stateRef = useRef({
    running: false,
    gameOver: false,
    playerLane: 1,
    obstacles: [] as Obstacle[],
    score: 0,
    speed: 2.4,
    spawnTimer: 0,
    spawnEvery: 52,
  });

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);

  const syncUi = useCallback((s: typeof stateRef.current) => {
    setScore(s.score);
    setGameOver(s.gameOver);
    setRunning(s.running);
  }, []);

  const resetGame = useCallback(() => {
    stateRef.current = {
      running: true,
      gameOver: false,
      playerLane: 1,
      obstacles: [],
      score: 0,
      speed: 2.4,
      spawnTimer: 0,
      spawnEvery: 52,
    };
    syncUi(stateRef.current);
  }, [syncUi]);

  const startGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const moveLane = useCallback((dir: -1 | 1) => {
    const s = stateRef.current;
    if (!s.running || s.gameOver) return;
    s.playerLane = Math.max(0, Math.min(LANES - 1, s.playerLane + dir));
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;

    if (s.running && !s.gameOver) {
      s.spawnTimer += 1;
      if (s.spawnTimer >= s.spawnEvery) {
        s.spawnTimer = 0;
        s.spawnEvery = Math.max(28, s.spawnEvery - 0.15);
        const lane = Math.floor(Math.random() * LANES);
        s.obstacles.push({ lane, y: -OB_H, hue: Math.random() * 360 });
      }

      for (const ob of s.obstacles) {
        ob.y += s.speed;
      }
      s.obstacles = s.obstacles.filter((ob) => ob.y < H + OB_H);

      for (const ob of s.obstacles) {
        if (
          ob.lane === s.playerLane &&
          ob.y + OB_H > PLAYER_Y - PLAYER_H / 2 &&
          ob.y < PLAYER_Y + PLAYER_H / 2
        ) {
          s.gameOver = true;
          s.running = false;
          syncUi(s);
        }
      }

      s.score += 1;
      s.speed = Math.min(5.5, s.speed + 0.0008);
      if (s.score % 15 === 0) syncUi(s);
    }

    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#1a1a2e");
    grad.addColorStop(1, "#16213e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i <= LANES; i++) {
      const x = i * LANE_W;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 14]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let y = (tickRef.current * 3) % 40; y < H; y += 40) {
      for (let lane = 0; lane < LANES; lane++) {
        ctx.fillRect(lane * LANE_W + LANE_W / 2 - 2, y, 4, 18);
      }
    }

    for (const ob of s.obstacles) {
      drawTopDownSedan(
        ctx,
        ob.lane * LANE_W + LANE_W / 2,
        ob.y + OB_H / 2,
        OB_W,
        OB_H,
        {
          facing: "down",
          hue: ob.hue,
        }
      );
    }

    drawTopDownSedan(
      ctx,
      s.playerLane * LANE_W + LANE_W / 2,
      PLAYER_Y,
      PLAYER_W,
      PLAYER_H,
      {
        facing: "up",
        highlight: true,
      }
    );

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(8, 8, 88, 28);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillText(`Score ${s.score}`, 16, 27);

    if (s.gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Crashed!", W / 2, H / 2 - 12);
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 12);
      ctx.textAlign = "left";
    } else if (!s.running) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Tap Play to start", W / 2, H / 2);
      ctx.textAlign = "left";
    }

    tickRef.current += 1;
    animRef.current = requestAnimationFrame(drawFrame);
  }, [syncUi]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawFrame]);

  useEffect(() => {
    if (autoStart) startGame();
  }, [autoStart, startGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveLane(-1);
      if (e.key === "ArrowRight") moveLane(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLane]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative rounded-xl overflow-hidden border border-border bg-black shadow-inner">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto block touch-none select-none"
          aria-label="Mini car dodge game"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={() => moveLane(-1)}
          aria-label="Move left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {!running || gameOver ? (
          <Button type="button" className="flex-1 font-bold" onClick={startGame}>
            {gameOver ? (
              <>
                <RotateCcw className="h-4 w-4" />
                Play again
              </>
            ) : (
              "Play"
            )}
          </Button>
        ) : (
          <div className="flex-1 text-center text-xs font-semibold text-muted-foreground py-2">
            Score: {score}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={() => moveLane(1)}
          aria-label="Move right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground leading-snug">
        Dodge traffic · Use arrows or buttons
      </p>
    </div>
  );
}
