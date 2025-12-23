/**
 * MenuUploadWithProgress Component
 * Combines file upload input with progress feedback
 *
 * Features:
 * - Integrates MenuUploadInput for file selection
 * - Shows MenuUploadProgress during and after upload
 * - Manages upload state with useMenuUploadState
 * - Provides callbacks for success and error cases
 */

import { useCallback } from 'react';
import { MenuUploadInput } from './MenuUploadInput';
import { MenuUploadProgress } from './MenuUploadProgress';
import { useMenuUploadState } from '@/ui/hooks/useMenuUploadState';

interface MenuUploadWithProgressProps {
  onSuccess: (file: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

/**
 * MenuUploadWithProgress Component
 *
 * Complete upload component with visual progress feedback.
 * Handles file selection, validation, and displays progress during upload.
 *
 * @param onSuccess - Callback when file is successfully selected and ready
 * @param onError - Callback when validation or upload fails
 * @param disabled - Whether to disable the component
 */
export function MenuUploadWithProgress({
  onSuccess,
  onError,
  disabled = false,
}: MenuUploadWithProgressProps) {
  const uploadState = useMenuUploadState();

  const handleFileSelect = useCallback(
    (file: File) => {
      // Start compression state
      uploadState.startCompression();

      // Simulate compression progress
      let progress = 0;
      const compressionInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) {
          progress = 100;
          clearInterval(compressionInterval);

          // Move to uploading state
          uploadState.startUploading();

          // Simulate upload progress
          let uploadProgress = 0;
          const uploadInterval = setInterval(() => {
            uploadProgress += Math.random() * 25;
            if (uploadProgress > 100) {
              uploadProgress = 100;
              clearInterval(uploadInterval);

              // Complete successfully
              uploadState.completeSuccess();

              // Call success callback
              setTimeout(() => {
                onSuccess(file);
              }, 500);
            } else {
              uploadState.setProgress(uploadProgress);
            }
          }, 300);
        } else {
          uploadState.setProgress(progress);
        }
      }, 300);
    },
    [uploadState, onSuccess]
  );

  const handleError = useCallback(
    (error: string) => {
      uploadState.setError(error);
      onError(error);
    },
    [uploadState, onError]
  );

  const handleReset = useCallback(() => {
    uploadState.reset();
  }, [uploadState]);

  const isUploadInProgress = uploadState.isCompressing || uploadState.isUploading;

  return (
    <div className="menu-upload-with-progress">
      {/* File input - only visible when not in success state */}
      {!uploadState.isSuccess && (
        <>
          <MenuUploadInput
            onFileSelect={handleFileSelect}
            onError={handleError}
            isLoading={isUploadInProgress}
            disabled={disabled || isUploadInProgress}
            errorMessage={uploadState.isError && uploadState.error ? uploadState.error : undefined}
          />
        </>
      )}

      {/* Progress feedback */}
      <MenuUploadProgress
        state={uploadState.state}
        error={uploadState.error}
        progress={uploadState.progress}
      />

      {/* Retry button for success or error states */}
      {(uploadState.isSuccess || uploadState.isError) && (
        <div className="upload-actions">
          <button onClick={handleReset} className="retry-button" aria-label="Upload another file">
            Upload Another
          </button>
        </div>
      )}

      <style>{`
        .menu-upload-with-progress {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .upload-actions {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .retry-button:hover {
          background-color: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .retry-button:active {
          transform: scale(0.98);
        }

        .retry-button:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 640px) {
          .menu-upload-with-progress {
            gap: 0.75rem;
          }

          .retry-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
