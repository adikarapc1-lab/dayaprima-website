import { ChevronDown } from "lucide-react";

// Memakai elemen <details> native: konten selalu ada di DOM (baik untuk SEO),
// bisa dibuka/tutup tanpa JavaScript, dan aksesibel secara default.
export function FaqAccordion({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <div className="mt-5 space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={index}
          className="group rounded-md border border-ink/10 bg-white shadow-soft"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <ChevronDown
              size={18}
              className="shrink-0 text-forest transition duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="px-5 pb-5 text-sm leading-7 text-ink/70">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
