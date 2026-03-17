import { useEffect, useMemo, useRef, useState } from 'react';
import { withBase } from '@/utils/paths';
import { TILE_COLORS } from '@/features/rpg/config/tiles';
import { PLAYER_SIZE, PLAYER_SPEED } from '@/features/rpg/config/constants';
import { getScene } from '@/features/rpg/core/sceneManager';
import { findNearestOpenPosition, isBlocked } from '@/features/rpg/core/collision';
import { getInteractableInFront } from '@/features/rpg/core/interaction';
import { resolveMovement, isInteractKey } from '@/features/rpg/core/input';
import { createPlayer, getPlayerRect } from '@/features/rpg/entities/player';
import { dialogs } from '@/features/rpg/ui/dialogs';
import HintBar from '@/features/rpg/components/HintBar';
import DialogPanel from '@/features/rpg/components/DialogPanel';
import SceneTitle from '@/features/rpg/components/SceneTitle';
import { SCENE_META, type SceneMetaKey } from '@/features/rpg/config/sceneMeta';
import type { DecorationObject, InteractableObject, ObstacleObject, SceneDefinition } from '@/types/rpg';

const ROOM_TITLES = {
  hall: '大厅',
  library: '图书馆',
  stacks: '藏书室',
  gameRoom: '游戏室',
} as const;

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 8
) {
  const r = Math.min(radius, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  radius = 8
) {
  roundedRect(context, x, y, w, h, radius);
  context.fillStyle = fill;
  context.fill();
}

function strokeRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  stroke: string,
  radius = 8,
  lineWidth = 1
) {
  roundedRect(context, x, y, w, h, radius);
  context.lineWidth = lineWidth;
  context.strokeStyle = stroke;
  context.stroke();
}

function drawSceneLabels(context: CanvasRenderingContext2D, sceneName: string) {
  const labelWidth = Math.max(86, sceneName.length * 18 + 26);
  fillRoundedRect(context, 14, 14, labelWidth, 26, 'rgba(251, 248, 242, 0.86)', 999);
  strokeRoundedRect(context, 14, 14, labelWidth, 26, 'rgba(137, 120, 102, 0.18)', 999, 1);
  context.save();
  context.fillStyle = 'rgba(47, 42, 36, 0.82)';
  context.font = '600 12px ui-serif, serif';
  context.textAlign = 'left';
  context.fillText(sceneName, 26, 31);
  context.restore();
}

function drawBackdrop(context: CanvasRenderingContext2D, scene: SceneDefinition) {
  context.fillStyle = TILE_COLORS[scene.baseTile] ?? '#efe6d8';
  context.fillRect(0, 0, scene.width, scene.height);

  const gradient = context.createLinearGradient(0, 0, 0, scene.height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
  gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(71, 58, 45, 0.06)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, scene.width, scene.height);

  context.strokeStyle = 'rgba(120, 105, 90, 0.08)';
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

  for (let y = 0; y < scene.height; y += scene.tileSize * 2) {
    context.fillStyle = 'rgba(255, 255, 255, 0.12)';
    context.fillRect(0, y, scene.width, 1);
  }
}

function drawDecoration(context: CanvasRenderingContext2D, item: DecorationObject) {
  const color = item.color ?? '#d9cfbf';
  if (String(color).includes('rgba')) {
    fillRoundedRect(context, item.x, item.y, item.w, item.h, color, 12);
    return;
  }

  fillRoundedRect(context, item.x, item.y, item.w, item.h, color, 12);
  strokeRoundedRect(context, item.x + 2, item.y + 2, item.w - 4, item.h - 4, 'rgba(255,255,255,0.14)', 10);

  if (item.name.includes('地毯') || item.name.includes('毯')) {
    context.strokeStyle = 'rgba(111, 85, 62, 0.16)';
    context.lineWidth = 2;
    context.strokeRect(item.x + 8, item.y + 8, item.w - 16, item.h - 16);
  }

  if (item.id.includes('zone-banner') || item.name.includes('导览牌')) {
    context.save();
    context.fillStyle = 'rgba(47, 42, 36, 0.82)';
    context.font = item.id.includes('zone-banner') ? '600 12px ui-serif, serif' : '600 11px ui-serif, serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(item.name, item.x + item.w / 2, item.y + item.h / 2 + 0.5);
    context.restore();
  }
}

function drawWall(context: CanvasRenderingContext2D, item: ObstacleObject) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#8a715e', 6);
  context.fillStyle = 'rgba(255,255,255,0.12)';
  context.fillRect(item.x + 2, item.y + 2, Math.max(item.w - 4, 4), 4);
  context.fillStyle = 'rgba(71,58,45,0.12)';
  context.fillRect(item.x, item.y + item.h - 4, item.w, 4);
}

function drawShelf(context: CanvasRenderingContext2D, item: ObstacleObject) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#987a61', 8);
  context.fillStyle = 'rgba(64, 48, 37, 0.14)';
  for (let y = item.y + 14; y < item.y + item.h - 10; y += 20) {
    context.fillRect(item.x + 4, y, item.w - 8, 3);
  }
  const stripePalette = ['#c8b59d', '#d9c6ae', '#7f9984', '#b68f77'];
  let index = 0;
  for (let x = item.x + 6; x < item.x + item.w - 8; x += 10) {
    for (let y = item.y + 6; y < item.y + item.h - 12; y += 20) {
      context.fillStyle = stripePalette[index % stripePalette.length] ?? '#c8b59d';
      context.fillRect(x, y, 6, 10);
      index += 1;
    }
  }

  const code = item.name.match(/^(.+?)\s*书架$/)?.[1]?.trim();
  if (code) {
    const plaqueWidth = Math.min(item.w - 12, code.length > 1 ? 34 : 28);
    const plaqueHeight = 18;
    const plaqueX = item.x + item.w / 2 - plaqueWidth / 2;
    const plaqueY = item.y + item.h / 2 - plaqueHeight / 2 + 2;
    fillRoundedRect(context, plaqueX, plaqueY, plaqueWidth, plaqueHeight, 'rgba(251, 248, 242, 0.84)', 7);
    strokeRoundedRect(context, plaqueX, plaqueY, plaqueWidth, plaqueHeight, 'rgba(137, 120, 102, 0.16)', 7, 1);
    context.save();
    context.fillStyle = 'rgba(47, 42, 36, 0.9)';
    context.font = code.length > 1 ? '700 13px ui-serif, serif' : '700 16px ui-serif, serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(code, item.x + item.w / 2, plaqueY + plaqueHeight / 2 + 0.5);
    context.restore();
  }
}

function drawTable(context: CanvasRenderingContext2D, item: ObstacleObject) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#aa8a6d', 10);
  context.fillStyle = 'rgba(255,255,255,0.14)';
  context.fillRect(item.x + 6, item.y + 5, item.w - 12, 4);
  context.fillStyle = 'rgba(66, 50, 39, 0.18)';
  context.fillRect(item.x + 9, item.y + item.h - 8, 5, 8);
  context.fillRect(item.x + item.w - 14, item.y + item.h - 8, 5, 8);
}

function drawIndexStand(context: CanvasRenderingContext2D, item: ObstacleObject) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#7e8d84', 10);
  context.fillStyle = 'rgba(255,255,255,0.16)';
  context.fillRect(item.x + 6, item.y + 5, item.w - 12, 4);
  context.fillRect(item.x + 8, item.y + 12, item.w - 16, 3);
  context.fillStyle = 'rgba(66, 50, 39, 0.16)';
  context.fillRect(item.x + item.w / 2 - 1, item.y + item.h - 14, 2, 12);
  fillRoundedRect(context, item.x + 6, item.y + item.h - 14, item.w - 12, 10, 'rgba(251, 248, 242, 0.14)', 8);
  fillRoundedRect(context, item.x + item.w / 2 - 16, item.y + item.h / 2 - 9, 32, 18, 'rgba(251, 248, 242, 0.8)', 7);
  context.save();
  context.fillStyle = 'rgba(47, 42, 36, 0.88)';
  context.font = '700 11px ui-serif, serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('索引', item.x + item.w / 2, item.y + item.h / 2 + 0.5);
  context.restore();
}

function drawBenchOrSofa(context: CanvasRenderingContext2D, item: ObstacleObject) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#8f7b6f', 10);
  context.fillStyle = 'rgba(255,255,255,0.14)';
  context.fillRect(item.x + 6, item.y + 4, item.w - 12, 4);
  context.fillStyle = 'rgba(66, 50, 39, 0.18)';
  context.fillRect(item.x + 8, item.y + item.h - 6, 5, 6);
  context.fillRect(item.x + item.w - 13, item.y + item.h - 6, 5, 6);
}

function drawSmallCabinet(context: CanvasRenderingContext2D, item: ObstacleObject) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#928172', 8);
  context.fillStyle = 'rgba(255,255,255,0.12)';
  context.fillRect(item.x + 4, item.y + 4, item.w - 8, 4);
  context.fillStyle = 'rgba(66, 50, 39, 0.16)';
  context.fillRect(item.x + item.w / 2 - 1, item.y + 6, 2, item.h - 12);
}

function drawObstacle(context: CanvasRenderingContext2D, item: ObstacleObject) {
  fillRoundedRect(context, item.x + 3, item.y + 4, item.w, item.h, 'rgba(47, 42, 36, 0.08)', 8);

  if (item.name.includes('墙')) {
    drawWall(context, item);
    return;
  }
  if (item.name.includes('书架') || item.name.includes('目录柜')) {
    drawShelf(context, item);
    return;
  }
  if (item.name.includes('索引台')) {
    drawIndexStand(context, item);
    return;
  }
  if (item.name.includes('桌') || item.name.includes('总台')) {
    drawTable(context, item);
    return;
  }
  if (item.name.includes('长椅') || item.name.includes('沙发')) {
    drawBenchOrSofa(context, item);
    return;
  }
  if (item.name.includes('机柜') || item.name.includes('归还车') || item.name.includes('演示机') || item.name.includes('门框')) {
    drawSmallCabinet(context, item);
    return;
  }
  if (item.name.includes('立柱')) {
    fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#b59e86', 999);
    context.fillStyle = 'rgba(255,255,255,0.14)';
    context.fillRect(item.x + 1, item.y + 3, item.w - 2, 4);
    return;
  }

  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#9a856f', 8);
}

function drawDoor(context: CanvasRenderingContext2D, item: InteractableObject, active: boolean) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h + 10, item.color ?? '#6f7f72', 12);
  context.fillStyle = 'rgba(255,255,255,0.18)';
  context.fillRect(item.x + 6, item.y + 6, item.w - 12, 5);
  context.fillStyle = 'rgba(66, 50, 39, 0.16)';
  context.fillRect(item.x + item.w / 2 - 2, item.y + 16, 4, item.h - 10);
  if (active) {
    strokeRoundedRect(context, item.x + 2, item.y + 2, item.w - 4, item.h + 6, '#ffffff', 10, 2);
  }
}

function drawBoard(context: CanvasRenderingContext2D, item: InteractableObject, active: boolean) {
  fillRoundedRect(context, item.x, item.y, item.w, item.h, item.color ?? '#d5c4ad', 8);
  context.fillStyle = 'rgba(96, 72, 50, 0.2)';
  context.fillRect(item.x + 5, item.y + 6, Math.max(item.w - 10, 4), 2);
  if (item.h > 10) {
    context.fillRect(item.x + 5, item.y + 12, Math.max(item.w - 14, 4), 2);
    context.fillRect(item.x + item.w / 2 - 1, item.y + item.h, 2, 8);
  }
  if (active) {
    strokeRoundedRect(context, item.x - 1, item.y - 1, item.w + 2, item.h + 2, '#ffffff', 8, 2);
  }
}

function drawInteractable(context: CanvasRenderingContext2D, item: InteractableObject, active: boolean) {
  if (active) {
    fillRoundedRect(context, item.x - 4, item.y - 4, item.w + 8, item.h + 8, 'rgba(255,255,255,0.16)', 12);
  }

  if (item.name.includes('门') || item.name.includes('返回大厅') || item.name.includes('返回图书馆')) {
    drawDoor(context, item, active);
    return;
  }

  if (item.name.includes('索引台')) {
    const standLikeObstacle = { ...item, type: 'obstacle' as const };
    drawIndexStand(context, standLikeObstacle);
    if (active) {
      strokeRoundedRect(context, item.x - 1, item.y - 1, item.w + 2, item.h + 2, '#ffffff', 10, 2);
    }
    return;
  }

  drawBoard(context, item, active);
}

function drawPlayer(context: CanvasRenderingContext2D, x: number, y: number, facing: 'up' | 'down' | 'left' | 'right') {
  fillRoundedRect(context, x + 2, y + PLAYER_SIZE - 5, PLAYER_SIZE - 4, 6, 'rgba(47, 42, 36, 0.14)', 999);
  fillRoundedRect(context, x + 4, y + 2, PLAYER_SIZE - 8, PLAYER_SIZE - 4, '#2f2a24', 10);
  fillRoundedRect(context, x + 8, y - 1, PLAYER_SIZE - 16, 10, '#4a433a', 999);
  context.fillStyle = '#fbf8f2';
  const eyeX = facing === 'left' ? x + 7 : facing === 'right' ? x + 14 : x + 10;
  const eyeY = facing === 'up' ? y + 6 : y + 10;
  context.fillRect(eyeX, eyeY, 4, 4);
}

function getActionDescription(item: InteractableObject | null) {
  if (!item) return '先靠近门、牌子或书架，再按 E。';
  switch (item.action.kind) {
    case 'scene':
      return '这会把你带到另一间房。';
    case 'route':
      return '这会直接打开对应的页面或分类。';
    case 'dialog':
      return '这会展开一段房间内说明。';
    default:
      return '这是一个可交互物件。';
  }
}

function getActionHref(item: InteractableObject | null) {
  if (!item || item.action.kind !== 'route') return null;
  return withBase(item.action.to);
}

function getActionLabel(item: InteractableObject) {
  switch (item.action.kind) {
    case 'scene':
      return '切换房间';
    case 'route':
      return '打开页面';
    case 'dialog':
      return '阅读说明';
    default:
      return '交互';
  }
}

export default function RpgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const promptRef = useRef('WASD 移动 · E 交互');
  const nearbyNameRef = useRef('');
  const nearbyIdRef = useRef('');

  const [sceneId, setSceneId] = useState<SceneMetaKey>('hall');
  const [spawnId, setSpawnId] = useState('start');
  const [prompt, setPrompt] = useState('WASD 移动 · E 交互');
  const [dialogText, setDialogText] = useState('');
  const [nearbyName, setNearbyName] = useState('附近没有可交互物件');
  const [nearbyId, setNearbyId] = useState('');
  const [panelTab, setPanelTab] = useState<'nearby' | 'interactables'>('nearby');

  const scene = useMemo(() => getScene(sceneId), [sceneId]);
  const sceneMeta = SCENE_META[sceneId];
  const initialSpawn = scene.spawnPoints[spawnId] ?? Object.values(scene.spawnPoints)[0] ?? { x: 80, y: 80 };
  const nearbyItem = useMemo(
    () => scene.interactables.find((item) => item.id === nearbyId) ?? null,
    [scene, nearbyId]
  );

  const safeInitialSpawn = findNearestOpenPosition(
    initialSpawn,
    PLAYER_SIZE,
    scene.width,
    scene.height,
    scene.obstacles,
    scene.interactables
  );

  const playerRef = useRef(createPlayer(safeInitialSpawn.x, safeInitialSpawn.y));

  useEffect(() => {
    const spawn = scene.spawnPoints[spawnId] ?? Object.values(scene.spawnPoints)[0] ?? { x: 80, y: 80 };
    const safeSpawn = findNearestOpenPosition(
      spawn,
      PLAYER_SIZE,
      scene.width,
      scene.height,
      scene.obstacles,
      scene.interactables
    );
    playerRef.current = createPlayer(safeSpawn.x, safeSpawn.y);
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
          setSceneId(action.toSceneId as SceneMetaKey);
          setSpawnId(action.spawnId ?? 'start');
          setDialogText('');
          setPanelTab('nearby');
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

      const nearby = getInteractableInFront(getPlayerRect(player), player.facing, scene.interactables);
      const nextPrompt = nearby?.prompt ?? 'WASD 移动 · E 交互';
      const nextNearbyName = nearby?.name ?? '附近没有可交互物件';
      const nextNearbyId = nearby?.id ?? '';

      if (promptRef.current !== nextPrompt) {
        promptRef.current = nextPrompt;
        setPrompt(nextPrompt);
      }

      if (nearbyNameRef.current !== nextNearbyName) {
        nearbyNameRef.current = nextNearbyName;
        setNearbyName(nextNearbyName);
      }

      if (nearbyIdRef.current !== nextNearbyId) {
        nearbyIdRef.current = nextNearbyId;
        setNearbyId(nextNearbyId);
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBackdrop(context, scene);
      scene.decorations.forEach((item) => drawDecoration(context, item));
      scene.obstacles.forEach((item) => drawObstacle(context, item));
      scene.interactables.forEach((item) => drawInteractable(context, item, nearby?.id === item.id));
      drawPlayer(context, player.x, player.y, player.facing);
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

        <aside className="scene-panel card-surface">
          <div className="panel-tabs" role="tablist" aria-label="RPG 侧栏面板">
            <button
              type="button"
              className={panelTab === 'nearby' ? 'active' : ''}
              onClick={() => setPanelTab('nearby')}
            >
              附近物件
            </button>
            <button
              type="button"
              className={panelTab === 'interactables' ? 'active' : ''}
              onClick={() => setPanelTab('interactables')}
            >
              可交互物件
            </button>
          </div>

          {panelTab === 'nearby' ? (
            <div className="hud-card panel-body">
              <p className="hud-kicker">当前房间</p>
              <h3>{scene.name}</h3>
              <p>{sceneMeta.description}</p>

              <div className="detail-block">
                <p className="hud-kicker">附近物件</p>
                <strong>{nearbyName}</strong>
                <span>{prompt}</span>
                <span>{getActionDescription(nearbyItem)}</span>
                {nearbyItem && nearbyItem.action.kind === 'route' && (
                  <a href={getActionHref(nearbyItem) ?? '#'} className="scene-link-inline">
                    打开相关页面
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="hud-card panel-body">
              <p className="hud-kicker">可交互物件</p>
              <ul className="interactable-list">
                {scene.interactables.map((item) => (
                  <li key={item.id} className={nearbyId === item.id ? 'active' : ''}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.prompt.replace(/^E\s*/, '')}</span>
                    </div>
                    <em>{getActionLabel(item)}</em>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <HintBar sceneName={scene.name} prompt={prompt} />

      <div className="scene-directory">
        {Object.entries(SCENE_META).map(([key, meta]) => (
          <div key={key} className={`directory-card card-surface ${sceneId === key ? 'active' : ''}`}>
            <p className="hud-kicker">{meta.label}</p>
            <strong>{ROOM_TITLES[key as keyof typeof ROOM_TITLES]}</strong>
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
          grid-template-columns: minmax(0, 1.2fr) minmax(16rem, 0.42fr);
          gap: 1rem;
          align-items: start;
        }

        .canvas-stage,
        .scene-panel,
        .directory-card,
        .dialog-panel {
          position: relative;
        }

        .canvas-stage,
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
          gap: 0.85rem;
          padding: 0.85rem;
        }

        .panel-tabs {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.45rem;
        }

        .panel-tabs button {
          min-height: 2.5rem;
          padding: 0 0.8rem;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: color-mix(in srgb, var(--panel-strong) 90%, white 10%);
          color: var(--text-muted);
          cursor: pointer;
        }

        .panel-tabs button.active {
          color: var(--text);
          border-color: color-mix(in srgb, var(--accent) 28%, var(--line) 72%);
          background: color-mix(in srgb, var(--accent-soft) 30%, white 70%);
          font-weight: 700;
        }

        .panel-body {
          display: grid;
          gap: 0.75rem;
        }

        .hud-card h3,
        .hud-card p,
        .hud-card ul,
        .directory-card strong,
        .directory-card span,
        .detail-block strong,
        .detail-block span {
          margin: 0;
        }

        .hud-card p,
        .directory-card span,
        .detail-block span {
          color: var(--text-muted);
        }

        .detail-block {
          display: grid;
          gap: 0.35rem;
          padding: 0.8rem;
          border: 1px solid color-mix(in srgb, var(--line) 88%, white 12%);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--panel-strong) 88%, white 12%);
        }

        .scene-link-inline {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          min-height: 2rem;
          padding: 0 0.75rem;
          border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--line) 72%);
          border-radius: 999px;
          background: color-mix(in srgb, var(--accent-soft) 28%, white 72%);
          color: var(--text);
          font-size: 0.82rem;
        }

        .interactable-list {
          display: grid;
          gap: 0.55rem;
          padding: 0;
          list-style: none;
        }

        .interactable-list li {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: start;
          padding: 0.72rem 0.78rem;
          border: 1px solid color-mix(in srgb, var(--line) 88%, white 12%);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--panel-strong) 90%, white 10%);
        }

        .interactable-list li.active {
          border-color: color-mix(in srgb, var(--accent) 28%, var(--line) 72%);
          background: color-mix(in srgb, var(--accent-soft) 26%, white 74%);
        }

        .interactable-list li > div {
          display: grid;
          gap: 0.15rem;
        }

        .interactable-list strong,
        .interactable-list span,
        .interactable-list em {
          margin: 0;
          font-style: normal;
        }

        .interactable-list span,
        .interactable-list em {
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
          grid-template-columns: repeat(4, minmax(0, 1fr));
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

        @media (min-width: 981px) {
          .scene-panel {
            position: sticky;
            top: 6rem;
          }
        }

        @media (max-width: 1180px) {
          .scene-directory {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 980px) {
          .canvas-layout,
          .scene-directory {
            grid-template-columns: 1fr;
          }

          .scene-panel {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
