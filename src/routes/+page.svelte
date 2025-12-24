<script lang="ts">
	import { onMount } from 'svelte';
	import BeadViewer from '$lib/components/BeadViewer.svelte';
	import PatternEditor from '$lib/components/PatternEditor.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import PatternLibrary from '$lib/components/PatternLibrary.svelte';
	import { currentPattern, loadPatternLibrary } from '$lib/stores/pattern';
	import { samplePatterns } from '$lib/data/patterns';
	
	let activeTab = $state<'editor' | 'library'>('library');
	let sidebarCollapsed = $state(false);
	
	onMount(() => {
		loadPatternLibrary();
		// Load first sample pattern by default
		if (samplePatterns.length > 0) {
			currentPattern.set(structuredClone(samplePatterns[0]));
		}
	});
	
	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="app-container">
	<!-- Header -->
	<header class="app-header">
		<div class="logo">
			<div class="logo-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
					<circle cx="8" cy="8" r="4" fill="#6366f1"/>
					<circle cx="16" cy="8" r="4" fill="#8b5cf6"/>
					<circle cx="8" cy="16" r="4" fill="#a78bfa"/>
					<circle cx="16" cy="16" r="4" fill="#c4b5fd"/>
				</svg>
			</div>
			<span class="logo-text">Bead Crafter</span>
		</div>
		
		<nav class="nav-tabs">
			<button 
				class:active={activeTab === 'library'}
				onclick={() => activeTab = 'library'}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
				</svg>
				Library
			</button>
			<button 
				class:active={activeTab === 'editor'}
				onclick={() => activeTab = 'editor'}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
				</svg>
				Editor
			</button>
		</nav>
		
		<div class="header-actions">
			<a href="https://github.com" target="_blank" rel="noopener" class="icon-btn" title="View on GitHub">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
			</a>
		</div>
	</header>
	
	<!-- Main Content -->
	<main class="main-content">
		<!-- Sidebar -->
		<aside class="sidebar" class:collapsed={sidebarCollapsed}>
			<button class="sidebar-toggle" onclick={toggleSidebar}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					{#if sidebarCollapsed}
						<path d="m9 18 6-6-6-6"/>
					{:else}
						<path d="m15 18-6-6 6-6"/>
					{/if}
				</svg>
			</button>
			
			{#if !sidebarCollapsed}
				<div class="sidebar-content">
					{#if activeTab === 'library'}
						<PatternLibrary />
					{:else}
						<PatternEditor />
					{/if}
				</div>
				
				{#if activeTab === 'editor'}
					<div class="sidebar-bottom">
						<ColorPicker />
					</div>
				{/if}
			{/if}
		</aside>
		
		<!-- 3D Viewer -->
		<section class="viewer-section">
			<BeadViewer />
			
			<!-- Instructions overlay when no pattern -->
			<div class="viewer-overlay">
				<div class="tips">
					<span class="tip">
						<kbd>Drag</kbd> to rotate
					</span>
					<span class="tip">
						<kbd>Scroll</kbd> to zoom
					</span>
					<span class="tip">
						<kbd>Right-drag</kbd> to pan
					</span>
				</div>
			</div>
		</section>
	</main>
	
	<!-- Footer -->
	<footer class="app-footer">
		<span>Built with SvelteKit & Three.js</span>
		<span class="divider">•</span>
		<span>3D Beaded Animal Generator</span>
	</footer>
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: linear-gradient(180deg, #0f0f13 0%, #151519 100%);
	}
	
	/* Header */
	.app-header {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 12px 24px;
		background: rgba(15, 15, 19, 0.95);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
		z-index: 100;
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	
	.logo-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.logo-text {
		font-size: 18px;
		font-weight: 600;
		background: linear-gradient(135deg, #f4f4f5 0%, #a1a1aa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.nav-tabs {
		display: flex;
		gap: 4px;
		padding: 4px;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 10px;
	}
	
	.nav-tabs button {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: transparent;
		border: none;
		border-radius: 8px;
		color: #71717a;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.nav-tabs button:hover {
		color: #a1a1aa;
		background: rgba(255, 255, 255, 0.05);
	}
	
	.nav-tabs button.active {
		color: #f4f4f5;
		background: rgba(99, 102, 241, 0.2);
	}
	
	.header-actions {
		margin-left: auto;
		display: flex;
		gap: 8px;
	}
	
	.icon-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 8px;
		color: #71717a;
		text-decoration: none;
		transition: all 0.15s;
	}
	
	.icon-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #f4f4f5;
	}
	
	/* Main Content */
	.main-content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	
	/* Sidebar */
	.sidebar {
		position: relative;
		width: 320px;
		display: flex;
		flex-direction: column;
		background: rgba(26, 26, 34, 0.5);
		border-right: 1px solid rgba(255, 255, 255, 0.06);
		transition: width 0.3s ease;
	}
	
	.sidebar.collapsed {
		width: 48px;
	}
	
	.sidebar-toggle {
		position: absolute;
		top: 12px;
		right: -12px;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1a1a22;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		color: #71717a;
		cursor: pointer;
		z-index: 10;
		transition: all 0.15s;
	}
	
	.sidebar-toggle:hover {
		background: #252530;
		color: #f4f4f5;
	}
	
	.sidebar-content {
		flex: 1;
		overflow-y: auto;
	}
	
	.sidebar-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}
	
	/* Viewer Section */
	.viewer-section {
		flex: 1;
		position: relative;
		padding: 16px;
	}
	
	.viewer-overlay {
		position: absolute;
		bottom: 24px;
		right: 24px;
		pointer-events: none;
	}
	
	.tips {
		display: flex;
		gap: 16px;
		padding: 8px 16px;
		background: rgba(15, 15, 19, 0.8);
		border-radius: 20px;
		backdrop-filter: blur(8px);
	}
	
	.tip {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: #71717a;
	}
	
	kbd {
		padding: 2px 6px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		font-size: 11px;
		font-family: inherit;
		color: #a1a1aa;
	}
	
	/* Footer */
	.app-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px;
		background: rgba(15, 15, 19, 0.95);
		border-top: 1px solid rgba(255, 255, 255, 0.04);
		font-size: 12px;
		color: #52525b;
	}
	
	.divider {
		color: #3f3f46;
	}
	
	/* Scrollbar styling */
	:global(.sidebar-content::-webkit-scrollbar) {
		width: 6px;
	}
	
	:global(.sidebar-content::-webkit-scrollbar-track) {
		background: transparent;
	}
	
	:global(.sidebar-content::-webkit-scrollbar-thumb) {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}
	
	:global(.sidebar-content::-webkit-scrollbar-thumb:hover) {
		background: rgba(255, 255, 255, 0.2);
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.sidebar {
			width: 280px;
		}
		
		.tips {
			display: none;
		}
	}
</style>
