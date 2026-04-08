import { useSafeBackNavigation } from "../lib/useSafeBackNavigation";
import "./MobileBackButton.css";

export default function MobileBackButton({ onBeforeBack, label = "Back" }) {
	const { goBack } = useSafeBackNavigation("/");

	const handleBack = () => {
		onBeforeBack?.();
		goBack();
	};

	return (
		<button
			type="button"
			className="mobile-back-btn"
			onClick={handleBack}
			aria-label="Go back"
			title={label}>
			<span className="mobile-back-btn-arrow">◄</span>
			<span className="mobile-back-btn-label">{label}</span>
		</button>
	);
}
