"use client";
import { env } from "../env";

const BASE_URL = env.NEXT_PUBLIC_API_URL;

export const fetchJsonApi = async (endpoint: string, options?: RequestInit) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};
