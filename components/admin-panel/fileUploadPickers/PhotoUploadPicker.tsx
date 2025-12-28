import React, { useState, useRef, useMemo } from "react";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

interface UploadedPhoto {
  file?: File;
  previewUrl: string;
  status: "new" | "existing";
}

interface PhotoUploaderPickerProps {
  setValue: any; // React Hook Form setValue function
  photo?: UploadedPhoto | null; // Current photo from form state
  existingPhoto?: string | null; // Existing photo path from database as string
  fieldName?: string; // Name of the field in the form (default: 'photo')
  label?: string; // Name of the field in the form (default: 'photo')
}

const PhotoUploaderPicker: React.FC<PhotoUploaderPickerProps> = ({
  setValue,
  photo = null,
  existingPhoto = null,
  fieldName = "photo",
  label = "photo",
}) => {
  // Convert existing photo path to the format we need
  const initialPhoto: UploadedPhoto | null = useMemo(() => {
    if (photo) return photo;

    if (existingPhoto) {
      return {
        // previewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${existingPhoto}`,
        previewUrl: `${existingPhoto}`,
        status: "existing",
      };
    }

    return null;
  }, [photo, existingPhoto]);

  const [currentPhoto, setCurrentPhoto] = useState<UploadedPhoto | null>(
    initialPhoto
  );
  const fileUploadRef = useRef<FileUpload | null>(null);
  const primeReactToast = usePrimeReactToast();

  // Handle file selection
  const handleFileSelect = (event: FileUploadSelectEvent) => {
    const selectedFiles = event.files as File[];

    if (selectedFiles.length === 0) {
      primeReactToast.error("Image must be 5MB or smaller.");
      if (fileUploadRef.current) {
        fileUploadRef.current.clear(); // 🔑 reset input so user can try again
      }
      return;
    }

    const file = selectedFiles[0];
    console.log("🚀 ~ handleFileSelect ~ file:", file)

    // Validation: Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      primeReactToast.error("Image must be 5MB or smaller.");
      if (fileUploadRef.current) {
        fileUploadRef.current.clear(); // 🔑 reset input so user can try again
      }
      return;
    }

    // Validate file type
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (["heic", "heif"].includes(ext)) {
      primeReactToast.error("HEIC images are not supported. Please upload JPG or PNG.");
      fileUploadRef.current?.clear();
      return;
    }

    const isImageFileType = (file: File) => {
      if (file.type && file.type.startsWith("image/")) {
        return true; // normal JPG/PNG/etc.
      }

      // fallback: check extension
      return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    };

    // usage in your validation:
    if (!isImageFileType(file)) {
      primeReactToast.error("Only image files are allowed.");
      if (fileUploadRef.current) fileUploadRef.current.clear();  // 🔑 reset input so user can try again
      return;
    }


    // Create new photo object
    const newPhoto: UploadedPhoto = {
      file: file,
      previewUrl: URL.createObjectURL(file),
      status: "new",
    };

    // Update state and form
    setCurrentPhoto(newPhoto);
    setValue(fieldName, newPhoto);

    // Clear FileUpload input after selection
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  // Remove photo
  const removePhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPhoto(null);
    setValue(fieldName, null);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="font-medium text-gray-700">{label}</label>

      {/* Show preview if we have a photo */}
      {currentPhoto && (
        <div className="border rounded p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {currentPhoto.status === "existing"
                ? "Current Photo"
                : "New Photo"}
            </span>
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              onClick={removePhoto}
              tooltip="Remove photo"
            />
          </div>

          <div className="flex justify-center">
            <Image
              src={currentPhoto.previewUrl}
              alt="Photo Preview"
              width="200"
              preview
              pt={{ image: { className: "border rounded" } }}
            />
          </div>

          {currentPhoto.file && (
            <div className="text-sm text-gray-500 mt-2">
              {currentPhoto.file.name} (
              {(currentPhoto.file.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        name="photo"
        // accept="image/*"
        accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
        maxFileSize={5000000}
        customUpload
        auto
        chooseLabel={currentPhoto ? `Change ${label}` : `Upload ${label}`}
        // chooseIcon="pi pi-image"
        className="w-full"
        onSelect={handleFileSelect}
      />

      <small className="text-gray-500">
        Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
      </small>
    </div>
  );
};

export default PhotoUploaderPicker;
