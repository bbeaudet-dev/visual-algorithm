export interface PresetTheme {
  name: string;
  items: PresetItem[];
}

export interface PresetItem {
  name: string;
  array: number[];
}

// Chess pieces data moved from BubbleSort.tsx
const chessPieces: PresetItem[] = [
  {
    name: 'King', 
    array: [29, 29, 30, 30, 30, 29, 29, 27, 26, 27, 28, 28, 28, 27, 27, 25, 24, 22, 22, 21, 18, 16, 15, 14, 13, 13, 12, 12, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 12, 19, 20, 20, 19, 18, 16, 16, 15, 12, 12, 14, 14, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 21, 21, 20, 18, 15, 9, 9, 9, 5, 5, 5, 5, 13, 13, 13, 13, 13, 13, 13, 13, 5, 5, 5, 5, 6, 2]
  },
  {
    name: 'Queen',
    array: [29, 30, 30, 30, 30, 30, 29, 28, 25, 26, 27, 28, 28, 28, 27, 27, 26, 24, 23, 22, 22, 21, 18, 17, 16, 15, 14, 14, 13, 13, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 18, 19, 20, 20, 20, 18, 16, 16, 16, 12, 12, 12, 14, 14, 12, 12, 12, 13, 13, 13, 13, 14, 14, 15, 16, 17, 18, 19, 19, 19, 18, 12, 12, 11, 10, 8, 6, 3, 4, 5, 5, 5, 4, 3, 1]
  },
  {
    name: 'Rook',
    array: [29, 30, 30, 30, 30, 30, 30, 30, 29, 29, 28, 25, 26, 27, 27, 28, 28, 28, 28, 27, 27, 27, 26, 25, 24, 23, 22, 22, 22, 21, 20, 19, 18, 18, 18, 17, 17, 17, 16, 16, 16, 16, 15, 15, 15, 15, 14, 14, 14, 14, 14, 14, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 15, 15, 15, 15, 15, 15, 19, 20, 20, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
  },
  {
    name: 'Knight',
    array: [29, 30, 30, 30, 30, 30, 30, 29, 28, 25, 26, 27, 28, 28, 28, 28, 27, 27, 26, 25, 24, 23, 22, 21, 21, 17, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 21, 21, 21, 21, 21, 20, 20, 20, 19, 19, 19, 18, 18, 17, 17, 17, 26, 27, 27, 28, 29, 29, 29, 29, 29, 29, 29, 28, 27, 26, 26, 25, 24, 24, 23, 22, 22, 21, 20, 20, 19, 19, 18, 17, 17, 16, 15, 10, 9, 8, 8, 7, 6, 5, 4, 3, 1]
  },
  {
    name: 'Bishop',
    array: [29, 30, 30, 30, 30, 30, 29, 29, 26, 26, 27, 28, 28, 28, 28, 27, 26, 25, 24, 23, 22, 22, 21, 18, 17, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 19, 20, 20, 20, 19, 16, 16, 15, 15, 14, 10, 10, 10, 12, 12, 12, 13, 15, 16, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 18, 18, 17, 17, 16, 15, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 6, 7, 8, 7, 6]
  },
  {
    name: 'Pawn',
    array: [29, 30, 29, 30, 30, 30, 29, 29, 29, 25, 26, 27, 27, 28, 28, 28, 27, 27, 26, 25, 24, 23, 22, 21, 21, 19, 18, 17, 16, 16, 15, 14, 14, 13, 13, 12, 12, 11, 11, 11, 10, 10, 10, 10, 10, 9, 9, 20, 22, 23, 23, 23, 22, 21, 20, 18, 16, 14, 11, 10, 9, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 19, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 20, 20, 20, 19, 19, 18, 17, 17, 16, 14, 13, 12, 10, 8, 4]
  }
];

// Placeholder arrays for other themes (to be filled in later)
const kitchenItems: PresetItem[] = [
  { name: "Spoon", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Fork", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Knife", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Spatula", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Whisk", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } // Placeholder
];

const toolboxItems: PresetItem[] = [
  { name: "Hammer", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Wrench", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Screwdriver", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Pliers", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } // Placeholder
];

const cartoonItems: PresetItem[] = [
  { name: "Mickey Mouse", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "SpongeBob", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Bart Simpson", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } // Placeholder
];

const natureItems: PresetItem[] = [
  { name: "Mountain", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Tree", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "River", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Cloud", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } // Placeholder
];

const animalItems: PresetItem[] = [
  { name: "Cat", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Dog", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Elephant", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Bird", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } // Placeholder
];

const humanoidItems: PresetItem[] = [
  { name: "Bust of Einstein", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Bust of Beethoven", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Bust of Nefertiti", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } // Placeholder
];

const buildingItems: PresetItem[] = [
  { name: "Skyscraper", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "House", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Castle", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Church", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Placeholder
  { name: "Bridge", array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } // Placeholder
];

export const presetThemes: PresetTheme[] = [
  { name: "Chess Pieces", items: chessPieces },
  { name: "Buildings", items: buildingItems },
  { name: "Kitchen", items: kitchenItems },
  { name: "Toolbox", items: toolboxItems },
  { name: "Cartoons", items: cartoonItems },
  { name: "Nature", items: natureItems },
  { name: "Animals", items: animalItems },
  { name: "Humanoids", items: humanoidItems }
];

// Helper function to find a preset by name
export function findPresetByName(presetName: string): PresetItem | undefined {
  for (const theme of presetThemes) {
    const item = theme.items.find(item => item.name === presetName);
    if (item) return item;
  }
  return undefined;
} 