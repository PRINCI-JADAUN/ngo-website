import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultSiteContent } from "../data/siteData";

const CONTENT_KEY     = "wings-and-tails-site-content-v3";  // bumped → forces cache clear
const SUBMISSIONS_KEY = "wings-and-tails-form-submissions-v2"; // bumped → forces cache clear

// Wipe any stale keys from older versions on every load
const STALE_KEYS = [
  "wings-and-tails-site-content-v2",
  "wings-and-tails-site-content-v1",
  "wings-and-tails-site-content",
  "wings-and-tails-form-submissions",
];
if (typeof window !== "undefined") {
  STALE_KEYS.forEach((k) => window.localStorage.removeItem(k));
}

const SiteContentContext = createContext(null);

function readStorage(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);

  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function buildFormData(data) {
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    return data;
  }

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else if (typeof File !== "undefined" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value.toString());
    }
  });

  return formData;
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => readStorage(CONTENT_KEY, defaultSiteContent));
  const [submissions, setSubmissions] = useState(() => readStorage(SUBMISSIONS_KEY, []));
  const [confirmedSubmissions, setConfirmedSubmissions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  }, [submissions]);

  const loadBackendData = async () => {
    try {
      const [contentResponse, submissionsResponse, confirmedResponse] = await Promise.all([
        fetch("/api/content"),
        fetch("/api/forms"),
        fetch("/api/forms?confirmed=true&status=active"),
      ]);

      if (contentResponse.ok) {
        const serverContent = await contentResponse.json();
        setContent(serverContent);
      }

      if (submissionsResponse.ok) {
        const serverSubmissions = await submissionsResponse.json();
        setSubmissions(serverSubmissions);
      }

      if (confirmedResponse.ok) {
        const confirmed = await confirmedResponse.json();
        setConfirmedSubmissions(confirmed);
      }
    } catch (error) {
      console.error("Failed to load backend data:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadBackendData();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadBackendData, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({
      content,
      submissions,
      confirmedSubmissions,
      isLoaded,
      async saveContent(nextContent) {
        setContent(nextContent);

        try {
          const response = await fetch("/api/content", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nextContent),
          });

          if (response.ok) {
            const updatedContent = await response.json();
            setContent(updatedContent);
          } else {
            console.error("Failed to save content to backend.");
          }
        } catch (error) {
          console.error("Failed to save content to backend:", error);
        }
      },
      async resetContent() {
        setContent(defaultSiteContent);

        try {
          await fetch("/api/content", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(defaultSiteContent),
          });
        } catch (error) {
          console.error("Failed to reset content on backend:", error);
        }
      },
      async addSubmission(type, formData) {
        try {
          const payload = buildFormData(formData);
          const response = await fetch(`/api/forms/${type}`, {
            method: "POST",
            body: payload,
          });

          if (response.ok) {
            const result = await response.json();
            setSubmissions((current) => [result, ...current]);
            return result;
          }

          const fallback = {
            id: `${type}-${Date.now()}`,
            type,
            createdAt: new Date().toISOString(),
            values: Object.fromEntries(
              typeof payload.entries === "function" ? payload.entries() : Object.entries(formData),
            ),
          };
          setSubmissions((current) => [fallback, ...current]);
          return fallback;
        } catch (error) {
          console.error("Submission failed, saving locally:", error);

          const payload = buildFormData(formData);
          const fallback = {
            id: `${type}-${Date.now()}`,
            type,
            createdAt: new Date().toISOString(),
            values: Object.fromEntries(
              typeof payload.entries === "function" ? payload.entries() : Object.entries(formData),
            ),
          };
          setSubmissions((current) => [fallback, ...current]);
          return fallback;
        }
      },
      async refreshSubmissions() {
        try {
          await loadBackendData();
        } catch (error) {
          console.error("Failed to refresh submissions:", error);
        }
      },
      async refreshContent() {
        try {
          await loadBackendData();
        } catch (error) {
          console.error("Failed to refresh content:", error);
        }
      },
      async clearSubmissions() {
        setSubmissions([]);

        try {
          await fetch("/api/forms", {
            method: "DELETE",
          });
        } catch (error) {
          console.error("Failed to clear submissions on backend:", error);
        }
      },
    }),
    [content, submissions, confirmedSubmissions, isLoaded],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }

  return context;
}
