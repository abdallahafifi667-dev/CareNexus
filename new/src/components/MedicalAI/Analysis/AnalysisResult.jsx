import React from 'react';
import { useSelector } from 'react-redux';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AnalysisResult.scss';

const AnalysisResult = () => {
  const { t } = useTranslation();
  const { analysisResult } = useSelector((state) => state.aiImage);
  const language = useSelector((state) => state.aiApp.language);

  if (!analysisResult) return null;

  return (
    <div className="analysis-result-card">
      <div className="result-header">
        <FileText size={20} className="icon-green" />
        <h2>{t('medical_ai.analysis.title')}</h2>
      </div>
      
      <div className="result-content-box">
        <div className="analysis-text">
          {analysisResult}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
