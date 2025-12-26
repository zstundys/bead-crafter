import type { ColorDef } from './schema';

// Standard pony bead colors from the reference sheet
export const BEAD_COLORS: ColorDef[] = [
	// Basic colors
	{ code: 'P', name: 'Pink', hex: '#FF69B4', roughness: 0.4 },
	{ code: 'W', name: 'White', hex: '#FAFAFA', roughness: 0.3 },
	{ code: 'B', name: 'Black', hex: '#1a1a1a', roughness: 0.5 },
	{ code: 'G', name: 'Green', hex: '#22C55E', roughness: 0.4 },
	{ code: 'O', name: 'Orange', hex: '#F97316', roughness: 0.4 },
	{ code: 'Y', name: 'Yellow', hex: '#FACC15', roughness: 0.4 },
	{ code: 'T', name: 'Tan', hex: '#D4A574', roughness: 0.5 },
	{ code: 'Br', name: 'Brown', hex: '#7C4A2D', roughness: 0.5 },
	{ code: 'R', name: 'Red', hex: '#EF4444', roughness: 0.4 },
	{ code: 'Bl', name: 'Blue', hex: '#3B82F6', roughness: 0.4 },
	
	// Metallic colors
	{ code: 'MS', name: 'Metallic Silver', hex: '#C0C0C0', metallic: true, roughness: 0.2 },
	{ code: 'MGr', name: 'Metallic Green', hex: '#50C878', metallic: true, roughness: 0.2 },
	{ code: 'MB', name: 'Metallic Blue', hex: '#4169E1', metallic: true, roughness: 0.2 },
	{ code: 'MP', name: 'Metallic Purple', hex: '#9370DB', metallic: true, roughness: 0.2 },
	{ code: 'MG', name: 'Metallic Gold', hex: '#FFD700', metallic: true, roughness: 0.15 },
	{ code: 'MBL', name: 'Metallic Black', hex: '#2C2C2C', metallic: true, roughness: 0.2 },
	
	// Additional useful colors
	{ code: 'LB', name: 'Light Blue', hex: '#87CEEB', roughness: 0.4 },
	{ code: 'LG', name: 'Light Green', hex: '#90EE90', roughness: 0.4 },
	{ code: 'LP', name: 'Light Pink', hex: '#FFB6C1', roughness: 0.4 },
	{ code: 'Gy', name: 'Gray', hex: '#808080', roughness: 0.5 },
];

// Helper function to get color by code
export function getColorByCode(code: string): ColorDef | undefined {
	return BEAD_COLORS.find(c => c.code === code);
}

// Helper function to get hex color by code
export function getHexByCode(code: string): string {
	const color = getColorByCode(code);
	return color?.hex ?? '#808080';
}

// Helper to check if a color is metallic
export function isMetallic(code: string): boolean {
	const color = getColorByCode(code);
	return color?.metallic ?? false;
}

// Group colors by type for UI
export function getColorGroups(): { basic: ColorDef[]; metallic: ColorDef[] } {
	return {
		basic: BEAD_COLORS.filter(c => !c.metallic),
		metallic: BEAD_COLORS.filter(c => c.metallic),
	};
}

// String/cord color
export const STRING_COLOR = '#3d3d3d';
export const STRING_METALLIC = 0.1;
export const STRING_ROUGHNESS = 0.8;


