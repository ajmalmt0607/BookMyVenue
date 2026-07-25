import { useRef, useState } from "react";
import {
  GripVertical,
  ImagePlus,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";

import Shimmer from "../../../ui/Shimmer";
import WizardFooter from "../WizardFooter";

import {
  deleteVenueImage,
  reorderVenueImages,
  setPrimaryVenueImage,
  uploadVenueImages,
} from "../../../../services/venueDraftService";
import useSavedFlash from "../../../../hooks/useSavedFlash";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UploadingTile = ({ progress }) => (
  <div className="relative aspect-square overflow-hidden rounded-2xl">
    <Shimmer className="h-full w-full" />

    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <span className="text-sm font-bold text-gray-600">{progress}%</span>

      <div className="h-1 w-14 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-red-600 transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
);

const ImagesStep = ({ venue, venueId, onBack, onContinue }) => {
  const [images, setImages] = useState(venue?.images || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [error, setError] = useState("");
  const { justSaved, flash } = useSavedFlash();

  const fileInputRef = useRef(null);

  const handleFiles = async (fileList) => {
    const candidates = Array.from(fileList || []);
    const remainingSlots = MAX_IMAGES - images.length;

    const valid = candidates.filter((file) =>
      ACCEPTED_TYPES.includes(file.type)
    );
    const withinSize = valid.filter(
      (file) => file.size <= MAX_FILE_SIZE_BYTES
    );
    const files = withinSize.slice(0, remainingSlots);

    if (withinSize.length > remainingSlots) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
    } else if (withinSize.length < valid.length) {
      setError("Each image must be 5MB or smaller.");
    } else if (valid.length < candidates.length) {
      setError("Only JPG, JPEG, PNG, or WEBP images are allowed.");
    } else {
      setError("");
    }

    if (!files.length) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const uploaded = await uploadVenueImages(
        venueId,
        files,
        setUploadProgress
      );

      setImages((prev) => [...prev, ...uploaded]);
      flash();
    } catch (err) {
      console.error(err);
      setError("Couldn't upload one or more images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDelete = async (imageId) => {
    const previous = images;

    setImages((current) => current.filter((image) => image.id !== imageId));

    try {
      await deleteVenueImage(venueId, imageId);
      flash();
    } catch (err) {
      console.error(err);
      setImages(previous);
      setError("Couldn't delete that image. Please try again.");
    }
  };

  const handleSetPrimary = async (imageId) => {
    const previous = images;

    setImages((current) =>
      current.map((image) => ({
        ...image,
        is_primary: image.id === imageId,
      }))
    );

    try {
      await setPrimaryVenueImage(venueId, imageId);
      flash();
    } catch (err) {
      console.error(err);
      setImages(previous);
      setError("Couldn't update the primary image. Please try again.");
    }
  };

  const persistOrder = async (nextImages) => {
    try {
      await reorderVenueImages(
        venueId,
        nextImages.map((image) => image.id)
      );
      flash();
    } catch (err) {
      console.error(err);
      setError("Couldn't save the new order. Please try again.");
    }
  };

  const handleDragOverImage = (event, targetId) => {
    event.preventDefault();

    if (!draggedId || draggedId === targetId) return;

    setImages((current) => {
      const fromIndex = current.findIndex((image) => image.id === draggedId);
      const toIndex = current.findIndex((image) => image.id === targetId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return next;
    });
  };

  const handleDragEnd = () => {
    if (draggedId) persistOrder(images);
    setDraggedId(null);
  };

  const atMax = images.length >= MAX_IMAGES;

  return (
    <div>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add photos</h2>
          <p className="mt-1.5 text-gray-500">
            Great photos help customers picture their event here. Drag to
            reorder, and pick one as the primary photo.
          </p>
        </div>

        {!atMax && (
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            className={`
              flex cursor-pointer flex-col items-center justify-center gap-3
              rounded-3xl border-2 border-dashed px-6 py-14 text-center
              transition-colors duration-200
              ${
                isDraggingOver
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50 hover:border-red-300 hover:bg-red-50/40"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(event) => {
                handleFiles(event.target.files);
                event.target.value = "";
              }}
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <UploadCloud size={26} className="text-red-600" />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                Drag &amp; drop photos here, or click to browse
              </p>
              <p className="mt-1 text-sm text-gray-500">
                JPG, PNG or WEBP - up to {MAX_IMAGES} images, 5MB each
              </p>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {(images.length > 0 || uploading) && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => setDraggedId(image.id)}
                onDragOver={(event) => handleDragOverImage(event, image.id)}
                onDragEnd={handleDragEnd}
                className={`
                  group relative aspect-square overflow-hidden rounded-2xl border
                  transition-opacity duration-150
                  ${draggedId === image.id ? "opacity-40" : "border-gray-100"}
                `}
              >
                <img
                  src={image.image}
                  alt=""
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/25" />

                <div
                  className="
                    absolute left-2 top-2 flex h-7 w-7 cursor-grab
                    items-center justify-center rounded-full bg-white/90
                    text-gray-500 opacity-0 transition-opacity
                    group-hover:opacity-100
                  "
                >
                  <GripVertical size={15} />
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  className="
                    absolute right-2 top-2 flex h-7 w-7 items-center
                    justify-center rounded-full bg-white/90 text-gray-600
                    opacity-0 transition-opacity duration-200
                    hover:bg-red-600 hover:text-white group-hover:opacity-100
                  "
                >
                  <Trash2 size={14} />
                </button>

                {image.is_primary ? (
                  <span
                    className="
                      absolute bottom-2 left-2 flex items-center gap-1
                      rounded-full bg-red-600 px-2.5 py-1 text-xs
                      font-semibold text-white
                    "
                  >
                    <Star size={12} className="fill-white" />
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(image.id)}
                    className="
                      absolute bottom-2 left-2 rounded-full bg-white/90
                      px-2.5 py-1 text-xs font-semibold text-gray-700
                      opacity-0 transition-opacity duration-200
                      hover:bg-white group-hover:opacity-100
                    "
                  >
                    Make Primary
                  </button>
                )}
              </div>
            ))}

            {uploading && <UploadingTile progress={uploadProgress} />}

            {!atMax && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  flex aspect-square flex-col items-center justify-center gap-1.5
                  rounded-2xl border-2 border-dashed border-gray-200 text-gray-400
                  transition-colors duration-200
                  hover:border-red-300 hover:text-red-500
                "
              >
                <ImagePlus size={22} />
                <span className="text-xs font-semibold">Add more</span>
              </button>
            )}
          </div>
        )}
      </div>

      <WizardFooter
        onBack={onBack}
        justSaved={justSaved}
        continueDisabled={images.length === 0}
        onContinue={() => onContinue({ images })}
      />
    </div>
  );
};

export default ImagesStep;
