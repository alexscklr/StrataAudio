import { useNavigate } from "react-router-dom";

function NavigateBackButton() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };

    return (
        <button onClick={handleClick} className="normal">
            &larr; Zurück
        </button>
    );
}

export default NavigateBackButton;