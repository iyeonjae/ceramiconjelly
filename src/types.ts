export interface Supplier {
  id: string;
  name: string;
  isInternational: boolean;
  specialty: string[];
  contact: string;
  address: string;
  website: string;
  description: string;
  featuredProducts: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Clay' | 'Glaze' | 'Raw Material' | 'Tool' | 'Other';
  supplier: string;
  firingTemp: string; // e.g., "1200°C - 1250°C (Cone 5-6)"
  stockQuantity: number; // in kg or units
  unit: 'kg' | 'g' | 'L' | 'ml' | 'piece';
  stockAlertThreshold: number;
  lastUpdated: string;
  notes?: string;
}

export interface SpecimenTestTile {
  id: string;
  title: string;
  author: string;
  authorEmail?: string;
  clayBody: string;
  glazeName: string;
  firingType: '산화채성 (Oxidation)' | '환원채성 (Reduction)' | '라쿠 (Raku)' | '장작가마 (Wood Fired)';
  firingTemp: string; // e.g. "1240°C"
  coneValue: string; // e.g. "Cone 6"
  description: string;
  knowHowTips: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface AIRecommendationInput {
  firingTempRange: 'low' | 'mid' | 'high'; // low: ~1100, mid: ~1240, high: ~1300
  technique: 'wheel' | 'handbuilding' | 'sculpture' | 'casting';
  clayColorPref: 'white' | 'dark' | 'buff' | 'red';
  glazeFinishPref: 'glossy' | 'matte' | 'crystalline' | 'crackle' | 'unfocused';
  specialRequirements: string;
}

export interface RecommendedMaterial {
  name: string;
  category: string;
  brandOrOrigin: string;
  firingRange: string;
  suggestedSuppliers: string[];
  explanation: string;
  usageTips: string;
}

export interface AIRecommendationResult {
  overallAdvice: string;
  materials: RecommendedMaterial[];
  firingGuidelines: string;
}
