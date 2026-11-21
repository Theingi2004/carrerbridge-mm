
type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl"
      >
        <h2
          id="confirm-dialog-title"
          className="text-xl font-bold text-brand-text"
        >
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-brand-text transition hover:bg-gray-100"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
