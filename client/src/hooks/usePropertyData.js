// src/hooks/usePropertyData.js
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export default function usePropertyData() {
  const rawData = useLoaderData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rawData) {
      setError("Property not found.");
      setLoading(false);
      return;
    }
    try {
      let data = rawData;
      if (rawData.post) data = rawData.post;
      else if (rawData.data) data = rawData.data;

      const normalized = {
        id: data.id,
        title: data.title || "Untitled Property",
        address: data.address || null,
        city: data.city || null,
        price: data.price || 0,
        listingType: data.listingType || "rent",
        property: data.property || "Property",
        status: data.status || "available",
        bedroom: data.bedroom ?? null,
        bathroom: data.bathroom ?? null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        images: data.images?.length ? data.images : (data.image ? [data.image] : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"]),
        description: data.postDetails?.desc || data.description || null,
        utilities: data.postDetails?.utilities || null,
        pet: data.postDetails?.pet || null,
        size: data.postDetails?.size ?? null,
        school: data.postDetails?.school ?? null,
        bus: data.postDetails?.bus ?? null,
        restaurant: data.postDetails?.restaurant ?? null,
        amenities: data.amenities?.length ? data.amenities : null,
        user: data.user || null,
        createdAt: data.createdAt ? new Date(data.createdAt) : null,
      };
      setProperty(normalized);
    } catch (err) {
      setError("Failed to load property data.");
    } finally {
      setLoading(false);
    }
  }, [rawData]);

  return { property, loading, error };
}