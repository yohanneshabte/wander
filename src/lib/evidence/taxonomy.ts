export type EvidenceGrade = "A" | "B" | "C" | "D" | "E";
export type HsaFsa = "often" | "lmn" | "rare" | "no" | "rx";
export type FdaStatus =
  | "not_device"
  | "cleared_510k"
  | "approved_drug"
  | "unapproved"
  | "licensed_practice";

export type Modality = {
  key: string;
  name: string;
  family: string;
  blurb: string;
  setting: "wellness" | "clinical" | "hybrid";
  sort: number;
};

export type OutcomeTag = {
  key: string;
  name: string;
  family: string;
  sort: number;
};

export type EvidenceClaim = {
  id: string;
  modalityKey: string;
  claim: string;
  grade: EvidenceGrade;
  population: string;
  caveat: string;
  sourceName: string;
  sourceUrl: string;
  pmid: string | null;
  year: number | null;
  reviewedOn: string;
};

export type Reimbursement = {
  modalityKey: string;
  hsaFsa: HsaFsa;
  fda: FdaStatus;
  lmnNote: string;
  planNote: string;
};

export const GRADE_LABEL: Record<EvidenceGrade, string> = {
  A: "Systematic review / guideline",
  B: "Randomized trials",
  C: "Observational",
  D: "Mechanism / traditional",
  E: "Insufficient",
};

export const HSA_LABEL: Record<HsaFsa, string> = {
  often: "Often eligible as medical care",
  lmn: "Dual-purpose · Letter of Medical Necessity",
  rare: "Rarely · plan-by-plan",
  no: "Personal / not a medical expense",
  rx: "Prescription / clinician-administered",
};

export const FDA_LABEL: Record<FdaStatus, string> = {
  not_device: "Not an FDA-regulated device in this setting",
  cleared_510k: "Some devices 510(k) cleared · not this spa claim",
  approved_drug: "FDA-approved drug",
  unapproved: "Not FDA-approved for this use",
  licensed_practice: "State-licensed practice (CAMTC / similar)",
};

export const OUTCOMES: OutcomeTag[] = [
  { key: "pain", name: "Pain", family: "body", sort: 1 },
  { key: "sleep", name: "Sleep", family: "nervous", sort: 2 },
  { key: "stress", name: "Stress load", family: "nervous", sort: 3 },
  { key: "anxiety", name: "Anxiety", family: "nervous", sort: 4 },
  { key: "circulation", name: "Circulation", family: "body", sort: 5 },
  { key: "recovery", name: "Recovery", family: "body", sort: 6 },
  { key: "mobility", name: "Mobility", family: "body", sort: 7 },
  { key: "skin", name: "Skin", family: "surface", sort: 8 },
  { key: "respiratory", name: "Breathing", family: "body", sort: 9 },
  { key: "lymphatic", name: "Lymph / swelling", family: "body", sort: 10 },
  { key: "cognitive", name: "Focus", family: "nervous", sort: 11 },
  { key: "cardiovascular", name: "Heart / vessels", family: "body", sort: 12 },
  { key: "metabolic", name: "Metabolic", family: "body", sort: 13 },
];

export const MODALITIES: Modality[] = [
  { key: "hydrotherapy", name: "Private hot-tub hydrotherapy", family: "heat_water", blurb: "Warm immersion in a private room. Not a medical pool.", setting: "wellness", sort: 1 },
  { key: "sauna_steam", name: "Sauna or steam", family: "heat_water", blurb: "Heat room attached to a tub or suite.", setting: "wellness", sort: 2 },
  { key: "cold_plunge", name: "Cold plunge", family: "heat_water", blurb: "Short cold immersion after heat.", setting: "wellness", sort: 3 },
  { key: "contrast", name: "Contrast heat and cold", family: "heat_water", blurb: "Infrared or sauna alternating with cold plunge.", setting: "wellness", sort: 4 },
  { key: "massage_swedish", name: "Swedish massage", family: "manual", blurb: "Full-body table work, light to firm.", setting: "wellness", sort: 5 },
  { key: "massage_deep", name: "Deep tissue massage", family: "manual", blurb: "Slower, targeted pressure on muscle layers.", setting: "wellness", sort: 6 },
  { key: "massage_prenatal", name: "Prenatal massage", family: "manual", blurb: "Positioned table work in pregnancy.", setting: "hybrid", sort: 7 },
  { key: "facial", name: "Facial / skin ritual", family: "skin", blurb: "Esthetic facial, not a medical dermatology visit.", setting: "wellness", sort: 8 },
  { key: "body_wrap", name: "Body wrap / scrub", family: "skin", blurb: "Spa wrap or dry brush then massage.", setting: "wellness", sort: 9 },
  { key: "float_rest", name: "Flotation REST", family: "sensory", blurb: "Epsom-salt tank, reduced light and sound.", setting: "wellness", sort: 10 },
  { key: "halotherapy", name: "Halotherapy (salt)", family: "respiratory", blurb: "Dry salt aerosol in a room. Not a medical inhaler.", setting: "wellness", sort: 11 },
  { key: "pressotherapy", name: "Pressotherapy", family: "lymphatic", blurb: "Pneumatic compression suit.", setting: "hybrid", sort: 12 },
  { key: "pemf", name: "PEMF", family: "device", blurb: "Pulsed electromagnetic field mat or coil.", setting: "hybrid", sort: 13 },
  { key: "red_light", name: "Red / near-infrared light", family: "device", blurb: "LED or panel photobiomodulation.", setting: "hybrid", sort: 14 },
  { key: "neurovizr", name: "Light-sound brain reset", family: "sensory", blurb: "Audiovisual stimulation session.", setting: "wellness", sort: 15 },
  { key: "emtt", name: "EMTT", family: "device", blurb: "High-frequency magnetic field, contactless.", setting: "hybrid", sort: 16 },
  { key: "bioenergetics", name: "Bioenergetic scan", family: "scan", blurb: "Educational wellness scan. Not a diagnosis.", setting: "wellness", sort: 17 },
  { key: "peptide_injection", name: "Peptide injection", family: "injectable", blurb: "Clinician-administered peptides. Not a spa-floor add-on.", setting: "clinical", sort: 18 },
];

export const MODALITY_OUTCOMES: [string, string][] = [
  ["hydrotherapy", "stress"],
  ["hydrotherapy", "pain"],
  ["hydrotherapy", "circulation"],
  ["hydrotherapy", "sleep"],
  ["sauna_steam", "cardiovascular"],
  ["sauna_steam", "recovery"],
  ["sauna_steam", "stress"],
  ["cold_plunge", "recovery"],
  ["cold_plunge", "circulation"],
  ["contrast", "recovery"],
  ["contrast", "circulation"],
  ["massage_swedish", "pain"],
  ["massage_swedish", "stress"],
  ["massage_swedish", "anxiety"],
  ["massage_deep", "pain"],
  ["massage_deep", "mobility"],
  ["massage_prenatal", "pain"],
  ["massage_prenatal", "stress"],
  ["facial", "skin"],
  ["body_wrap", "skin"],
  ["body_wrap", "circulation"],
  ["float_rest", "anxiety"],
  ["float_rest", "stress"],
  ["float_rest", "pain"],
  ["float_rest", "sleep"],
  ["halotherapy", "respiratory"],
  ["halotherapy", "skin"],
  ["pressotherapy", "lymphatic"],
  ["pressotherapy", "recovery"],
  ["pemf", "pain"],
  ["pemf", "recovery"],
  ["red_light", "skin"],
  ["red_light", "recovery"],
  ["neurovizr", "cognitive"],
  ["neurovizr", "stress"],
  ["emtt", "pain"],
  ["bioenergetics", "cognitive"],
  ["peptide_injection", "recovery"],
  ["peptide_injection", "metabolic"],
];

export const CLAIMS: EvidenceClaim[] = [
  {
    id: "massage-lbp-nccih",
    modalityKey: "massage_swedish",
    claim: "Massage may give short-term help for low-back pain. Evidence quality is low to moderate, and long-term benefit is not established.",
    grade: "A",
    population: "Adults with low-back pain",
    caveat: "ACP 2017 lists massage as an option for acute/subacute LBP, not as a chronic-LBP recommendation.",
    sourceName: "NCCIH — Massage Therapy for Health",
    sourceUrl: "https://www.nccih.nih.gov/health/providers/digest/massage-therapy-for-health-science",
    pmid: null,
    year: 2018,
    reviewedOn: "2026-09-09",
  },
  {
    id: "massage-ahrq-lbp",
    modalityKey: "massage_deep",
    claim: "AHRQ found massage associated with small short-term improvements in chronic low-back pain versus usual care or sham; strength of evidence was low to moderate depending on the review wave.",
    grade: "A",
    population: "Chronic low-back pain",
    caveat: "Effects are mostly short-term. Not a substitute for a medical workup of red-flag pain.",
    sourceName: "AHRQ / NCBI Bookshelf noninvasive LBP review",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK350276/",
    pmid: null,
    year: 2016,
    reviewedOn: "2026-09-09",
  },
  {
    id: "heat-acute-lbp",
    modalityKey: "hydrotherapy",
    claim: "Superficial heat has moderate-strength evidence versus placebo or no care for acute low-back pain. A private hot tub is heat plus buoyancy, not the same protocol as a heating pad trial.",
    grade: "B",
    population: "Acute non-radicular low-back pain",
    caveat: "Spa immersion is not the studied medical heat pack. Avoid if unstable heart disease, uncontrolled BP, or pregnancy without clinician OK.",
    sourceName: "AHRQ noninvasive treatments for low back pain",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK350276/",
    pmid: null,
    year: 2016,
    reviewedOn: "2026-09-09",
  },
  {
    id: "sauna-laukkanen",
    modalityKey: "sauna_steam",
    claim: "Frequent Finnish sauna bathing was associated with lower fatal cardiovascular events in a large observational cohort. That is association, not a spa-session guarantee.",
    grade: "C",
    population: "Middle-aged Finnish men, traditional sauna",
    caveat: "Observational. Infrared or steam rooms are not the same as the studied sauna habit. Heat stress is unsafe for some cardiac patients.",
    sourceName: "Laukkanen et al., JAMA Internal Medicine",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/25706956/",
    pmid: "25706956",
    year: 2015,
    reviewedOn: "2026-09-09",
  },
  {
    id: "float-feinstein",
    modalityKey: "float_rest",
    claim: "A flotation-REST trial reported reduced anxiety and improved mood after sessions in people with anxiety disorders. Sample was small; replication is limited.",
    grade: "B",
    population: "Adults with anxiety disorders",
    caveat: "Not a treatment for panic in open water, claustrophobia, uncontrolled epilepsy, or open wounds. Not FDA-approved as a psychiatric device.",
    sourceName: "Feinstein et al., PLOS ONE",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/29489824/",
    pmid: "29489824",
    year: 2018,
    reviewedOn: "2026-09-09",
  },
  {
    id: "halo-insufficient",
    modalityKey: "halotherapy",
    claim: "Clinical evidence that dry salt rooms treat asthma, COPD, or skin disease is limited and mixed. Do not replace prescribed inhalers.",
    grade: "E",
    population: "Respiratory and skin conditions (claimed)",
    caveat: "Contraindications listed by operators include active hyperthyroidism and salt allergy. Wellness room ≠ medical speleotherapy.",
    sourceName: "Operator literature vs sparse RCTs — flagged insufficient",
    sourceUrl: "https://www.nccih.nih.gov/",
    pmid: null,
    year: 2024,
    reviewedOn: "2026-09-09",
  },
  {
    id: "pemf-fda-bone",
    modalityKey: "pemf",
    claim: "FDA has cleared specific PEMF devices as bone-growth stimulators. That clearance does not extend to a wellness mat claiming anti-aging or general pain.",
    grade: "B",
    population: "Nonunion fracture (cleared devices)",
    caveat: "Ask which device and indication. Wellness PEMF is not the cleared orthopedic protocol.",
    sourceName: "FDA 510(k) bone growth stimulators (class of devices)",
    sourceUrl: "https://www.fda.gov/medical-devices",
    pmid: null,
    year: 2024,
    reviewedOn: "2026-09-09",
  },
  {
    id: "redlight-derm",
    modalityKey: "red_light",
    claim: "Some LED/red-light devices are 510(k) cleared for wrinkles or minor pain. Dose, wavelength, and device matter; a lounge panel is not a dermatology visit.",
    grade: "B",
    population: "Cosmetic skin; some musculoskeletal pain devices",
    caveat: "Eye protection. Not a cancer treatment. Evidence for athletic recovery is mixed.",
    sourceName: "FDA device clearances + mixed sports-medicine reviews",
    sourceUrl: "https://www.fda.gov/medical-devices",
    pmid: null,
    year: 2024,
    reviewedOn: "2026-09-09",
  },
  {
    id: "presso-lymph",
    modalityKey: "pressotherapy",
    claim: "Pneumatic compression is used medically for lymphedema. Spa pressotherapy copies the garment, not a certified lymphedema protocol.",
    grade: "B",
    population: "Medical lymphedema (clinical devices)",
    caveat: "Avoid with uncontrolled heart failure, DVT, or infection. Spa session is not CDT (complete decongestive therapy).",
    sourceName: "Clinical use of pneumatic compression in lymphedema care",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/",
    pmid: null,
    year: 2020,
    reviewedOn: "2026-09-09",
  },
  {
    id: "peptide-unapproved",
    modalityKey: "peptide_injection",
    claim: "Research-chemical peptides (BPC-157, TB-500, many secretagogues) are not FDA-approved for anti-aging, injury, or wellness. Compounded injectables sit outside spa hydrotherapy.",
    grade: "E",
    population: "Not an approved indication",
    caveat: "Needs a licensed clinician, sterile compounding, and informed consent. Not FSA 'spa add-on'. This house does not inject on the floor.",
    sourceName: "FDA compounding / unapproved peptide warnings",
    sourceUrl: "https://www.fda.gov/drugs/human-drug-compounding",
    pmid: null,
    year: 2023,
    reviewedOn: "2026-09-09",
  },
  {
    id: "prenatal-caution",
    modalityKey: "massage_prenatal",
    claim: "Prenatal massage is widely used for back and hip discomfort in pregnancy. Evidence is limited; positioning and trained therapists matter more than brand of oil.",
    grade: "C",
    population: "Uncomplicated pregnancy",
    caveat: "First trimester and high-risk pregnancy need the obstetrician's OK. Not a substitute for prenatal care.",
    sourceName: "NCCIH massage safety notes + obstetric practice caution",
    sourceUrl: "https://www.nccih.nih.gov/health/massage-therapy-what-you-need-to-know",
    pmid: null,
    year: 2019,
    reviewedOn: "2026-09-09",
  },
  {
    id: "contrast-recovery",
    modalityKey: "contrast",
    claim: "Athletes use contrast water therapy for perceived recovery. Controlled evidence for performance or delayed-onset soreness is mixed and protocol-specific.",
    grade: "D",
    population: "Athletes, healthy adults",
    caveat: "Cardiac disease, Raynaud's, pregnancy, and unsupervised long cold holds are risk. Fire & Ice is a spa protocol, not a study arm.",
    sourceName: "Sports-medicine reviews of contrast water therapy (mixed)",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/",
    pmid: null,
    year: 2021,
    reviewedOn: "2026-09-09",
  },
];

export const REIMBURSEMENT: Reimbursement[] = [
  {
    modalityKey: "massage_swedish",
    hsaFsa: "lmn",
    fda: "licensed_practice",
    lmnNote: "IRS Pub 502 treats therapy as medical when it treats a diagnosed condition. Relaxation massage is personal. A Letter of Medical Necessity from a licensed clinician is what administrators usually want.",
    planNote: "CAMTC massage is a licensed practice in CA, not an FDA device.",
  },
  {
    modalityKey: "massage_deep",
    hsaFsa: "lmn",
    fda: "licensed_practice",
    lmnNote: "Same dual-purpose rule as Swedish. Tie the letter to a condition (e.g. documented LBP), not 'stress dump'.",
    planNote: "Keep the receipt with therapist license #.",
  },
  {
    modalityKey: "massage_prenatal",
    hsaFsa: "lmn",
    fda: "licensed_practice",
    lmnNote: "May qualify when recommended for a pregnancy-related musculoskeletal complaint. Ask the obstetric clinician first.",
    planNote: "Not automatic because it happens at a spa.",
  },
  {
    modalityKey: "hydrotherapy",
    hsaFsa: "lmn",
    fda: "not_device",
    lmnNote: "A soak for fun is personal. Heat/hydro as prescribed therapy can be dual-purpose with an LMN. Administrators often deny spa-day receipts.",
    planNote: "Private tubs are not a hospital hydrotherapy department.",
  },
  {
    modalityKey: "sauna_steam",
    hsaFsa: "lmn",
    fda: "not_device",
    lmnNote: "Same dual-purpose line as gym or sauna: medical necessity letter for a named condition, or it is personal.",
    planNote: "Check the plan. LPFSA/DCFSA usually do not apply.",
  },
  {
    modalityKey: "cold_plunge",
    hsaFsa: "rare",
    fda: "not_device",
    lmnNote: "Cold plunge as a spa extra is almost always personal.",
    planNote: "Unlikely without a very specific clinician protocol.",
  },
  {
    modalityKey: "contrast",
    hsaFsa: "lmn",
    fda: "not_device",
    lmnNote: "Contrast suites are dual-purpose. LMN + diagnosis, or expect a denial.",
    planNote: "SoliVana Fire & Ice is a wellness suite, not PT.",
  },
  {
    modalityKey: "float_rest",
    hsaFsa: "lmn",
    fda: "not_device",
    lmnNote: "Some administrators accept flotation with an LMN for anxiety or chronic pain. Many still deny. Get the letter first.",
    planNote: "Tank is not an FDA-cleared psychiatric device.",
  },
  {
    modalityKey: "halotherapy",
    hsaFsa: "no",
    fda: "not_device",
    lmnNote: "Salt rooms are sold as wellness. Evidence is thin; FSA denials are common.",
    planNote: "Do not drop a prescribed inhaler for a salt session.",
  },
  {
    modalityKey: "pressotherapy",
    hsaFsa: "lmn",
    fda: "cleared_510k",
    lmnNote: "Medical pneumatic compression for lymphedema is a different code path than a spa suit. LMN if the plan will even look at it.",
    planNote: "Ask whether they bill a durable-medical device or a spa visit.",
  },
  {
    modalityKey: "pemf",
    hsaFsa: "lmn",
    fda: "cleared_510k",
    lmnNote: "Cleared bone-growth stimulators can be medical. A wellness PEMF mat is dual-purpose at best.",
    planNote: "Name the device and indication on the receipt.",
  },
  {
    modalityKey: "red_light",
    hsaFsa: "lmn",
    fda: "cleared_510k",
    lmnNote: "Cleared dermatology/pain devices sometimes reimburse. Lounge panels usually do not.",
    planNote: "Wavelength and device model help a reviewer.",
  },
  {
    modalityKey: "neurovizr",
    hsaFsa: "no",
    fda: "not_device",
    lmnNote: "Light-sound wellness sessions are personal expenses in typical plans.",
    planNote: "Not a medical EEG or rTMS.",
  },
  {
    modalityKey: "emtt",
    hsaFsa: "lmn",
    fda: "cleared_510k",
    lmnNote: "If the device is a cleared musculoskeletal unit and a clinician documents necessity, maybe. Spa menu alone is weak.",
    planNote: "Keep device brand on the invoice.",
  },
  {
    modalityKey: "bioenergetics",
    hsaFsa: "no",
    fda: "not_device",
    lmnNote: "Educational scans are not diagnostic tests under Pub 502.",
    planNote: "House copy already says non-medical.",
  },
  {
    modalityKey: "facial",
    hsaFsa: "no",
    fda: "licensed_practice",
    lmnNote: "Cosmetic facials are personal. Medical dermatology is a different visit.",
    planNote: "Esthetician ≠ dermatologist.",
  },
  {
    modalityKey: "body_wrap",
    hsaFsa: "no",
    fda: "not_device",
    lmnNote: "Spa wraps and scrubs are personal care.",
    planNote: "No.",
  },
  {
    modalityKey: "peptide_injection",
    hsaFsa: "rx",
    fda: "unapproved",
    lmnNote: "FDA-approved, clinician-prescribed drugs can be HSA/FSA. Unapproved peptides and 'wellness shots' generally cannot. This is not a tub add-on.",
    planNote: "Needs a medical practice, not a bathhouse POS.",
  },
];

export function mapServiceModalities(serviceId: string, categoryKey: string, name: string): string[] {
  const n = name.toLowerCase();
  if (categoryKey === "rooms") return ["hydrotherapy", "sauna_steam", "cold_plunge"];
  if (categoryKey === "massage") {
    if (n.includes("prenatal")) return ["massage_prenatal"];
    if (n.includes("deep")) return ["massage_deep"];
    if (n.includes("aroma")) return ["massage_swedish"];
    return ["massage_swedish"];
  }
  if (categoryKey === "facial") return ["facial"];
  if (categoryKey === "spa") return n.includes("refresh") ? ["facial"] : ["body_wrap", "massage_swedish"];
  if (categoryKey === "packages") return ["hydrotherapy", "massage_swedish"];
  if (categoryKey === "core") {
    if (n.includes("float")) return ["float_rest"];
    if (n.includes("fire")) return ["contrast", "sauna_steam", "cold_plunge"];
    if (n.includes("presso")) return ["pressotherapy"];
    return ["float_rest"];
  }
  if (categoryKey === "signature") {
    if (n.includes("halo") || n.includes("salt")) return ["halotherapy"];
    if (n.includes("pemf")) return ["pemf"];
    if (n.includes("emtt")) return ["emtt"];
    if (n.includes("red")) return ["red_light"];
    if (n.includes("vizr") || n.includes("neuro")) return ["neurovizr"];
    return ["pemf"];
  }
  if (categoryKey === "scan") return ["bioenergetics"];
  if (categoryKey === "group") return ["float_rest", "contrast"];
  return [];
}
