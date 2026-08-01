/**
 * ImageUploader.jsx
 * Reusable drag-and-drop image upload component.
 * Used in AddProduct (multiple) and AddEvent (single).
 */
import React, { useRef, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

export const ImageUploader = ({
  files,
  onFilesChange,
  multiple = true,
  label = 'Upload Images',
  maxFiles = 8
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (newFiles) => {
    const validImages = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    const combined = multiple
      ? [...files, ...validImages].slice(0, maxFiles)
      : [validImages[0]].filter(Boolean);
    onFilesChange(combined);
  };

  const removeFile = (idx) => {
    const updated = files.filter((_, i) => i !== idx);
    onFilesChange(updated);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div className="img-uploader-wrap">
      <label className="admin-field-label">{label}</label>

      {/* Drop zone */}
      <div
        className={`img-uploader-dropzone${dragging ? ' img-uploader-drag' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <Upload size={28} color="var(--highlight-mustard)" />
        <p className="img-uploader-hint">
          {multiple
            ? `Drag & drop images here, or click to browse (max ${maxFiles})`
            : 'Drag & drop banner here, or click to browse'}
        </p>
        <span className="img-uploader-subhint">JPG, PNG, WEBP — max 10 MB each</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="img-uploader-previews">
          {files.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={idx} className="img-uploader-thumb">
                <img src={url} alt={`preview-${idx}`} />
                <button
                  type="button"
                  className="img-uploader-remove"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
          {multiple && files.length < maxFiles && (
            <button
              type="button"
              className="img-uploader-add-more"
              onClick={() => inputRef.current?.click()}
              title="Add more images"
            >
              <Image size={22} color="var(--text-warm-grey)" />
              <span>Add more</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
