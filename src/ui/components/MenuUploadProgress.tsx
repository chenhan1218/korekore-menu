/**
 * MenuUploadProgress Component
 * Displays upload progress with visual feedback for different states
 *
 * Features:
 * - Shows progress bar during compression and uploading
 * - Displays state-specific messages (compressing, uploading, success, error)
 * - Success icon on completion
 * - Error icon and message on failure
 * - Accessible progress bar with ARIA attributes
 */

interface MenuUploadProgressProps {
  state: 'idle' | 'compressing' | 'uploading' | 'success' | 'error';
  error: string | null;
  progress: number;
}

/**
 * MenuUploadProgress Component
 *
 * @param state - Current upload state
 * @param error - Error message if state is 'error'
 * @param progress - Progress percentage (0-100)
 */
export function MenuUploadProgress({ state, error, progress }: MenuUploadProgressProps) {
  // Don't render for idle state
  if (state === 'idle') {
    return <div className="upload-progress hidden" />;
  }

  const isLoading = state === 'compressing' || state === 'uploading';
  const isSuccess = state === 'success';
  const isError = state === 'error';

  return (
    <div className={`upload-progress state-${state}`}>
      {isLoading && (
        <div className="progress-container">
          <div className="progress-message">
            {state === 'compressing' ? '📦 Compressing image...' : '📤 Uploading...'}
          </div>

          <div
            className="progress-bar"
            role="progressbar"
            aria-label={`Upload progress: ${progress}%`}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <div className="progress-text">{progress}%</div>
        </div>
      )}

      {isSuccess && (
        <div className="success-container">
          <div className="success-icon">✅</div>
          <div className="success-message">Upload successful!</div>
        </div>
      )}

      {isError && (
        <div className="error-container" role="alert">
          <div className="error-icon">❌</div>
          <div className="error-message">{error || 'Upload failed'}</div>
        </div>
      )}

      <style>{`
        .upload-progress {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          animation: slideIn 0.3s ease;
        }

        .upload-progress.hidden {
          display: none;
        }

        .upload-progress.state-compressing {
          background-color: #f0f9ff;
          border: 1px solid #bfdbfe;
        }

        .upload-progress.state-uploading {
          background-color: #f0f9ff;
          border: 1px solid #bfdbfe;
        }

        .upload-progress.state-success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .upload-progress.state-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Progress Loading Styles */
        .progress-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .progress-message {
          font-size: 0.95rem;
          font-weight: 500;
          color: #1e40af;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #dbeafe;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1e40af);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .progress-text {
          text-align: right;
          font-size: 0.85rem;
          color: #1e40af;
          font-weight: 600;
        }

        /* Success Styles */
        .success-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .success-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .success-message {
          font-size: 0.95rem;
          color: #166534;
          font-weight: 500;
        }

        /* Error Styles */
        .error-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .error-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .error-message {
          font-size: 0.95rem;
          color: #991b1b;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .upload-progress {
            padding: 0.75rem;
          }

          .progress-message {
            font-size: 0.9rem;
          }

          .success-message {
            font-size: 0.9rem;
          }

          .error-message {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
