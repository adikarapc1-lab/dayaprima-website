export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export function whatsappUrl({ number, projectName, source = "website", message }) {
  const text = message
    ? message
    : projectName
      ? `Halo Dayaprima, saya tertarik dengan ${projectName}. Mohon info lebih lanjut.`
      : "Halo Dayaprima, saya ingin konsultasi tentang perumahan.";

  return `https://wa.me/${number}?text=${encodeURIComponent(`${text} Source: ${source}`)}`;
}
