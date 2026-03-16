interface Props {
  sceneName: string;
  prompt: string;
}

export default function HintBar({ sceneName, prompt }: Props) {
  return (
    <div className="hint-bar">
      <span>场景：{sceneName}</span>
      <span>{prompt || 'WASD 移动 · E 交互'}</span>
    </div>
  );
}
