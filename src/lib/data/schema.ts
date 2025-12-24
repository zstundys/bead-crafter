// Core data types for bead patterns

export interface BeadPattern {
	id: string;
	name: string;
	description?: string;
	rows: BeadRow[];
	colorPalette: string[]; // Array of color codes used in this pattern
}

export interface BeadRow {
	id: string;
	beads: Bead[];
	rowType: 'single' | 'split'; // Single strand or split for limbs
	splitGroups?: SplitGroup[]; // For split rows (limbs), defines separate groups
}

export interface SplitGroup {
	id: string;
	side: 'left' | 'right' | 'center';
	beads: Bead[];
}

export interface Bead {
	id: string;
	colorCode: string; // e.g., "P", "W", "B", "MB"
}

export interface BeadPosition {
	x: number;
	y: number;
	z: number;
}

export interface Connection {
	fromBeadId: string;
	toBeadId: string;
	stringId: 'left' | 'right' | 'main';
}

export interface ColorDef {
	code: string;           // "P", "MB", etc.
	name: string;           // "Pink", "Metallic Blue"
	hex: string;            // "#FF69B4"
	metallic?: boolean;
	roughness?: number;     // For material properties
	emissive?: string;      // Optional glow color
}

// Animation state
export interface AnimationState {
	currentStep: number;
	totalSteps: number;
	isPlaying: boolean;
	playbackSpeed: number;
}

// Editor state
export interface EditorState {
	selectedColor: string;
	selectedRow: number | null;
	selectedBead: string | null;
	tool: 'select' | 'paint' | 'erase';
}

// Computed bead with 3D position for rendering
export interface ComputedBead {
	id: string;
	colorCode: string;
	position: BeadPosition;
	rowIndex: number;
	beadIndex: number;
	assemblyStep: number;
	groupId?: string; // For split rows
}

// Computed string segment
export interface StringSegment {
	id: string;
	startPos: BeadPosition;
	endPos: BeadPosition;
	stringId: 'left' | 'right';
	assemblyStep: number;
}

