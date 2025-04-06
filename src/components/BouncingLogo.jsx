import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const BouncingLogo = () => {
	const logoRef = useRef(null);
	const containerRef = useRef(null);
	const posRef = useRef({ x: 50, y: 50 });
	const velRef = useRef({ x: 2, y: 1 }); // Moved back here to fix the reference error
	const [logoSize, setLogoSize] = useState(getLogoSize());
	const [speedScale, setSpeedScale] = useState(getSpeedScale());
	const prevBounceRef = useRef({ horizontal: false, vertical: false });
	
	// Function to determine logo size based on screen width
	function getLogoSize() {
		const width = window.innerWidth;
		if (width <= 480) return 100; // Mobile size
		if (width <= 768) return 150; // Tablet size
		return 200; // Desktop size
	}
	
	// Function to determine speed scale based on screen width
	function getSpeedScale() {
		const width = window.innerWidth;
		if (width <= 480) return 0.3; // Slower on mobile
		if (width <= 768) return 0.4; // Slightly slower on tablet
		return 0.6; // Normal speed on desktop
	}
	
	// Update velocity with scaled speed
	useEffect(() => {
		velRef.current = { 
			x: 2 * speedScale, 
			y: 1 * speedScale 
		};
	}, [speedScale]);

	// Function to change SVG color
	const changeSvgColor = (color) => {
		if (logoRef.current) {
			// For external SVG loaded as an image, we need to load the SVG document
			fetch(logoRef.current.src)
				.then(response => response.text())
				.then(svgText => {
					// Create a temporary div to hold the SVG
					const div = document.createElement('div');
					div.innerHTML = svgText;
					
					// Find all SVG elements that need color
					const svgElements = div.querySelectorAll('path, polygon, rect, circle, ellipse');
					svgElements.forEach(el => {
						el.setAttribute('fill', color);
					});
					
					// Convert back to string and create a blob URL
					const modifiedSvg = div.innerHTML;
					const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
					const url = URL.createObjectURL(blob);
					
					// Update the image source
					logoRef.current.src = url;
				})
				.catch(error => console.error('Error modifying SVG:', error));
		}
	};

	// Function to trigger confetti effect
	const triggerConfetti = (origin) => {
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
		const duration = 2000;
		const animationEnd = Date.now() + duration;
		
		function randomInRange(min, max) {
			return Math.random() * (max - min) + min;
		}
		
		// Create a confetti burst effect
		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			
			if (timeLeft <= 0) {
				return clearInterval(interval);
			}
			
			const particleCount = 50 * (timeLeft / duration);
			
			confetti({
				...defaults,
				particleCount,
				origin: origin
			});
		}, 250);
	};

	useEffect(() => {
		// Set initial color
		changeSvgColor('#1b69fa');
		
		// Handle window resize
		const handleResize = () => {
			setLogoSize(getLogoSize());
			setSpeedScale(getSpeedScale());
		};
		
		window.addEventListener('resize', handleResize);
		
		const animate = () => {
			if (!logoRef.current || !containerRef.current) return;

			const logoWidth = logoRef.current.offsetWidth;
			const logoHeight = logoRef.current.offsetHeight;
			const containerWidth = containerRef.current.offsetWidth;
			const containerHeight = containerRef.current.offsetHeight;

			let newX = posRef.current.x + velRef.current.x;
			let newY = posRef.current.y + velRef.current.y;
			
			// Track if we're bouncing horizontally or vertically in this frame
			let isBouncingHorizontal = false;
			let isBouncingVertical = false;

			// Collision detection and color change on bounce
			if (newX + logoWidth > containerWidth || newX < 0) {
				velRef.current.x = -velRef.current.x;
				newX = Math.max(0, Math.min(newX, containerWidth - logoWidth));
				// Change color to #1b69fa when bouncing off horizontal walls
				changeSvgColor('#1b69fa');
				isBouncingHorizontal = true;
			}
			
			if (newY + logoHeight > containerHeight || newY < 0) {
				velRef.current.y = -velRef.current.y;
				newY = Math.max(0, Math.min(newY, containerHeight - logoHeight));
				// Change color to #1b44fa when bouncing off vertical walls
				changeSvgColor('#1b44fa');
				isBouncingVertical = true;
			}

			// If we're bouncing in both directions in the same frame or close to it, we hit a corner!
			if ((isBouncingHorizontal && isBouncingVertical) || 
				(isBouncingHorizontal && prevBounceRef.current.vertical) || 
				(isBouncingVertical && prevBounceRef.current.horizontal)) {
				
				// Calculate corner position for confetti origin
				let originX = (newX < containerWidth / 2) ? 0.1 : 0.9; // Left or right corner
				let originY = (newY < containerHeight / 2) ? 0.1 : 0.9; // Top or bottom corner
				
				// Change to a special corner color
				changeSvgColor('#ff44fa'); // Purple for corner hits
				
				// Trigger confetti from the corner
				triggerConfetti({ x: originX, y: originY });
			}
			
			// Store bounce state for next frame (to detect near-simultaneous bounces)
			prevBounceRef.current = { 
				horizontal: isBouncingHorizontal,
				vertical: isBouncingVertical 
			};
			
			// Reset previous bounce flags after a short delay to avoid false corner detections
			if (isBouncingHorizontal || isBouncingVertical) {
				setTimeout(() => {
					prevBounceRef.current = { horizontal: false, vertical: false };
				}, 100);
			}

			posRef.current = { x: newX, y: newY };
			// Update logo position via CSS transform for smooth animation.
			logoRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
			requestAnimationFrame(animate);
		};

		animate();
		
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div
			className="bouncing-logo-container"
			ref={containerRef}
			style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}
		>
			<img
				ref={logoRef}
				src="./assets/dvd-logo.svg" // Using relative path with dot prefix for proper deployment
				alt="Bouncing Logo"
				style={{
					position: 'absolute',
					left: 0, // Initial positioning handled by transform
					top: 0,  // Initial positioning handled by transform
					width: `${logoSize}px`,
					height: `${logoSize}px`,
				}}
			/>
		</div>
	);
};

export default BouncingLogo;