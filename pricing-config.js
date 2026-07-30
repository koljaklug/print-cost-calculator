// Pricing data for the CMI 3D Print Cost Calculator.
// Edit the values below to change printers, materials, or pricing tiers —
// index.html reads these as globals, no other file needs to change.

const PRINTERS = [
  { name: "Prusa", setupFee: 15, timeCost: 1, materials: ["PLA", "PETG", "TPU", "PVA"] },
  {
    name: "Form 4",
    setupFee: 15,
    timeCost: 3,
    materials: ["BioMed White", "Clear", "Elastic 50A", "Flexible 80A", "Tough 2000", "Silicone 40A", "BioMed Durable"],
  },
  { name: "Fuse", setupFee: 20, timeCost: 3, materials: ["Nylon"] },
];

const MATERIALS = [
  { name: "Nylon", cost: 0.6 },
  { name: "BioMed White", cost: 0.9 },
  { name: "Clear", cost: 0.6 },
  { name: "Elastic 50A", cost: 0.6 },
  { name: "Flexible 80A", cost: 0.6 },
  { name: "Tough 2000", cost: 0.6 },
  { name: "Silicone 40A", cost: 0.6 },
  { name: "PLA", cost: 0.12 },
  { name: "PETG", cost: 0.12 },
  { name: "TPU", cost: 0.12 },
  { name: "PVA", cost: 0.32 },
  { name: "BioMed Durable", cost: 1.35 },
];

// setupMultiplier and materialMultiplier apply to the printer's base setup fee
// and the material's base per-unit cost. Time cost is always charged in full.
const PRICING_STAGES = {
  internal: { label: "Internal", setupMultiplier: 0.5, materialMultiplier: 1.5, bg: "bg-blue-100", swatch: "bg-blue-500" },
  external: { label: "External", setupMultiplier: 1, materialMultiplier: 4, bg: "bg-slate-200", swatch: "bg-slate-500" },
  b2b: { label: "B2B", setupMultiplier: 0.5, materialMultiplier: 2, bg: "bg-red-100", swatch: "bg-red-500" },
};
