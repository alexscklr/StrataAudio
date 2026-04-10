import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function NavigateBackButton() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };

    return (
        <button onClick={handleClick} className="normal">
            &larr; {t('common.back')}
        </button>
    );
}

export default NavigateBackButton;