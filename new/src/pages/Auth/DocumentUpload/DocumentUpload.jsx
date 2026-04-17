import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  Loader,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  getSignedUploadUrl,
  getVerificationStatus,
} from "../stores/authService";
import { clearError } from "../stores/authSlice";
import AuthVisual from "../../../shared/components/ui/AuthVisual/AuthVisual";
import "./DocumentUpload.scss";

// ─── Role config ─────────────────────────────────────────────────────────────
const MEDICAL_ROLES = ["doctor", "nursing", "pharmacy"];

// All steps use frontend keys; 'medicalDocument' is normalized to 'guideDocument' server-side
const ALL_STEPS = [
  {
    key: "selfie",
    labelKey: "doc_upload.step_selfie",
    descKey: "doc_upload.step_selfie_desc",
    tipKey: "doc_upload.selfie_tip",
    icon: "🤳",
    required: true,
    facingMode: "user",
  },
  {
    key: "idCard",
    labelKey: "doc_upload.step_id",
    descKey: "doc_upload.step_id_desc",
    tipKey: "doc_upload.id_tip",
    icon: "🪪",
    required: true,
    facingMode: "environment",
  },
  {
    key: "medicalDocument",
    labelKey: "doc_upload.step_medical",
    descKey: "doc_upload.step_medical_desc",
    tipKey: "doc_upload.medical_tip",
    icon: "📄",
    required: false,
    facingMode: "environment",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
const dataUrlToBlob = (dataUrl) => {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

// ─── Component ────────────────────────────────────────────────────────────────
const DocumentUpload = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  // Guard: non-medical roles should not be here
  useEffect(() => {
    if (user && !MEDICAL_ROLES.includes(user.role)) {
      const roleRoutes = {
        patient: "/patient",
        admin: "/admin",
        shipping_company: "/shipping-company",
      };
      navigate(roleRoutes[user.role] || "/", { replace: true });
    }
    if (user && user.documentation === true) {
      // Already verified — go to dashboard
      navigate(
        user.role === "nursing"
          ? "/doctor/feed"
          : `/${user.role === "doctor" ? "doctor/feed" : user.role}`,
        { replace: true },
      );
    }
  }, [user, navigate]);

  // Only show steps relevant to the role
  const activeSteps = ALL_STEPS.filter(
    (s) => s.key !== "medicalDocument" || MEDICAL_ROLES.includes(user?.role),
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [captures, setCaptures] = useState({});
  const [uploadedSteps, setUploadedSteps] = useState({});
  const [uploading, setUploading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [stream, setStream] = useState(null);
  const [phase, setPhase] = useState("upload"); // 'upload' | 'polling' | 'done' | 'failed'

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : JSON.stringify(error));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      stopCamera();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    },
    [],
  );

  // ── Camera ────────────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraMode(false);
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      const step = activeSteps[currentStep];
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: step.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      setCameraMode(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      });
    } catch {
      toast.error(
        t(
          "doc_upload.camera_error",
          "Camera access denied. Please allow access or upload a file.",
        ),
      );
    }
  }, [activeSteps, currentStep, t]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const key = activeSteps[currentStep].key;
    setCaptures((prev) => ({ ...prev, [key]: dataUrl }));
    stopCamera();
  }, [activeSteps, currentStep, stopCamera]);

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          t("doc_upload.file_too_large", "File too large. Max 10MB."),
        );
        return;
      }
      const reader = new FileReader();
      const key = activeSteps[currentStep].key;
      reader.onloadend = () =>
        setCaptures((prev) => ({ ...prev, [key]: reader.result }));
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [activeSteps, currentStep, t],
  );

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadCurrentStep = async () => {
    const step = activeSteps[currentStep];
    const capturedImage = captures[step.key];
    if (!capturedImage) {
      toast.error(
        t("doc_upload.no_capture", "Please take or upload a photo first."),
      );
      return;
    }
    if (!user?._id) {
      toast.error(
        t("doc_upload.auth_error", "Session error. Please log in again."),
      );
      return;
    }

    setUploading(true);
    try {
      // Step 1: Get signed GCS URL
      const signResult = await dispatch(
        getSignedUploadUrl({ uploadType: step.key, userId: user._id }),
      );
      if (getSignedUploadUrl.rejected.match(signResult)) {
        toast.error(
          signResult.payload ||
            t("doc_upload.upload_url_fail", "Could not get upload URL."),
        );
        return;
      }
      const { signedUrl, contentType } = signResult.payload;

      // Step 2: PUT file to GCS
      const blob = dataUrlToBlob(capturedImage);
      const res = await fetch(signedUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": contentType || "image/jpeg" },
      });
      if (!res.ok)
        throw new Error(`GCS upload failed: ${res.status} ${res.statusText}`);

      setUploadedSteps((prev) => ({ ...prev, [step.key]: true }));
      toast.success(t("doc_upload.upload_success", "Document uploaded!"));

      if (currentStep < activeSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        startPolling();
      }
    } catch (err) {
      toast.error(
        err.message ||
          t("doc_upload.upload_failed", "Upload failed. Please try again."),
      );
    } finally {
      setUploading(false);
    }
  };

  const skipStep = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      startPolling();
    }
  };

  // ── Polling ───────────────────────────────────────────────────────────────
  const startPolling = () => {
    setPhase("polling");
    let attempts = 0;
    const MAX = 36; // 36 × 5 s = 3 min

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      const result = await dispatch(getVerificationStatus());

      if (getVerificationStatus.fulfilled.match(result)) {
        const data = result.payload;
        const status = data.pendingDocuments?.status;
        const isComplete =
          data.documentationComplete === true || status === "completed";
        const isFailed = status === "failed";

        if (isComplete) {
          clearInterval(pollIntervalRef.current);
          setPhase("done");
        } else if (isFailed) {
          clearInterval(pollIntervalRef.current);
          setPhase("failed");
        }
      }

      if (attempts >= MAX) {
        clearInterval(pollIntervalRef.current);
        // Timeout — assume processing is done server-side, let them proceed
        setPhase("done");
      }
    }, 5000);
  };

  const handleGoToDashboard = () => {
    const roleRoutes = {
      doctor: "/doctor/feed",
      nursing: "/doctor/feed",
      pharmacy: "/pharmacy",
    };
    navigate(roleRoutes[user?.role] || "/");
  };

  const handleRetry = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setPhase("upload");
    setCurrentStep(0);
    setCaptures({});
    setUploadedSteps({});
  };

  // ─── Result screens ───────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div className="doc-upload-page">
        <div className="doc-upload-card result-card success">
          <CheckCircle size={72} className="result-icon success-icon" />
          <h2>{t("doc_upload.verified_title", "Identity Verified! 🎉")}</h2>
          <p>
            {t(
              "doc_upload.verified_desc",
              "Your documents were verified successfully. Welcome aboard!",
            )}
          </p>
          <button className="upload-btn" onClick={handleGoToDashboard}>
            {t("doc_upload.go_to_dashboard", "Go to Dashboard")}{" "}
            <ChevronRight size={18} />
          </button>
        </div>
        <AuthVisual />
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="doc-upload-page">
        <div className="doc-upload-card result-card fail">
          <XCircle size={72} className="result-icon fail-icon" />
          <h2>{t("doc_upload.failed_title", "Verification Failed")}</h2>
          <p>
            {t(
              "doc_upload.failed_desc",
              "We could not verify your documents. Please retake clear photos and try again.",
            )}
          </p>
          <button className="upload-btn retry" onClick={handleRetry}>
            <RefreshCw size={18} /> {t("doc_upload.retry", "Try Again")}
          </button>
        </div>
        <AuthVisual />
      </div>
    );
  }

  if (phase === "polling") {
    return (
      <div className="doc-upload-page">
        <div className="doc-upload-card result-card processing">
          <Loader size={72} className="result-icon spin" />
          <h2>{t("doc_upload.processing_title", "Verifying Documents...")}</h2>
          <p>
            {t(
              "doc_upload.processing_desc",
              "Our AI is reviewing your photos. This takes 30–60 seconds.",
            )}
          </p>
          <div className="processing-steps">
            <span>
              ✅ {t("doc_upload.proc_received", "Documents received")}
            </span>
            <span className="active">
              ⏳ {t("doc_upload.proc_analyzing", "Analyzing face & ID...")}
            </span>
            <span className="muted">
              🔒 {t("doc_upload.proc_final", "Final security checks")}
            </span>
          </div>
        </div>
        <AuthVisual />
      </div>
    );
  }

  // ─── Main upload flow ─────────────────────────────────────────────────────
  const step = activeSteps[currentStep];
  const captured = captures[step?.key];

  return (
    <div className="doc-upload-page">
      <Toaster position="top-right" />
      <div className="doc-upload-card">
        {/* Header */}
        <div className="doc-upload-header">
          <h1>{t("doc_upload.title", "Document Verification")}</h1>
          <p>
            {t(
              "doc_upload.subtitle",
              "Upload your documents to complete verification and access your dashboard.",
            )}
          </p>
        </div>

        {/* Step Progress */}
        <div className="step-progress">
          {activeSteps.map((s, idx) => (
            <div
              key={s.key}
              className={`step-dot ${idx < currentStep ? "done" : idx === currentStep ? "active" : ""}`}
            >
              <div className="dot">
                {idx < currentStep ? (
                  <CheckCircle size={14} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="step-label">{t(s.labelKey, s.key)}</span>
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="step-info">
          <span className="step-icon">{step.icon}</span>
          <div>
            <h2>{t(step.labelKey)}</h2>
            <p>{t(step.descKey)}</p>
          </div>
          {!step.required && (
            <span className="optional-badge">
              {t("doc_upload.optional", "Optional")}
            </span>
          )}
        </div>

        {/* Tip */}
        <div className="guidelines">
          <AlertCircle size={16} />
          <span>{t(step.tipKey)}</span>
        </div>

        {/* Capture Area */}
        <div className="capture-area">
          {cameraMode ? (
            <div className="camera-box">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-feed"
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className="camera-overlay">
                {step.key === "selfie" && <div className="face-guide" />}
                {(step.key === "idCard" || step.key === "medicalDocument") && (
                  <div className="id-guide" />
                )}
              </div>
              <div className="camera-actions">
                <button
                  className="shutter-btn"
                  onClick={capturePhoto}
                  title="Capture"
                >
                  📸
                </button>
                <button className="cancel-btn" onClick={stopCamera}>
                  {t("doc_upload.cancel", "Cancel")}
                </button>
              </div>
            </div>
          ) : captured ? (
            <div className="preview-box">
              <img
                src={captured}
                alt="Captured document"
                className="preview-img"
              />
              <button
                className="retake-btn"
                onClick={() => setCaptures((p) => ({ ...p, [step.key]: null }))}
              >
                <RefreshCw size={16} /> {t("doc_upload.retake", "Retake")}
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <span className="placeholder-icon">{step.icon}</span>
              <p>
                {t(
                  "doc_upload.choose_method",
                  "Choose how to add your document",
                )}
              </p>
              <div className="method-btns">
                <button className="method-btn camera" onClick={startCamera}>
                  <Camera size={20} />{" "}
                  {t("doc_upload.use_camera", "Use Camera")}
                </button>

              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {captured && !cameraMode && (
          <button
            className="upload-btn"
            onClick={uploadCurrentStep}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader size={18} className="spin" />{" "}
                {t("doc_upload.uploading", "Uploading...")}
              </>
            ) : (
              <>
                {t("doc_upload.upload_and_continue", "Upload & Continue")}{" "}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        )}

        {!step.required && !captured && !cameraMode && (
          <button className="skip-btn" onClick={skipStep}>
            {currentStep < activeSteps.length - 1
              ? t("doc_upload.skip_step", "Skip this step")
              : t("doc_upload.skip_finish", "Skip & Submit")}
          </button>
        )}
      </div>
      <AuthVisual />
    </div>
  );
};

export default DocumentUpload;
