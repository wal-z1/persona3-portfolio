import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useSafeBackNavigation(fallbackPath = "/") {
	const navigate = useNavigate();
	const location = useLocation();

	const goBack = useCallback(() => {
		const hasHistory =
			typeof window !== "undefined" && window.history.length > 1;
		const currentPath = location.pathname;

		if (hasHistory) {
			navigate(-1);

			window.setTimeout(() => {
				if (window.location.pathname === currentPath) {
					navigate(fallbackPath, { replace: true });
				}
			}, 140);

			return;
		}

		navigate(fallbackPath, { replace: true });
	}, [fallbackPath, location.pathname, navigate]);

	return { goBack };
}
