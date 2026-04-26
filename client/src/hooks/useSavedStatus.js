// src/hooks/useSavedStatus.js
import { useState, useEffect } from "react";
import apiRequest from "../lib/apiRequest";

export default function useSavedStatus(postId, currentUser) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!postId || !currentUser) return;
    const checkSaved = async () => {
      try {
        const res = await apiRequest.get(`/saved-posts/check/${postId}`);
        setIsSaved(res.data?.saved ?? false);
      } catch { /* ignore */ }
    };
    checkSaved();
  }, [postId, currentUser]);

  const toggleSaved = () => {
    if (!currentUser) return null; // we'll handle login modal separately
    const prev = isSaved;
    setIsSaved(!prev);
    (async () => {
      try {
        if (prev) await apiRequest.delete(`/saved-posts/${postId}`);
        else await apiRequest.post(`/saved-posts/${postId}`);
      } catch {
        setIsSaved(prev);
      }
    })();
  };

  return { isSaved, toggleSaved };
}