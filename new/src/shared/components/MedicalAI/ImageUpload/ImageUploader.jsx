import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setUploadedImage, setAnalyzing, setAnalysisResult } from '../../../../store/slices/aiImageSlice';
import { setImageContext } from '../../../../store/slices/aiChatSlice';
import { GeminiAPI } from '../../../../utils/gemini';
import { CloudUpload, Camera, RefreshCw, Loader2, Image as ImageIcon } from 'lucide-react';
import './ImageUploader.scss';

const ImageUploader = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uploadedImage, isAnalyzing } = useSelector((state) => state.aiImage);
  const language = useSelector((state) => state.aiApp.language);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (file) => {
    dispatch(setAnalyzing(true));
    const previewUrl = URL.createObjectURL(file);
    dispatch(setUploadedImage(previewUrl));

    try {
      const result = await GeminiAPI.analyzeImage(file);
      dispatch(setAnalysisResult(result.analysis));
      dispatch(setImageContext({
        imageData: previewUrl,
        analysis: result.analysis,
      }));
    } catch (error) {
      console.error('Image processing error:', error);
      dispatch(setAnalysisResult(t('medical_ai.uploader.error_fallback')));
    } finally {
      dispatch(setAnalyzing(false));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader-card">
      <div className="uploader-header">
        <Camera size={20} className="icon-blue" />
        <h2>{t('medical_ai.uploader.header')}</h2>
      </div>

      {!uploadedImage ? (
        <div
          className="upload-drop-zone"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={triggerFileInput}
        >
          <CloudUpload size={48} className="icon-primary" />
          <h3>{t('medical_ai.uploader.drop_zone.title')}</h3>
          <p>{t('medical_ai.uploader.drop_zone.subtitle')}</p>
          <div className="support-info">
            {t('medical_ai.uploader.drop_zone.supports')}
          </div>
        </div>
      ) : (
        <div className="preview-container">
          <div className="image-wrapper">
            <img src={uploadedImage} alt="Medical scan" className={isAnalyzing ? 'analyzing' : ''} loading="lazy" />
            {isAnalyzing && (
              <div className="analysis-overlay">
                <Loader2 size={32} className="spinning" />
                <p>{t('medical_ai.uploader.analyzing')}</p>
              </div>
            )}
          </div>

          <button onClick={triggerFileInput} className="change-img-btn" disabled={isAnalyzing}>
            <RefreshCw size={16} />
            <span>{t('medical_ai.uploader.change_img')}</span>
          </button>
        </div>
      )}

      <div className="advanced-info">
        <h3>{t('medical_ai.uploader.tech.title')}</h3>
        <p>{t('medical_ai.uploader.tech.desc')}</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden-input"
      />
    </div>
  );
};

export default ImageUploader;
