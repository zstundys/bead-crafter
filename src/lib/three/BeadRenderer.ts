import * as THREE from 'three';
import { getColorByCode, STRING_COLOR } from '$lib/data/colors';
import type { ComputedBead } from '$lib/data/schema';
import { BEAD_RADIUS, BEAD_HEIGHT, BEAD_HOLE_RADIUS } from '$lib/stores/pattern';

// Cache for geometries and materials to improve performance
const geometryCache = new Map<string, THREE.BufferGeometry>();
const materialCache = new Map<string, THREE.Material>();

// Create a torus-like shape for the pony bead (donut with thick walls)
export function createBeadGeometry(): THREE.BufferGeometry {
	const cacheKey = 'bead';
	if (geometryCache.has(cacheKey)) {
		return geometryCache.get(cacheKey)!;
	}
	
	// Create a lathe geometry for the bead profile
	// Pony beads have a rounded barrel shape
	const points: THREE.Vector2[] = [];
	const segments = 16;
	
	// Create profile curve for the bead
	for (let i = 0; i <= segments; i++) {
		const t = i / segments;
		const angle = t * Math.PI;
		
		// Barrel shape with hole
		const outerRadius = BEAD_RADIUS * (0.85 + 0.15 * Math.sin(angle));
		const y = (t - 0.5) * BEAD_HEIGHT;
		
		points.push(new THREE.Vector2(outerRadius, y));
	}
	
	const geometry = new THREE.LatheGeometry(points, 24);
	
	// Add the center hole by creating a cylinder and doing CSG-like operation
	// For simplicity, we'll use a more complex approach with a custom shape
	
	geometryCache.set(cacheKey, geometry);
	return geometry;
}

// Create a proper bead with hole using a custom shape
export function createPonyBeadGeometry(): THREE.BufferGeometry {
	const cacheKey = 'pony-bead';
	if (geometryCache.has(cacheKey)) {
		return geometryCache.get(cacheKey)!;
	}
	
	// Create outer cylinder
	const outerGeo = new THREE.CylinderGeometry(
		BEAD_RADIUS, 
		BEAD_RADIUS, 
		BEAD_HEIGHT, 
		24, 
		1, 
		false
	);
	
	// Create inner cylinder (hole) - we'll simulate the hole with darker material
	// For now, use torus geometry which naturally has a hole
	const torusGeo = new THREE.TorusGeometry(
		BEAD_RADIUS * 0.65, // Major radius
		BEAD_RADIUS * 0.35, // Tube radius  
		12, // Radial segments
		24  // Tubular segments
	);
	
	// Rotate 90 degrees on Y axis so the hole is visible from the front
	torusGeo.rotateY(Math.PI / 2);
	
	geometryCache.set(cacheKey, torusGeo);
	return torusGeo;
}

// Create material for a bead color
export function createBeadMaterial(colorCode: string): THREE.Material {
	const cacheKey = `mat-${colorCode}`;
	if (materialCache.has(cacheKey)) {
		return materialCache.get(cacheKey)!;
	}
	
	const colorDef = getColorByCode(colorCode);
	const hex = colorDef?.hex ?? '#808080';
	const isMetallic = colorDef?.metallic ?? false;
	const roughness = colorDef?.roughness ?? 0.4;
	
	const material = new THREE.MeshStandardMaterial({
		color: new THREE.Color(hex),
		metalness: isMetallic ? 0.8 : 0.1,
		roughness: roughness,
		envMapIntensity: isMetallic ? 1.5 : 0.5,
	});
	
	materialCache.set(cacheKey, material);
	return material;
}

// Create a complete bead mesh
export function createBeadMesh(bead: ComputedBead): THREE.Mesh {
	const geometry = createPonyBeadGeometry();
	const material = createBeadMaterial(bead.colorCode);
	
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(bead.position.x, bead.position.y, bead.position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.userData = { beadId: bead.id, assemblyStep: bead.assemblyStep };
	
	return mesh;
}

// Create string/cord geometry between two points
export function createStringGeometry(
	start: THREE.Vector3, 
	end: THREE.Vector3
): THREE.TubeGeometry {
	// Create a curved path between points
	const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
	
	// Add slight curve for more natural look
	const direction = new THREE.Vector3().subVectors(end, start);
	const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
	midPoint.add(perpendicular.multiplyScalar(0.05));
	
	const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
	
	return new THREE.TubeGeometry(curve, 8, 0.03, 8, false);
}

// Create string material with custom color
export function createStringMaterial(color: string = STRING_COLOR): THREE.Material {
	const cacheKey = `string-${color}`;
	if (materialCache.has(cacheKey)) {
		return materialCache.get(cacheKey)!;
	}
	
	const material = new THREE.MeshStandardMaterial({
		color: new THREE.Color(color),
		metalness: 0.1,
		roughness: 0.8,
	});
	
	materialCache.set(cacheKey, material);
	return material;
}

// Create a string mesh between two beads
export function createStringMesh(
	startPos: { x: number; y: number; z: number },
	endPos: { x: number; y: number; z: number },
	assemblyStep: number,
	color: string = STRING_COLOR
): THREE.Mesh {
	const start = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
	const end = new THREE.Vector3(endPos.x, endPos.y, endPos.z);
	
	const geometry = createStringGeometry(start, end);
	const material = createStringMaterial(color);
	
	const mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.userData = { assemblyStep };
	
	return mesh;
}

// Create the keychain loop at the top
export function createKeychainLoop(): THREE.Group {
	const group = new THREE.Group();
	
	// Main loop
	const loopGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 24);
	const loopMat = new THREE.MeshStandardMaterial({
		color: 0x888888,
		metalness: 0.9,
		roughness: 0.3
	});
	const loop = new THREE.Mesh(loopGeo, loopMat);
	loop.position.y = 0.5;
	loop.rotation.x = Math.PI / 2;
	
	// Connector
	const connectorGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8);
	const connector = new THREE.Mesh(connectorGeo, loopMat);
	connector.position.y = 0.25;
	
	group.add(loop);
	group.add(connector);
	
	return group;
}

// Clear caches (call when changing patterns)
export function clearCaches(): void {
	geometryCache.forEach(geo => geo.dispose());
	materialCache.forEach(mat => {
		if (mat instanceof THREE.MeshStandardMaterial) {
			mat.dispose();
		}
	});
	geometryCache.clear();
	materialCache.clear();
}

