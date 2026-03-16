interface Props {
  title: string;
}

export default function SceneTitle({ title }: Props) {
  return <p className="scene-title">{title}</p>;
}
