export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500 text-xl">
          ⊗
        </div>
        <h3 className="font-semibold text-slate-800 text-center mb-1.5">Delete Property?</h3>
        <p className="text-sm text-slate-400 text-center mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}