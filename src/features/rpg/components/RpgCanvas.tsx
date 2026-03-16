import { useEffect, useMemo, useRef, useState } from 'react';
import { withBase } from '@/utils/paths';
import { TILE_COLORS } from '@/features/rpg/config/tiles';
import { PLAYER_SIZE, PLAYER_SPEED } from '@/features/rpg/config/constants';
import { getScene } from '@/features/rpg/core/sceneManager';
import { isBlocked } from '@/features/rpg/core/collision';
import { getInteractableInFront } from '@/features/rpg/core/interaction';
import { resolveMovement, isInteractKey } from '@/features/rpg/core/input';
import { createPlayer, getPlayerRect } from '@/features/rpg/entities/player';
import { dialogs } from '@/features/rpg/ui/dialogs';
import HintBar from '@/features/rpg/components/HintBar';
import DialogPanel from '@/features/rpg/components/DialogPanel';
import SceneTitle from '@/features/rpg/components/SceneTitle';
import { SCENE_META } from '@/features/rpg/config/sceneMeta';

function drawSceneLabels(context: CanvasRenderingContext2D, sceneName: string) {
  context.save();
  context.fillStyle = 'rgba(47, 42, 36, 0.78)';
  context.font = '600 12px ui-serif, serif';
  context.textAlign = 'left';
  context.fillText(sceneName, 18, 26);
  context.restore();
}

export default function RpgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const promptRef = useRef('WASD 移动 · E 交互');
  const nearbyNameRef = useRef('');

  const [sceneId, setSceneId] = useState<'hall' | 'library' | 'gameRoom'>('hall');
  const [spawnId, setSpawnId] = useState('start');
  const [prompt, setPrompt] = useState('WASD 移动 · E 交互');
  const [dialogText, setDialogText] = useState('');
  const [nearbyName, setNearbyName] = useState('附近没有可交互物件');

  const scene = useMemo(() => getScene(sceneId), [sceneId]);
  const sceneMeta = SCENE_META[sceneId];
  const playerRef = useRef(
    createPlayer(scene.spawnPoints[spawnId]?.x ?? 80, scene.spawnPoints[spawnId]?.y ?? 80)
  );

  useEffect(() => {
    const spawn = scene.spawnPoints[spawnId] ?? Object.values(scene.spawnPoints)[0];
    playerRef.current = createPlayer(spawn.x, spawn.y);
  }, [scene, spawnId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      pressedKeysRef.current.add(key);

      if (isInteractKey(key)) {
        const interactable = getInteractableInFront(
          getPlayerRect(playerRef.current),
          playerRef.current.facing,
          scene.interactables
        );

        if (!interactable) return;

        const action = interactable.action;

        if (action.kind === 'scene') {
          setSceneId(action.toSceneId as 'hall' | 'library' | 'gameRoom');
          setSpawnId(action.spawnId ?? 'start');
          setDialogText('');
        } else if (action.kind === 'route') {
          window.location.href = withBase(action.to);
        } else if (action.kind === 'dialog') {
          setDialogText(dialogs[action.dialogId] ?? '这里还没有文字说明。');
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const movement = resolveMovement(pressedKeysRef.current);
      const player = playerRef.current;

      if (movement.dx !== 0 || movement.dy !== 0) {
        player.facing = movement.facing;

        const nextXRect = {
          x: player.x + movement.dx * PLAYER_SPEED * delta,
          y: player.y,
          w: PLAYER_SIZE,
          h: PLAYER_SIZE,
        };

        if (!isBlocked(nextXRect, scene.width, scene.height, scene.obstacles, scene.interactables)) {
          player.x = nextXRect.x;
        }

        const nextYRect = {
          x: player.x,
          y: player.y + movement.dy * PLAYER_SPEED * delta,
          w: PLAYER_SIZE,
          h: PLAYER_SIZE,
        };

        if (!isBlocked(nextYRect, scene.width, scene.height, scene.obstacles, scene.interactables)) {
          player.y = nextYRect.y;
        }
      }

      const nearby = getInteractableInFront(
        getPlayerRect(player),
        player.facing,
        scene.interactables
      );
      const nextPrompt = nearby?.prompt ?? 'WASD 移动 · E 交互';
      const nextNearbyName = nearby?.name ?? '附近没有可交互物件';

      if (promptRef.current !== nextPrompt) {
        promptRef.current = nextPrompt;
        setPrompt(nextPrompt);
      }

      if (nearbyNameRef.current !== nextNearbyName) {
        nearbyNameRef.current = nextNearbyName;
        setNearbyName(nextNearbyName);
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = TILE_COLORS[scene.baseTile] ?? '#efe6d8';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = 'rgba(255, 255, 255, 0.16)';
      for (let y = 0; y < scene.height; y += scene.tileSize * 2) {
        context.fillRect(0, y, scene.width, 1);
      }

      context.strokeStyle = 'rgba(120, 105, 90, 0.12)';
      for (let x = 0; x <= scene.width; x += scene.tileSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, scene.height);
        context.stroke();
      }
      for (let y = 0; y <= scene.height; y += scene.tileSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(scene.width, y);
        context.stroke();
      }

      scene.decorations.forEach((item) => {
        context.fillStyle = item.color ?? '#d9cfbf';
        context.fillRect(item.x, item.y, item.w, item.h);
      });

      scene.obstacles.forEach((item) => {
        context.fillStyle = 'rgba(47, 42, 36, 0.08)';
        context.fillRect(item.x + 3, item.y + 4, item.w, item.h);
        context.fillStyle = item.color ?? '#9a856f';
        context.fillRect(item.x, item.y, item.w, item.h);
      });

      scene.interactables.forEach((item) => {
        context.fillStyle = item.color ?? '#6f7f72';
        context.fillRect(item.x, item.y, item.w, item.h);

        context.fillStyle = 'rgba(255, 255, 255, 0.22)';
        context.fillRect(item.x + 3, item.y + 3, Math.max(item.w - 6, 4), 4);

        if (nearby?.id === item.id) {
          context.strokeStyle = '#ffffff';
          context.lineWidth = 2;
          context.strokeRect(item.x + 2, item.y + 2, item.w - 4, item.h - 4);
        }
      });

      context.fillStyle = '#2f2a24';
      context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

      context.fillStyle = '#fbf8f2';
      const eyeX =
        player.facing === 'left' ? player.x + 5 : player.facing === 'right' ? player.x + 15 : player.x + 10;
      const eyeY = player.facing === 'up' ? player.y + 5 : player.y + 9;
      context.fillRect(eyeX, eyeY, 4, 4);

      drawSceneLabels(context, scene.name);

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => cancelAnimationFrame(frame);
  }, [scene]);

  return (
    <div className="rpg-root">
      <div className="scene-head">
        <SceneTitle title={scene.name} />
        <div className="scene-badge">{sceneMeta.label}</div>
      </div>

      <div className="canvas-layout">
        <div className="canvas-stage card-surface">
          <canvas ref={canvasRef} width={scene.width} height={scene.height} className="rpg-canvas" />
        </div>

        <aside className="scene-panel">
          <div className="hud-card card-surface">
            <p className="hud-kicker">当前房间</p>
            <h3>{scene.name}</h3>
            <p>{sceneMeta.description}</p>
          </div>

          <div className="hud-card card-surface">
            <p className="hud-kicker">附近物件</p>
            <h3>{nearbyName}</h3>
            <p>{prompt}</p>
          </div>

          <div className="hud-card card-surface">
            <p className="hud-kicker">房间气质</p>
            <h3>{sceneMeta.mood}</h3>
            <ul>
              {sceneMeta.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <HintBar sceneName={scene.name} prompt={prompt} />

      <div className="scene-directory">
        {Object.entries(SCENE_META).map(([key, meta]) => (
          <div key={key} className={`directory-card card-surface ${sceneId === key ? 'active' : ''}`}>
            <p className="hud-kicker">{meta.label}</p>
            <strong>{key === 'hall' ? '大厅' : key === 'library' ? '图书馆' : '游戏室'}</strong>
            <span>{meta.description}</span>
          </div>
        ))}
      </div>

      {dialogText && <DialogPanel text={dialogText} onClose={() => setDialogText('')} />}

      <style>{`
        .rpg-root {
          display: grid;
          gap: 1rem;
        }

        .scene-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .scene-title {
          margin: 0;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.875rem;
        }

        .scene-badge {
          display: inline-flex;
          align-items: center;
          min-height: 2.1rem;
          padding: 0 0.8rem;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: color-mix(in srgb, var(--panel-strong) 88%, white 12%);
          color: var(--text-muted);
          font-size: 0.82rem;
        }

        .canvas-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(17rem, 0.55fr);
          gap: 1rem;
          align-items: start;
        }

        .canvas-stage,
        .hud-card,
        .directory-card,
        .dialog-panel {
          position: relative;
        }

        .canvas-stage,
        .hud-card,
        .directory-card {
          padding: 0.85rem;
        }

        .canvas-stage::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .rpg-canvas {
          display: block;
          width: 100%;
          height: auto;
          border: 1px solid var(--line);
          border-radius: calc(var(--radius) - 6px);
          background: var(--panel);
        }

        .scene-panel {
          display: grid;
          gap: 0.9rem;
        }

        .hud-card > *,
        .directory-card > * {
          position: relative;
          z-index: 1;
        }

        .hud-card {
          display: grid;
          gap: 0.45rem;
        }

        .hud-card h3,
        .hud-card p,
        .hud-card ul,
        .directory-card strong,
        .directory-card span {
          margin: 0;
        }

        .hud-card p,
        .directory-card span {
          color: var(--text-muted);
        }

        .hud-card ul {
          padding-left: 1.2rem;
          color: var(--text-muted);
        }

        .hud-kicker {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hint-bar {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 0.9rem 1rem;
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--panel) 92%, white 8%);
          color: var(--text-muted);
        }

        .scene-directory {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.8rem;
        }

        .directory-card {
          display: grid;
          gap: 0.35rem;
        }

        .directory-card.active {
          border-color: color-mix(in srgb, var(--accent) 28%, var(--line) 72%);
          background: color-mix(in srgb, var(--accent-soft) 30%, white 70%);
        }

        .dialog-panel {
          padding: 1rem;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel);
          box-shadow: var(--shadow);
        }

        .dialog-panel p {
          margin: 0 0 1rem;
        }

        .dialog-panel button {
          min-height: 2.5rem;
          padding: 0 0.9rem;
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          background: var(--panel-strong);
          cursor: pointer;
        }

        @media (max-width: 980px) {
          .canvas-layout,
          .scene-directory {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
