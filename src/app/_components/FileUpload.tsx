"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "~/lib/utils";

interface FileUploadProps {
    accept?: Record<string, string[]>;
    maxSize?: number;
    onFileSelect: (file: File) => void;
    error?: string;
    value?: File;
}

export function FileUpload({
    accept = {
        "application/pdf": [".pdf"],
        "image/png": [".png"],
    },
    maxSize = 5 * 1024 * 1024, // 5MB
    onFileSelect,
    error,
    value,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles[0]) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 transition-colors",
                    isDragActive && "border-blue-500 bg-blue-50",
                    error && "border-red-500",
                )}
            >
                <input {...getInputProps()} />
                <Upload
                    size={24}
                    className={cn(
                        "mb-4 text-gray-400",
                        isDragActive && "text-blue-500",
                        error && "text-red-500",
                    )}
                />
                <div className="text-center">
                    {value ? (
                        <p className="text-sm text-gray-600">
                            Selected file: {value.name}
                        </p>
                    ) : (
                        <>
                            <p className="text-base text-gray-600">
                                Drag & Drop or{" "}
                                <span className="font-medium text-blue-600">Choose file</span>{" "}
                                to upload
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                PDF or PNG format • Max 5MB
                            </p>
                        </>
                    )}
                </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
} 