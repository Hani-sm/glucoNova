export interface DiabetesMedicine {
  name: string;
  category: string;
  genericName?: string;
  commonDosages: string[];
  description: string;
}

export const diabetesMedicines: DiabetesMedicine[] = [
  // Insulin - Long-acting
  {
    name: "Insulin Glargine",
    category: "Insulin - Long-acting",
    genericName: "Lantus, Basaglar, Toujeo",
    commonDosages: ["10 units", "20 units", "30 units"],
    description: "Long-acting basal insulin"
  },
  {
    name: "Insulin Detemir",
    category: "Insulin - Long-acting",
    genericName: "Levemir",
    commonDosages: ["10 units", "20 units"],
    description: "Long-acting basal insulin"
  },
  {
    name: "Insulin Degludec",
    category: "Insulin - Long-acting",
    genericName: "Tresiba",
    commonDosages: ["10 units", "20 units", "30 units"],
    description: "Ultra-long-acting basal insulin"
  },
  
  // Insulin - Rapid-acting
  {
    name: "Insulin Aspart",
    category: "Insulin - Rapid-acting",
    genericName: "NovoLog, Fiasp",
    commonDosages: ["4 units", "6 units", "8 units"],
    description: "Rapid-acting mealtime insulin"
  },
  {
    name: "Insulin Lispro",
    category: "Insulin - Rapid-acting",
    genericName: "Humalog, Admelog",
    commonDosages: ["4 units", "6 units", "8 units"],
    description: "Rapid-acting mealtime insulin"
  },
  {
    name: "Insulin Glulisine",
    category: "Insulin - Rapid-acting",
    genericName: "Apidra",
    commonDosages: ["4 units", "6 units", "8 units"],
    description: "Rapid-acting mealtime insulin"
  },
  
  // Insulin - Intermediate-acting
  {
    name: "NPH Insulin",
    category: "Insulin - Intermediate-acting",
    genericName: "Humulin N, Novolin N",
    commonDosages: ["10 units", "15 units", "20 units"],
    description: "Intermediate-acting insulin"
  },
  
  // Insulin - Pre-mixed
  {
    name: "70/30 Insulin",
    category: "Insulin - Pre-mixed",
    genericName: "Humulin 70/30, Novolin 70/30",
    commonDosages: ["10 units", "20 units"],
    description: "Pre-mixed insulin (70% NPH, 30% Regular)"
  },
  
  // Biguanides
  {
    name: "Metformin",
    category: "Biguanides",
    genericName: "Glucophage, Fortamet",
    commonDosages: ["500mg", "850mg", "1000mg"],
    description: "First-line oral medication for type 2 diabetes"
  },
  {
    name: "Metformin ER",
    category: "Biguanides",
    genericName: "Glucophage XR",
    commonDosages: ["500mg", "750mg", "1000mg"],
    description: "Extended-release metformin"
  },
  
  // Sulfonylureas
  {
    name: "Glipizide",
    category: "Sulfonylureas",
    genericName: "Glucotrol",
    commonDosages: ["5mg", "10mg"],
    description: "Stimulates insulin release"
  },
  {
    name: "Glyburide",
    category: "Sulfonylureas",
    genericName: "DiaBeta, Glynase",
    commonDosages: ["1.25mg", "2.5mg", "5mg"],
    description: "Stimulates insulin release"
  },
  {
    name: "Glimepiride",
    category: "Sulfonylureas",
    genericName: "Amaryl",
    commonDosages: ["1mg", "2mg", "4mg"],
    description: "Stimulates insulin release"
  },
  
  // DPP-4 Inhibitors
  {
    name: "Sitagliptin",
    category: "DPP-4 Inhibitors",
    genericName: "Januvia",
    commonDosages: ["25mg", "50mg", "100mg"],
    description: "Increases insulin secretion"
  },
  {
    name: "Saxagliptin",
    category: "DPP-4 Inhibitors",
    genericName: "Onglyza",
    commonDosages: ["2.5mg", "5mg"],
    description: "Increases insulin secretion"
  },
  {
    name: "Linagliptin",
    category: "DPP-4 Inhibitors",
    genericName: "Tradjenta",
    commonDosages: ["5mg"],
    description: "Increases insulin secretion"
  },
  {
    name: "Alogliptin",
    category: "DPP-4 Inhibitors",
    genericName: "Nesina",
    commonDosages: ["6.25mg", "12.5mg", "25mg"],
    description: "Increases insulin secretion"
  },
  
  // SGLT2 Inhibitors
  {
    name: "Empagliflozin",
    category: "SGLT2 Inhibitors",
    genericName: "Jardiance",
    commonDosages: ["10mg", "25mg"],
    description: "Increases glucose excretion in urine"
  },
  {
    name: "Dapagliflozin",
    category: "SGLT2 Inhibitors",
    genericName: "Farxiga",
    commonDosages: ["5mg", "10mg"],
    description: "Increases glucose excretion in urine"
  },
  {
    name: "Canagliflozin",
    category: "SGLT2 Inhibitors",
    genericName: "Invokana",
    commonDosages: ["100mg", "300mg"],
    description: "Increases glucose excretion in urine"
  },
  {
    name: "Ertugliflozin",
    category: "SGLT2 Inhibitors",
    genericName: "Steglatro",
    commonDosages: ["5mg", "15mg"],
    description: "Increases glucose excretion in urine"
  },
  
  // GLP-1 Receptor Agonists
  {
    name: "Semaglutide",
    category: "GLP-1 Receptor Agonists",
    genericName: "Ozempic, Rybelsus",
    commonDosages: ["0.25mg", "0.5mg", "1mg", "2mg"],
    description: "Injectable or oral GLP-1 agonist"
  },
  {
    name: "Dulaglutide",
    category: "GLP-1 Receptor Agonists",
    genericName: "Trulicity",
    commonDosages: ["0.75mg", "1.5mg", "3mg", "4.5mg"],
    description: "Weekly injectable GLP-1 agonist"
  },
  {
    name: "Liraglutide",
    category: "GLP-1 Receptor Agonists",
    genericName: "Victoza",
    commonDosages: ["0.6mg", "1.2mg", "1.8mg"],
    description: "Daily injectable GLP-1 agonist"
  },
  {
    name: "Exenatide",
    category: "GLP-1 Receptor Agonists",
    genericName: "Byetta, Bydureon",
    commonDosages: ["5mcg", "10mcg", "2mg"],
    description: "Injectable GLP-1 agonist"
  },
  
  // Thiazolidinediones
  {
    name: "Pioglitazone",
    category: "Thiazolidinediones",
    genericName: "Actos",
    commonDosages: ["15mg", "30mg", "45mg"],
    description: "Improves insulin sensitivity"
  },
  
  // Alpha-glucosidase Inhibitors
  {
    name: "Acarbose",
    category: "Alpha-glucosidase Inhibitors",
    genericName: "Precose",
    commonDosages: ["25mg", "50mg", "100mg"],
    description: "Slows carbohydrate digestion"
  },
  
  // Meglitinides
  {
    name: "Repaglinide",
    category: "Meglitinides",
    genericName: "Prandin",
    commonDosages: ["0.5mg", "1mg", "2mg"],
    description: "Stimulates rapid insulin release"
  },
  {
    name: "Nateglinide",
    category: "Meglitinides",
    genericName: "Starlix",
    commonDosages: ["60mg", "120mg"],
    description: "Stimulates rapid insulin release"
  },
  
  // Combination Medications
  {
    name: "Metformin/Sitagliptin",
    category: "Combination Medications",
    genericName: "Janumet",
    commonDosages: ["50mg/500mg", "50mg/1000mg"],
    description: "Combination of metformin and DPP-4 inhibitor"
  },
  {
    name: "Empagliflozin/Metformin",
    category: "Combination Medications",
    genericName: "Synjardy",
    commonDosages: ["5mg/500mg", "12.5mg/500mg"],
    description: "Combination of SGLT2 inhibitor and metformin"
  },
];

export function searchDiabetesMedicines(query: string): DiabetesMedicine[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return diabetesMedicines.filter(med => {
    const nameMatch = med.name.toLowerCase().includes(lowerQuery);
    const genericMatch = med.genericName?.toLowerCase().includes(lowerQuery);
    const categoryMatch = med.category.toLowerCase().includes(lowerQuery);
    
    return nameMatch || genericMatch || categoryMatch;
  }).slice(0, 10); // Limit to top 10 results
}
