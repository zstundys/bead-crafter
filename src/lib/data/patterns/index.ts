import type { BeadPattern } from '../schema';

// Helper to create beads quickly
function beads(colors: string[]): { id: string; colorCode: string }[] {
	return colors.map((color, i) => ({
		id: `b-${Math.random().toString(36).substring(2, 7)}`,
		colorCode: color
	}));
}

// Penguin pattern - based on reference image
export const penguinPattern: BeadPattern = {
	id: 'penguin-001',
	name: 'Penguin',
	description: 'A cute black and white penguin with orange beak and feet',
	rows: [
		// Head rows
		{ id: 'r1', beads: beads(['B']), rowType: 'single' },
		{ id: 'r2', beads: beads(['B', 'B', 'B']), rowType: 'single' },
		{ id: 'r3', beads: beads(['B', 'W', 'B']), rowType: 'single' },
		{ id: 'r4', beads: beads(['B', 'W', 'W', 'B']), rowType: 'single' },
		// Beak
		{ id: 'r5', beads: beads(['B', 'W', 'O', 'W', 'B']), rowType: 'single' },
		{ id: 'r6', beads: beads(['B', 'W', 'W', 'W', 'B']), rowType: 'single' },
		// Body
		{ id: 'r7', beads: beads(['B', 'W', 'W', 'W', 'B']), rowType: 'single' },
		{ id: 'r8', beads: beads(['B', 'W', 'W', 'W', 'B']), rowType: 'single' },
		{ id: 'r9', beads: beads(['B', 'W', 'W', 'W', 'B']), rowType: 'single' },
		{ id: 'r10', beads: beads(['B', 'W', 'W', 'B']), rowType: 'single' },
		{ id: 'r11', beads: beads(['B', 'W', 'B']), rowType: 'single' },
		// Feet
		{ id: 'r12', beads: beads(['O', 'O']), rowType: 'single' },
	],
	colorPalette: ['B', 'W', 'O']
};

// Frog pattern - based on reference image
export const frogPattern: BeadPattern = {
	id: 'frog-001',
	name: 'Frog',
	description: 'A green frog with big eyes',
	rows: [
		// Eyes
		{ id: 'r1', beads: beads(['G', 'G']), rowType: 'single' },
		{ id: 'r2', beads: beads(['B', 'G', 'G', 'B']), rowType: 'single' },
		// Head
		{ id: 'r3', beads: beads(['G', 'G', 'G', 'G']), rowType: 'single' },
		{ id: 'r4', beads: beads(['G', 'G', 'G', 'G', 'G']), rowType: 'single' },
		{ id: 'r5', beads: beads(['G', 'G', 'G', 'G', 'G', 'G']), rowType: 'single' },
		// Body
		{ id: 'r6', beads: beads(['G', 'G', 'G', 'G', 'G', 'G', 'G']), rowType: 'single' },
		{ id: 'r7', beads: beads(['G', 'G', 'G', 'G', 'G', 'G']), rowType: 'single' },
		{ id: 'r8', beads: beads(['G', 'G', 'G', 'G', 'G']), rowType: 'single' },
		{ id: 'r9', beads: beads(['G', 'G', 'G', 'G']), rowType: 'single' },
		// Legs
		{ id: 'r10', beads: beads(['G', 'G']), rowType: 'single' },
	],
	colorPalette: ['G', 'B']
};

// Butterfly pattern - based on reference image
export const butterflyPattern: BeadPattern = {
	id: 'butterfly-001',
	name: 'Butterfly',
	description: 'A beautiful butterfly with metallic wings',
	rows: [
		// Antenna
		{ id: 'r1', beads: beads(['MB', 'MB']), rowType: 'single' },
		// Top wings
		{ id: 'r2', beads: beads(['MB', 'MB', 'MB', 'MB', 'MB']), rowType: 'single' },
		{ id: 'r3', beads: beads(['MB', 'MB', 'MB']), rowType: 'single' },
		// Head
		{ id: 'r4', beads: beads(['MP', 'MP', 'MP']), rowType: 'single' },
		{ id: 'r5', beads: beads(['MP', 'MP', 'MP', 'MP']), rowType: 'single' },
		// Middle wings
		{ id: 'r6', beads: beads(['MB', 'MP', 'MP', 'MP', 'MB']), rowType: 'single' },
		{ id: 'r7', beads: beads(['MB', 'MP', 'MP', 'MB']), rowType: 'single' },
		// Body and lower wings  
		{ id: 'r8', beads: beads(['MP', 'MP', 'MP']), rowType: 'single' },
		{ id: 'r9', beads: beads(['MP', 'MP']), rowType: 'single' },
		{ id: 'r10', beads: beads(['MP']), rowType: 'single' },
	],
	colorPalette: ['MB', 'MP']
};

// Bunny pattern - based on reference image  
export const bunnyPattern: BeadPattern = {
	id: 'bunny-001',
	name: 'Bunny',
	description: 'A cute pink bunny rabbit',
	rows: [
		// Ears
		{ id: 'r1', beads: beads(['P', 'P', 'P', 'P']), rowType: 'single' },
		{ id: 'r2', beads: beads(['P', 'P', 'P', 'P']), rowType: 'single' },
		{ id: 'r3', beads: beads(['P', 'P', 'P']), rowType: 'single' },
		// Head
		{ id: 'r4', beads: beads(['P', 'W', 'W', 'P']), rowType: 'single' },
		{ id: 'r5', beads: beads(['P', 'W', 'W', 'W', 'P']), rowType: 'single' },
		{ id: 'r6', beads: beads(['P', 'W', 'P', 'W', 'P']), rowType: 'single' },
		// Body
		{ id: 'r7', beads: beads(['W', 'W', 'W']), rowType: 'single' },
		{ id: 'r8', beads: beads(['W', 'W', 'W', 'W']), rowType: 'single' },
		{ id: 'r9', beads: beads(['W', 'W', 'W']), rowType: 'single' },
		// Feet
		{ id: 'r10', beads: beads(['Y', 'Y', 'Y', 'Y']), rowType: 'single' },
	],
	colorPalette: ['P', 'W', 'Y']
};

// Kitten pattern - based on reference image
export const kittenPattern: BeadPattern = {
	id: 'kitten-001',
	name: 'Kitten',
	description: 'An adorable brown and white kitten',
	rows: [
		// Ears
		{ id: 'r1', beads: beads(['Br', 'Br']), rowType: 'single' },
		{ id: 'r2', beads: beads(['Br', 'T', 'T', 'Br']), rowType: 'single' },
		// Head
		{ id: 'r3', beads: beads(['Br', 'T', 'T', 'Br']), rowType: 'single' },
		{ id: 'r4', beads: beads(['T', 'T', 'T', 'T', 'T']), rowType: 'single' },
		// Face with eyes
		{ id: 'r5', beads: beads(['T', 'B', 'T', 'B', 'T']), rowType: 'single' },
		{ id: 'r6', beads: beads(['T', 'T', 'P', 'T', 'T']), rowType: 'single' },
		// Body
		{ id: 'r7', beads: beads(['Br', 'W', 'W', 'Br']), rowType: 'single' },
		{ id: 'r8', beads: beads(['B', 'W', 'P', 'W', 'B']), rowType: 'single' },
		{ id: 'r9', beads: beads(['Br', 'W', 'W', 'Br']), rowType: 'single' },
		// Legs
		{ id: 'r10', beads: beads(['B', 'W', 'W', 'B']), rowType: 'single' },
	],
	colorPalette: ['Br', 'T', 'W', 'B', 'P']
};

// Dog pattern - based on reference image
export const dogPattern: BeadPattern = {
	id: 'dog-001',
	name: 'Dog',
	description: 'A friendly tan and black dog',
	rows: [
		// Ears
		{ id: 'r1', beads: beads(['B']), rowType: 'single' },
		{ id: 'r2', beads: beads(['B', 'T', 'T', 'T']), rowType: 'single' },
		// Head
		{ id: 'r3', beads: beads(['B', 'T', 'T', 'T']), rowType: 'single' },
		{ id: 'r4', beads: beads(['T', 'T', 'T', 'T', 'T']), rowType: 'single' },
		// Face
		{ id: 'r5', beads: beads(['MB', 'T', 'MB']), rowType: 'single' },
		{ id: 'r6', beads: beads(['T', 'MS', 'B', 'MS', 'T']), rowType: 'single' },
		// Body
		{ id: 'r7', beads: beads(['T', 'T', 'T', 'T', 'T']), rowType: 'single' },
		{ id: 'r8', beads: beads(['T', 'T', 'T', 'T']), rowType: 'single' },
		{ id: 'r9', beads: beads(['T', 'T', 'T']), rowType: 'single' },
		// Legs
		{ id: 'r10', beads: beads(['T', 'MS', 'MS', 'T']), rowType: 'single' },
		{ id: 'r11', beads: beads(['T', 'T', 'T']), rowType: 'single' },
	],
	colorPalette: ['T', 'B', 'MB', 'MS']
};

// Export all sample patterns
export const samplePatterns: BeadPattern[] = [
	penguinPattern,
	frogPattern,
	butterflyPattern,
	bunnyPattern,
	kittenPattern,
	dogPattern
];


