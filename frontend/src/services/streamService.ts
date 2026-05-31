// ── Resource data (from Resources_-_Counselling.csv) ─────────────────────────
export interface Resource {
  title: string;
  crime: string;
  city: string;
  description: string;
  website: string;
  phone: string;
  email: string;
}

export const RESOURCES: Resource[] = [
  {
    title: "The Hope for Wellness Helpline (for Indigenous peoples)",
    crime: "Suicide Crisis, Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "The Hope for Wellness Helpline is available to all Indigenous people across Canada. Experienced and culturally competent counsellors are reachable by telephone and online 'chat' 24 hours a day, 7 days a week.",
    website: "https://www.hopeforwellness.ca/",
    phone: "1-855-242-3310",
    email: "",
  },
  {
    title: "Kids Help Phone (for children and youth)",
    crime: "Suicide Crisis, Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "Kids Help Phone's e-mental health services are available 24/7 across Canada for kids, teens and young adults. Start a confidential conversation with a real person you can trust.",
    website: "https://kidshelpphone.ca/",
    phone: "1-800-668-6868",
    email: "",
  },
  {
    title: "Foundry (for children and youth)",
    crime: "Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "If you are a young individual aged 12-24 in BC, Foundry can offer integrated services at one of their 16 local centres, via foundrybc.ca, or through the free Foundry BC app.",
    website: "https://foundrybc.ca/get-support/find-a-centre/",
    phone: "",
    email: "",
  },
  {
    title: "Reduced-Cost Counselling Options List (compiled by Willowtree Counselling)",
    crime: "Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "A resource list of lower-cost, sliding-scale and free counselling services in Metro Vancouver, provided by public organizations. Updated quarterly by Willow Tree Counselling.",
    website: "https://willowtreecounselling.ca/wp-content/themes/willowtree/reduced-cost-counselling.pdf",
    phone: "",
    email: "",
  },
  {
    title: "Fraser Health Mental Health Centres",
    crime: "Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "Provides trauma-informed support to adult (19+) residents experiencing mental illness and substance issues, including medication management, psychological interventions, and community referrals.",
    website: "https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/mental-health-centres/mental-health-centres",
    phone: "1-833-866-6478",
    email: "",
  },
  {
    title: "Moving Forward Family Services",
    crime: "Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "A non-profit agency providing free short-term and affordable long-term counselling to anyone in Canada via in-person, online, or over the phone. Everyone is welcome regardless of age, race, gender, finances, or location.",
    website: "https://movingforward.help/counselling-service-request-form",
    phone: "",
    email: "",
  },
  {
    title: "Free Counselling Society Canada",
    crime: "Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "100% volunteer-run, free counselling open to all Canadians. Services available in many languages: English, Arabic, Cantonese, Hindi, Mandarin, Punjabi, Spanish, Tagalog, Vietnamese, and more.",
    website: "https://www.freecounsellingcanada.ca/",
    phone: "(647) 490-2992 / (778) 200-7823",
    email: "",
  },
  {
    title: "S.U.C.C.E.S.S. Individual & Family Counselling",
    crime: "Mental Health Concerns, Counselling",
    city: "New Westminster, Surrey, Vancouver, Richmond, North Vancouver, Burnaby, West Vancouver, Langley, Tri-Cities, Delta, White Rock, Other cities in BC, Canada",
    description: "Multi-lingual counselling services supporting individuals and families to navigate life challenges and build skills and resiliency for the future.",
    website: "https://successbc.ca/counselling-crisis-support/services/counselling/",
    phone: "604-408-7266",
    email: "family.youth@success.bc.ca",
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────
export type ConversationStep = "init" | "askCity" | "showResults";

export interface ConversationState {
  step: ConversationStep;
  detectedKeywords: string[];
  city: string | null;
}

// ── Keyword map ───────────────────────────────────────────────────────────────
const KEYWORD_MAP: Record<string, string[]> = {
  "Mental Health Concerns": [
    "mental health", "anxiety", "depression", "stress", "counselling", "counseling",
    "therapy", "therapist", "psychiatric", "mental illness", "emotional", "overwhelmed",
    "burnout", "trauma", "ptsd", "grief", "sad", "sadness", "hopeless", "lonely",
  ],
  "Suicide Crisis": [
    "suicide", "suicidal", "kill myself", "end my life", "self-harm", "self harm",
    "hurt myself", "don't want to live", "crisis",
  ],
  "Counselling": [
    "talk to someone", "need help", "support", "counsellor", "counselor",
    "mental support", "someone to talk", "therapist", "help me",
  ],
};

// ── City list ─────────────────────────────────────────────────────────────────
const KNOWN_CITIES = [
  "surrey", "vancouver", "burnaby", "richmond", "langley",
  "new westminster", "north vancouver", "west vancouver",
  "delta", "white rock", "coquitlam", "port moody", "port coquitlam",
  "tri-cities", "tri cities",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function detectKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const matched = new Set<string>();
  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.add(category);
    }
  }
  return Array.from(matched);
}

function detectCity(text: string): string | null {
  const lower = text.toLowerCase();
  return KNOWN_CITIES.find((city) => lower.includes(city)) ?? null;
}

function filterResources(keywords: string[], city: string | null): Resource[] {
  return RESOURCES.filter((r) => {
    const keywordMatch =
      keywords.length === 0 ||
      keywords.some((kw) => r.crime.toLowerCase().includes(kw.toLowerCase()));
    const cityMatch =
      !city || r.city.toLowerCase().includes(city.toLowerCase());
    return keywordMatch && cityMatch;
  });
}

function formatResources(resources: Resource[]): string {
  if (resources.length === 0) {
    return "I wasn't able to find specific resources for your area, but please reach out to a general helpline. You can also visit https://www.fraserhealth.ca for more options.";
  }
  const lines = resources.slice(0, 3).map((r) => {
    const contact = [r.phone, r.email, r.website].filter(Boolean).join(" | ");
    return `• ${r.title}\n  ${r.description.split("\n")[0]}\n  ${contact}`;
  });
  return (
    `Here are some counselling resources that may help you:\n\n` +
    lines.join("\n\n") +
    (resources.length > 3
      ? `\n\n...and ${resources.length - 3} more available resources in your area.`
      : "")
  );
}

// ── Main stream function ──────────────────────────────────────────────────────
export async function streamResponse(
  message: string,
  state: ConversationState
): Promise<{ reply: string; nextState: ConversationState }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

  const keywords = detectKeywords(message);
  const city = detectCity(message);

  // ── Step: init → detect concern → ask city
  if (state.step === "init") {
    const detectedKeywords = keywords.length > 0 ? keywords : ["Counselling"];
    const cityFound = city;

    if (cityFound) {
      // Got both concern + city in one message — show results
      const resources = filterResources(detectedKeywords, cityFound);
      return {
        reply: formatResources(resources),
        nextState: { step: "showResults", detectedKeywords, city: cityFound },
      };
    }

    return {
      reply: "Thank you for reaching out. What **city** are you primarily looking for help in? (e.g. Surrey, Vancouver, Burnaby…)",
      nextState: { step: "askCity", detectedKeywords, city: null },
    };
  }

  // ── Step: askCity → get city → show results
  if (state.step === "askCity") {
    const cityFound = city || message.trim().toLowerCase();
    const resources = filterResources(state.detectedKeywords, cityFound);
    return {
      reply:
        "Got it! Here are some options that may help:\n\n- **Counselling** services near you\n- **Crisis lines** available 24/7\n- **Safe housing** resources\n\nWhat **city** are you in?" +
        formatResources(resources).replace(/^Here are.*?\n\n/, ""),
      nextState: { step: "showResults", detectedKeywords: state.detectedKeywords, city: cityFound },
    };
  }

  // ── Step: showResults → follow-up
  return {
    reply: "Is there anything else I can help you with? If you need different resources or have more questions, feel free to ask.",
    nextState: { ...state, step: "init" },
  };
}