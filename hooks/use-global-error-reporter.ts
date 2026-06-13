"use client";

import { reportError } from "@/lib/utils";
import { useEffect } from "react";

export function useGlobalErrorReporter(storeId?: string) {
	useEffect(() => {
		const isOwnScript = (source: string | EventTarget | null | undefined) => {
			return typeof source === "string" && source.startsWith(window.location.origin);
		};

		window.onerror = function (message, source, lineno, colno, error) {
			if (!isOwnScript(source)) return;
			reportError({
				message,
				source,
				lineno,
				colno,
				stack: error?.stack || null,
				tags: ["frontend", "window.onerror"],
				storeId,
			});
		};

		window.onunhandledrejection = function (event) {
			const reason = event.reason;
			reportError({
				message: reason?.message || String(reason) || "Unhandled rejection",
				stack: reason?.stack || null,
				tags: ["frontend", "unhandledrejection"],
				storeId,
			});
		};

		return () => {
			window.onerror = null;
			window.onunhandledrejection = null;
		};
	}, [storeId]);
}
