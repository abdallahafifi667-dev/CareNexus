import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Highly configurable generic Popup/Modal Component
 * Acts like a DTO, receiving all configurations via props.
 * Suitable for logout confirmation and other dynamic dialogs.
 */
const PopupConfirm = ({
  isOpen = false,
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
  closeIcon = true,
  colors = {
    bg: "bg-white",
    text: "text-gray-900",
    primaryBtn: "bg-blue-600 hover:bg-blue-700 text-white",
    secondaryBtn: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  },
  size = "md", // sm, md, lg
  direction = "ltr", // ltr or rtl
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && typeof document !== "undefined") return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  const isRTL = direction === "rtl";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          dir={direction}
          style={{ zIndex: 99999 }} // overriding to ensure it appears above everything
        >
          {/* Backdrop click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onCancel}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`relative w-full ${sizeClasses[size] || "max-w-md"} mx-4 ${colors.bg} rounded-xl shadow-2xl overflow-hidden`}
          >
            {/* Close Icon (X) */}
            {closeIcon && (
              <button
                onClick={onCancel}
                className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} p-1.5 rounded-full hover:bg-black/5 transition-colors`}
              >
                <X size={20} className="text-gray-500 hover:text-gray-800" />
              </button>
            )}

            {/* Content Area */}
            <div className={`p-6 md:p-8 ${isRTL ? "text-right" : "text-left"}`}>
              <h3 className={`text-2xl font-semibold mb-3 ${colors.text}`}>
                {title}
              </h3>
              <p className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                {message}
              </p>

              {/* Action Buttons */}
              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse justify-start" : "justify-end"}`}
              >
                {showCancel && (
                  <button
                    onClick={onCancel}
                    className={`px-5 py-2.5 font-medium rounded-lg transition-colors ${colors.secondaryBtn}`}
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={onConfirm}
                  className={`px-5 py-2.5 font-medium rounded-lg shadow-sm transition-colors ${colors.primaryBtn}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupConfirm;
