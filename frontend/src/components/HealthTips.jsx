import React from 'react';
import { useTranslation } from 'react-i18next';

const HealthTips = () => {
    const { t } = useTranslation();

    return (
        <div className="health-tips-container">
            <div className="health-tips-card">
                <h2>{t('tips.title')}</h2>

                <div className="disclaimer-box">
                    <p>{t('tips.disclaimer')}</p>
                </div>

                <div className="tips-section">
                    <h3>{t('tips.exercises')}</h3>
                    <ul className="tips-list">
                        <li>{t('tips.exercise1')}</li>
                        <li>{t('tips.exercise2')}</li>
                        <li>{t('tips.exercise3')}</li>
                        <li>{t('tips.exercise4')}</li>
                    </ul>
                </div>

                <div className="tips-section">
                    <h3>{t('tips.tips')}</h3>
                    <ul className="tips-list">
                        <li>{t('tips.tip1')}</li>
                        <li>{t('tips.tip2')}</li>
                        <li>{t('tips.tip3')}</li>
                        <li>{t('tips.tip4')}</li>
                    </ul>
                </div>
            </div>

            <div className="footer-disclaimer">
                <p>🔒 {t('footer.privacy')}</p>
                <p>⚠️ {t('footer.disclaimer')}</p>
            </div>
        </div>
    );
};

export default HealthTips;