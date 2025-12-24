import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SceneConfig {
	canvas: HTMLCanvasElement;
	width: number;
	height: number;
}

export class SceneManager {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
	controls: OrbitControls;
	
	private beadGroup: THREE.Group;
	private stringGroup: THREE.Group;
	private animationId: number | null = null;
	
	constructor(config: SceneConfig) {
		// Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x0f0f13);
		
		// Camera
		this.camera = new THREE.PerspectiveCamera(
			50,
			config.width / config.height,
			0.1,
			1000
		);
		this.camera.position.set(0, 0, 8);
		
		// Renderer
		this.renderer = new THREE.WebGLRenderer({
			canvas: config.canvas,
			antialias: true,
			alpha: true
		});
		this.renderer.setSize(config.width, config.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.2;
		
		// Controls
		this.controls = new OrbitControls(this.camera, config.canvas);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.minDistance = 3;
		this.controls.maxDistance = 20;
		this.controls.target.set(0, -2, 0);
		
		// Groups for beads and strings
		this.beadGroup = new THREE.Group();
		this.stringGroup = new THREE.Group();
		this.scene.add(this.beadGroup);
		this.scene.add(this.stringGroup);
		
		// Setup lighting
		this.setupLighting();
		
		// Setup environment
		this.setupEnvironment();
	}
	
	private setupLighting(): void {
		// Ambient light
		const ambient = new THREE.AmbientLight(0xffffff, 0.4);
		this.scene.add(ambient);
		
		// Main key light
		const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
		keyLight.position.set(5, 10, 5);
		keyLight.castShadow = true;
		keyLight.shadow.mapSize.width = 2048;
		keyLight.shadow.mapSize.height = 2048;
		keyLight.shadow.camera.near = 0.5;
		keyLight.shadow.camera.far = 50;
		keyLight.shadow.camera.left = -10;
		keyLight.shadow.camera.right = 10;
		keyLight.shadow.camera.top = 10;
		keyLight.shadow.camera.bottom = -10;
		this.scene.add(keyLight);
		
		// Fill light
		const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
		fillLight.position.set(-5, 5, -5);
		this.scene.add(fillLight);
		
		// Rim light
		const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
		rimLight.position.set(0, -5, -10);
		this.scene.add(rimLight);
		
		// Point light for specular highlights
		const pointLight = new THREE.PointLight(0xffffff, 0.5);
		pointLight.position.set(2, 2, 4);
		this.scene.add(pointLight);
	}
	
	private setupEnvironment(): void {
		// Create a simple gradient environment for reflections
		const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
		
		// Create a simple color environment
		const envScene = new THREE.Scene();
		envScene.background = new THREE.Color(0x1a1a22);
		
		// Add gradient sphere for environment
		const envGeo = new THREE.SphereGeometry(50, 32, 32);
		const envMat = new THREE.MeshBasicMaterial({
			color: 0x2a2a35,
			side: THREE.BackSide
		});
		const envMesh = new THREE.Mesh(envGeo, envMat);
		envScene.add(envMesh);
		
		const envMap = pmremGenerator.fromScene(envScene).texture;
		this.scene.environment = envMap;
		
		pmremGenerator.dispose();
	}
	
	addBead(mesh: THREE.Mesh): void {
		this.beadGroup.add(mesh);
	}
	
	addString(mesh: THREE.Mesh): void {
		this.stringGroup.add(mesh);
	}
	
	clearBeads(): void {
		while (this.beadGroup.children.length > 0) {
			const child = this.beadGroup.children[0];
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();
			}
			this.beadGroup.remove(child);
		}
	}
	
	clearStrings(): void {
		while (this.stringGroup.children.length > 0) {
			const child = this.stringGroup.children[0];
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();
			}
			this.stringGroup.remove(child);
		}
	}
	
	clearAll(): void {
		this.clearBeads();
		this.clearStrings();
	}
	
	// Update visibility based on animation step
	updateVisibility(currentStep: number): void {
		this.beadGroup.children.forEach(child => {
			if (child instanceof THREE.Mesh && child.userData.assemblyStep !== undefined) {
				child.visible = child.userData.assemblyStep <= currentStep;
				
				// Add pop-in animation for newly visible beads
				if (child.userData.assemblyStep === currentStep) {
					child.scale.setScalar(0);
					this.animateScale(child, 1, 200);
				}
			}
		});
		
		this.stringGroup.children.forEach(child => {
			if (child instanceof THREE.Mesh && child.userData.assemblyStep !== undefined) {
				child.visible = child.userData.assemblyStep < currentStep;
			}
		});
	}
	
	// Show all beads (no animation filter)
	showAll(): void {
		this.beadGroup.children.forEach(child => {
			child.visible = true;
			if (child instanceof THREE.Mesh) {
				child.scale.setScalar(1);
			}
		});
		this.stringGroup.children.forEach(child => {
			child.visible = true;
		});
	}
	
	private animateScale(mesh: THREE.Mesh, targetScale: number, duration: number): void {
		const startScale = mesh.scale.x;
		const startTime = performance.now();
		
		const animate = () => {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			
			// Elastic easing
			const eased = 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 2);
			const scale = startScale + (targetScale - startScale) * eased;
			mesh.scale.setScalar(scale);
			
			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};
		
		requestAnimationFrame(animate);
	}
	
	resize(width: number, height: number): void {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}
	
	startRenderLoop(): void {
		const animate = () => {
			this.animationId = requestAnimationFrame(animate);
			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		};
		animate();
	}
	
	stopRenderLoop(): void {
		if (this.animationId !== null) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}
	
	render(): void {
		this.renderer.render(this.scene, this.camera);
	}
	
	dispose(): void {
		this.stopRenderLoop();
		this.clearAll();
		this.controls.dispose();
		this.renderer.dispose();
	}
	
	// Center camera on the model
	centerCamera(): void {
		// Calculate bounding box of all beads
		const box = new THREE.Box3();
		this.beadGroup.children.forEach(child => {
			if (child instanceof THREE.Mesh) {
				box.expandByObject(child);
			}
		});
		
		if (!box.isEmpty()) {
			const center = box.getCenter(new THREE.Vector3());
			const size = box.getSize(new THREE.Vector3());
			const maxDim = Math.max(size.x, size.y, size.z);
			
			this.controls.target.copy(center);
			this.camera.position.set(center.x, center.y, center.z + maxDim * 2);
			this.controls.update();
		}
	}
	
	// Reset camera to default position
	resetCamera(): void {
		this.camera.position.set(0, 0, 8);
		this.controls.target.set(0, -2, 0);
		this.controls.update();
	}
}

