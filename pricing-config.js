// Pricing data for the CMI 3D Print Cost Calculator.
// Edit the values below to change printers, materials, or pricing tiers —
// index.html reads these as globals, no other file needs to change.

const PRINTERS = [
  { name: "Prusa", setupFee: 15, timeCost: 1, materials: ["PLA", "PETG", "TPU", "PVA"] },
  {
    name: "Form 4",
    setupFee: 15,
    timeCost: 3,
    materials: ["Clear", "Flex 50A", "Flex 80A", "Tough 2000", "Silicone 40A", "BioMed White", "BioMed Clear", "ESD"],
  },
  { name: "Fuse", setupFee: 20, timeCost: 3, materials: ["Nylon"] },
];

const MATERIALS = [
  { name: "Nylon", cost: 0.16 },
  { name: "BioMed White", cost: 0.28 },
  { name: "Clear", cost: 0.1 },
  { name: "Flex 50A", cost: 0.2 },
  { name: "Flex 80A", cost: 0.2 },
  { name: "Tough 2000", cost: 0.15 },
  { name: "Silicone 40A", cost: 0.35 },
  { name: "PLA", cost: 0.03 },
  { name: "PETG", cost: 0.03 },
  { name: "TPU", cost: 0.03 },
  { name: "PVA", cost: 0.03 },
  { name: "BioMed Clear", cost: 0.4 },
  { name: "ESD", cost: 0.23 },
];

// setupMultiplier and materialMultiplier apply to the printer's base setup fee
// and the material's base per-unit cost. Time cost is always charged in full.
const PRICING_STAGES = {
  internal: { label: "Internal", setupMultiplier: 0.5, materialMultiplier: 1.5, bg: "bg-blue-100", swatch: "bg-blue-500" },
  external: { label: "External", setupMultiplier: 1, materialMultiplier: 3.5, bg: "bg-slate-200", swatch: "bg-slate-500" },
  b2b: { label: "B2B", setupMultiplier: 0.5, materialMultiplier: 1.5, bg: "bg-red-100", swatch: "bg-red-500" },
};
