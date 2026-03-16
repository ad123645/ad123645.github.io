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

export default function RpgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const [sceneId, setSceneId] = useState('hall');
  const [spawnId, setSpawnId] = useState('start');
  const [prompt, setPrompt] = useState('WASD 移动 · E 交互');
  const [dialogText, setDialogText] = useState('');

  const scene = useMemo(() => getScene(sceneId), [sceneId]);
  const playerRef = useRef(createPlayer(
    scene.spawnPoints[spawnId]?.x ?? 80,
    scene.spawnPoints[spawnId]?.y ?? 80
  ));

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
          setSceneId(action.toSceneId);
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

        const nextRect = {
          x: player.x + movement.dx * PLAYER_SPEED * delta,
          y: player.y + movement.dy * PLAYER_SPEED * delta,
          w: PLAYER_SIZE,
          h: PLAYER_SIZE,
        };

        const blocked = isBlocked(
          nextRect,
          scene.width,
          scene.height,
          scene.obstacles,
          scene.interactables
        );

        if (!blocked) {
          player.x = nextRect.x;
          player.y = nextRect.y;
        }
      }

      const nearby = getInteractableInFront(
        getPlayerRect(player),
        player.facing,
        scene.interactables
      );
      setPrompt(nearby?.prompt ?? 'WASD 移动 · E 交互');

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = TILE_COLORS[scene.baseTile] ?? '#efe6d8';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.strokeStyle = 'rgba(120, 105, 90, 0.15)';
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
        context.fillStyle = item.color ?? '#9a856f';
        context.fillRect(item.x, item.y, item.w, item.h);
      });

      scene.interactables.forEach((item) => {
        context.fillStyle = item.color ?? '#6f7f72';
        context.fillRect(item.x, item.y, item.w, item.h);

        if (nearby?.id === item.id) {
          context.strokeStyle = '#ffffff';
          context.lineWidth = 2;
          context.strokeRect(item.x + 2, item.y + 2, item.w - 4, item.h - 4);
        }
      });

      context.fillStyle = '#2f2a24';
      context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

      context.fillStyle = '#fbf8f2';
      const eyeX = player.facing === 'left' ? player.x + 5 : player.facing === 'right' ? player.x + 15 : player.x + 10;
      const eyeY = player.facing === 'up' ? player.y + 5 : player.y + 9;
      context.fillRect(eyeX, eyeY, 4, 4);

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => cancelAnimationFrame(frame);
  }, [scene]);

  return (
    <div className="rpg-root">
      <SceneTitle title={scene.name} />
      <canvas
        ref={canvasRef}
        width={scene.width}
        height={scene.height}
        className="rpg-canvas"
      />
      <HintBar sceneName={scene.name} prompt={prompt} />
      {dialogText && <DialogPanel text={dialogText} onClose={() => setDialogText('')} />}

      <style>{`
        .rpg-root {
          display: grid;
          gap: 1rem;
        }

        .scene-title {
          margin: 0;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.875rem;
        }

        .rpg-canvas {
          display: block;
          width: 100%;
          max-width: 720px;
          height: auto;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel);
          box-shadow: var(--shadow);
        }

        .hint-bar {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          max-width: 720px;
          padding: 0.9rem 1rem;
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--panel) 92%, white 8%);
          color: var(--text-muted);
        }

        .dialog-panel {
          max-width: 720px;
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
      `}</style>
    </div>
  );
}
