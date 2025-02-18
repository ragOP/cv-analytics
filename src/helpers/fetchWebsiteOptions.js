import { BACKEND_URL } from "../constants";

export const fetchWebsiteOptions = async () => {
  const response = await fetch(`${BACKEND_URL}/api/analytics/all-website-views`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
