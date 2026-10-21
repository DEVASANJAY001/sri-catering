import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Badge } from './Badge';
import { KolamDivider } from './KolamDivider';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: 'What catering packages and per-leaf prices are offered by Sri Caterers Chennai?',
    answer:
      'We offer budget-friendly to royal wedding packages. Our Tamil Dum Chicken Biryani feast starts from ₹149 per leaf with bread halwa and accompaniments. Our Wood-Fire Mutton Biryani package is ₹269 per leaf with Seeraga Samba mutton biryani, brinjal gravy, and payasam. We also offer all-inclusive mega celebration packages like ₹1,75,000 and ₹1.98 Lakh (600 guests) including live counters, veg feasts, and complete service staff.',
  },
  {
    question: 'Do you provide 100% pure vegetarian and Halal non-vegetarian catering?',
    answer:
      'Yes, absolutely. We maintain strictly separated kitchens, dedicated vessels, and specialized culinary masters for pure vegetarian auspicious functions (Brahmin Muhurtham, Seemantham, Grahapravesam) and 100% Halal certified non-vegetarian feasts prepared with firewood dum cooking.',
  },
  {
    question: 'Which areas in Chennai and Tamil Nadu does Sri Caterers serve?',
    answer:
      'Based centrally in Villivakkam and Perambur, we serve all areas across Chennai including Anna Nagar, T. Nagar, Velachery, Porur, Guindy, OMR, Tambaram, Kolathur, Ambattur, and Mogappair. We also cater destination weddings and major events in Tiruvallur, Kanchipuram, Chengalpattu, Vellore, and throughout Tamil Nadu.',
  },
  {
    question: 'What is included with your traditional banana-leaf service?',
    answer:
      'Every banana-leaf feast includes fresh farm-harvested plantain leaves, trained uniformed service boys to serve food in traditional Tamil sequence, roll paper, and packaged drinking water bottles. Our staff also ensures clean and prompt dining hall clearing after every round of dining.',
  },
  {
    question: 'Do you offer live food counters and beverage stalls for wedding receptions?',
    answer:
      'Yes! We provide interactive live stalls including Kumbakonam Degree Filter Coffee, live Mojito & Mocktail bars, Fruit Salad counters, Ice Cream with Mukkani (Mango, Jackfruit, Banana), Hot Beeda (Paan) stalls, and live Chaat or Dosai stations.',
  },
  {
    question: 'How early should we book Sri Caterers for peak Tamil Muhurtham dates?',
    answer:
      'For auspicious Tamil Muhurtham dates (Chithirai, Vaikasi, Aavani, Thai), we recommend booking 1 to 3 months in advance to secure your date. For intimate poojas, housewarmings, birthdays, and corporate events, we can accommodate bookings 3 to 7 days in advance.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Structured Data for Google Rich Results (FAQPage)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="bg-stone-50 py-10 sm:py-16 border-t border-stone-200" id="faqs">
      {/* Schema Injection for FAQPage Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <Badge variant="maroon" size="sm">
            <HelpCircle className="w-3 h-3 mr-1 inline" />
            Frequently Asked Questions
          </Badge>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-maroon-950">
            Frequently Asked Questions about Sri Caterers
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
            Everything you need to know about our catering packages, pricing, serving styles, and booking across Chennai.
          </p>
          <KolamDivider theme="gold" className="my-2" />
        </div>

        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50/60 transition-colors focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-xs sm:text-base text-maroon-950">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-maroon-800 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
