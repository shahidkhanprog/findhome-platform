import { IC } from "../../constants/addPropertyConstants.jsx";
import UploadWidget from "../uploadWidgets/UploadWidget.jsx";

export default function PhotoUploadZone({ images, onAdd, onRemove, error }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IC.Camera className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700">Property Photos</span>
          <span className="text-red-400 text-xs">*</span>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
          images.length >= 4
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-600 border-red-200"
        }`}>
          {images.length} / 4 photos
        </span>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 mb-4 flex items-start gap-2">
        <IC.Alert className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-700">
          Upload <strong>at least 4 photos</strong> of your property. High quality images help attract more buyers/renters.
          You may add up to 10 photos.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-95 transition-all z-10"
                title="Remove photo"
              >
                <IC.X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                {i < 4 ? `★ ${i + 1}` : `${i + 1}`}
              </span>
              {i < 4 && (
                <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold opacity-80">
                  REQ
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < 10 && (
        <UploadWidget
          uwConfig={{
            cloudName: "droah7qf8",
            uploadPreset: "FindHome",
            multiple: true,
            maxFiles: 10 - images.length,
            cropping: false,
            folder: "property_photos",
            maxFileSize: 8000000,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          }}
          setAvatar={onAdd}
          buttonLabel={
            images.length === 0
              ? "Upload Property Photos"
              : `Add More Photos (${10 - images.length} remaining)`
          }
          variant="block"
        />
      )}

      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${
            images[i]
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-400 border-slate-200"
          }`}>
            {images[i] ? <IC.Check className="w-3 h-3" /> : <IC.Camera className="w-3 h-3" />}
            Photo {i + 1} ★
          </span>
        ))}
        {images.length > 4 && (
          <span className="text-[11px] text-slate-400 font-medium">+{images.length - 4} bonus photos</span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mt-3">
          <IC.Alert className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}