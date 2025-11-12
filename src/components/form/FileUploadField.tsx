import { ChangeEvent, useRef } from "react";
import { UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUploadFieldProps = {
  label: string;
  description?: string;
  fileName?: string;
  error?: string;
  accept?: string;
  onFileSelect?: (file: File | null) => boolean | void;
  onRemove?: () => void;
  className?: string;
};

const FileUploadField = ({
  label,
  description,
  fileName,
  error,
  accept,
  onFileSelect,
  onRemove,
  className,
}: FileUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    const result = onFileSelect?.(nextFile);

    if (!nextFile) {
      if (onRemove) {
        onRemove();
      }
      event.target.value = "";
      return;
    }

    if (result === false) {
      event.target.value = "";
    }
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileSelect?.(null);
    onRemove?.();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
          {fileName ? (
            <p className="text-sm font-medium text-indigo-600">Selected: {fileName}</p>
          ) : (
            <p className="text-sm text-gray-500">No file chosen yet</p>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-100"
            onClick={handleBrowse}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Browse file
          </Button>
          {fileName && (
            <Button
              type="button"
              variant="ghost"
              className="text-gray-500 hover:text-red-500"
              onClick={handleRemove}
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleChange}
      />
    </div>
  );
};

export default FileUploadField;
