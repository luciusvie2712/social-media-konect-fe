

const MediaItem = ({ item, onClick }) =>
  item?.type?.startsWith("video") ? (
    <video
      src={item.url}
      controls
      className="w-full h-full object-cover rounded-lg cursor-pointer"
      onClick={onClick}
    />
  ) : (
    <img
      src={item.url}
      alt="preview"
      className="w-full h-full object-cover rounded-lg cursor-pointer"
      onClick={onClick}
    />
  );

const MediaGrid = ({ mediaPreview, onRemove }) => {
  if (!mediaPreview || mediaPreview.length === 0) return null;
  const length = mediaPreview.length;

  const renderItem = (item, index, extraOverlay = false) => (
    <div key={index} className="relative w-full h-full">
      <MediaItem item={item} onClick={() => onRemove(index)} />
      {extraOverlay && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold rounded-lg">
          +{length - 4}
        </div>
      )}
    </div>
  );

  if (length === 1) {
    return (
      <div className="grid grid-cols-1 gap-2">
        <div className="w-full h-[420px] sm:h-[520px]">
          {renderItem(mediaPreview[0], 0)}
        </div>
      </div>
    );
  }

  if (length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {mediaPreview.map((item, index) => (
          <div key={index} className="h-48 sm:h-56">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  if (length === 3) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="h-40 sm:h-48">{renderItem(mediaPreview[0], 0)}</div>
        <div className="h-40 sm:h-48">{renderItem(mediaPreview[1], 1)}</div>
        <div className="col-span-2 h-56 sm:h-64">
          {renderItem(mediaPreview[2], 2)}
        </div>
      </div>
    );
  }

  if (length === 4) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {mediaPreview.map((item, index) => (
          <div key={index} className="h-40 sm:h-48">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {mediaPreview.slice(0, 4).map((item, index) => (
        <div key={index} className="h-40 sm:h-48">
          {renderItem(item, index, index === 3 && length > 4)}
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
