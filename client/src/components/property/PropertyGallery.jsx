export default function PropertyGallery({ images, onImageClick }) {
  const hasMultiple = images.length > 1;

  return (
    <div className="rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl mb-6">
      {/* Mobile: single image */}
      <div className="md:hidden h-56 sm:h-72 cursor-zoom-in overflow-hidden group" onClick={() => onImageClick(0)}>
        <img src={images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Main" />
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:grid grid-cols-4 gap-2 h-[480px]">
        <div className="col-span-2 overflow-hidden cursor-zoom-in group" onClick={() => onImageClick(0)}>
          <img src={images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Main" />
        </div>
        <div className="grid grid-rows-2 gap-2 col-span-1">
          {[1, 2].map((i) =>
            images[i] ? (
              <div key={i} className="overflow-hidden cursor-zoom-in group" onClick={() => onImageClick(i)}>
                <img src={images[i]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={`View ${i}`} />
              </div>
            ) : (
              <div key={i} className="bg-slate-200" />
            )
          )}
        </div>
        <div className="col-span-1 relative cursor-pointer overflow-hidden group" onClick={() => onImageClick(3)}>
          {images[3] ? (
            <>
              <img src={images[3]} className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition duration-500" alt="More" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-black">{images.length}+</span>
                <span className="text-sm font-semibold underline">Photos</span>
              </div>
            </>
          ) : (
            <div className="bg-slate-300 h-full w-full" />
          )}
        </div>
      </div>
    </div>
  );
}