/**
 * MenuUploadInput Component
 * Handles menu image file selection with validation
 *
 * Features:
 * - Accepts JPG and PNG files only
 * - Validates file size (max 15MB)
 * - Shows loading state during upload
 * - Provides user-friendly error messages
 */

import { useRef, useState, useCallback } from 'react'

interface MenuUploadInputProps {
  onFileSelect: (file: File) => void
  onError: (error: string) => void
  isLoading?: boolean
  disabled?: boolean
  errorMessage?: string
}

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']
const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB

/**
 * MenuUploadInput Component
 *
 * Provides a file input for selecting menu images with validation
 *
 * @param onFileSelect - Callback when valid file is selected
 * @param onError - Callback when validation fails
 * @param isLoading - Whether component is in loading state
 * @param disabled - Whether component is disabled
 * @param errorMessage - Error message to display
 */
export function MenuUploadInput({
  onFileSelect,
  onError,
  isLoading = false,
  disabled = false,
  errorMessage,
}: MenuUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file format
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        onError(
          `File format not supported: ${file.type}. Supported formats: JPG, PNG`
        )
        return false
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        onError(`File size (${file.size} bytes) exceeds maximum limit of 15MB`)
        return false
      }

      return true
    },
    [onError]
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files

      // No file selected
      if (!files || files.length === 0) {
        return
      }

      const file = files[0]

      // Validate file
      if (!validateFile(file)) {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      // File is valid, call callback
      setIsProcessing(true)
      try {
        onFileSelect(file)
      } finally {
        setIsProcessing(false)
      }
    },
    [validateFile, onFileSelect]
  )

  const isDisabled = disabled || isLoading || isProcessing

  return (
    <div className="menu-upload-input">
      <div className="upload-container">
        <label
          htmlFor="menu-file-input"
          className="upload-label"
          aria-label="Upload menu image"
        >
          <input
            ref={fileInputRef}
            id="menu-file-input"
            type="file"
            accept={SUPPORTED_FORMATS.join(',')}
            onChange={handleFileChange}
            disabled={isDisabled}
            aria-label="Select menu image file"
            className="file-input"
          />
          <div className="upload-button">
            {isLoading || isProcessing ? (
              <div className="loading" data-testid="loading">
                <span>Processing...</span>
              </div>
            ) : (
              <div className="upload-text">
                <span>📷 Select Menu Image</span>
                <small>JPG or PNG • Max 15MB</small>
              </div>
            )}
          </div>
        </label>
      </div>

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      <style>{`
        .menu-upload-input {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .upload-container {
          width: 100%;
        }

        .upload-label {
          display: block;
          cursor: pointer;
        }

        .file-input {
          display: none;
        }

        .upload-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border: 2px dashed #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
          transition: all 0.3s ease;
          text-align: center;
        }

        .upload-button:hover {
          border-color: #999;
          background-color: #f0f0f0;
        }

        .file-input:disabled + .upload-button {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-text {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .upload-text span {
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
        }

        .upload-text small {
          color: #666;
          font-size: 0.875rem;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .loading span {
          color: #666;
          font-size: 0.9rem;
        }

        .error-message {
          padding: 0.75rem;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
          font-size: 0.875rem;
        }

        @media (max-width: 640px) {
          .upload-button {
            padding: 1.5rem;
          }

          .upload-text span {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
