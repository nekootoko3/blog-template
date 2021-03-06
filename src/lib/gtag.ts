import { Event } from "../types/googleAnalytics/event";

export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";
export const existsGaId = GA_ID !== "";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag("config", GA_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label }: Event) => {
  if (!existsGaId) {
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: JSON.stringify(label),
  });
};
