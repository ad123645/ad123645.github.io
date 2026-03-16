interface Props {
  text: string;
  onClose: () => void;
}

export default function DialogPanel({ text, onClose }: Props) {
  return (
    <div className="dialog-panel" role="dialog" aria-modal="false">
      <p>{text}</p>
      <button type="button" onClick={onClose}>
        关闭
      </button>
    </div>
  );
}
