import type { SceneManager } from './SceneManager';
import { animationState } from '$lib/stores/pattern';
import { get } from 'svelte/store';

export class AnimationEngine {
	private sceneManager: SceneManager;
	private intervalId: ReturnType<typeof setInterval> | null = null;
	private onStepChange: ((step: number) => void) | null = null;
	
	constructor(sceneManager: SceneManager) {
		this.sceneManager = sceneManager;
	}
	
	setOnStepChange(callback: (step: number) => void): void {
		this.onStepChange = callback;
	}
	
	play(): void {
		const state = get(animationState);
		if (state.isPlaying) return;
		
		animationState.update(s => ({ ...s, isPlaying: true }));
		
		const baseInterval = 500; // ms per step at 1x speed
		const interval = baseInterval / state.playbackSpeed;
		
		this.intervalId = setInterval(() => {
			const currentState = get(animationState);
			
			if (currentState.currentStep >= currentState.totalSteps - 1) {
				this.pause();
				return;
			}
			
			const newStep = currentState.currentStep + 1;
			animationState.update(s => ({ ...s, currentStep: newStep }));
			this.sceneManager.updateVisibility(newStep);
			
			if (this.onStepChange) {
				this.onStepChange(newStep);
			}
		}, interval);
	}
	
	pause(): void {
		animationState.update(s => ({ ...s, isPlaying: false }));
		
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
	
	stop(): void {
		this.pause();
		animationState.update(s => ({ ...s, currentStep: 0 }));
		this.sceneManager.updateVisibility(0);
		
		if (this.onStepChange) {
			this.onStepChange(0);
		}
	}
	
	stepForward(): void {
		const state = get(animationState);
		if (state.currentStep >= state.totalSteps - 1) return;
		
		const newStep = state.currentStep + 1;
		animationState.update(s => ({ ...s, currentStep: newStep }));
		this.sceneManager.updateVisibility(newStep);
		
		if (this.onStepChange) {
			this.onStepChange(newStep);
		}
	}
	
	stepBackward(): void {
		const state = get(animationState);
		if (state.currentStep <= 0) return;
		
		const newStep = state.currentStep - 1;
		animationState.update(s => ({ ...s, currentStep: newStep }));
		this.sceneManager.updateVisibility(newStep);
		
		if (this.onStepChange) {
			this.onStepChange(newStep);
		}
	}
	
	goToStep(step: number): void {
		const state = get(animationState);
		const clampedStep = Math.max(0, Math.min(step, state.totalSteps - 1));
		
		animationState.update(s => ({ ...s, currentStep: clampedStep }));
		this.sceneManager.updateVisibility(clampedStep);
		
		if (this.onStepChange) {
			this.onStepChange(clampedStep);
		}
	}
	
	goToEnd(): void {
		const state = get(animationState);
		this.goToStep(state.totalSteps - 1);
		this.sceneManager.showAll();
	}
	
	setSpeed(speed: number): void {
		const wasPlaying = get(animationState).isPlaying;
		
		animationState.update(s => ({ ...s, playbackSpeed: speed }));
		
		// Restart with new speed if playing
		if (wasPlaying) {
			this.pause();
			this.play();
		}
	}
	
	dispose(): void {
		this.pause();
		this.onStepChange = null;
	}
}

