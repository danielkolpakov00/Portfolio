import React, { useRef, useEffect } from 'react';

const BouncingLogo = () => {
	const logoRef = useRef(null);
	const containerRef = useRef(null);
	const posRef = useRef({ x: 50, y: 50 });
	const velRef = useRef({ x: 2, y: 1 }); // Constant speed like DVD screensaver

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

	useEffect(() => {
		// Set initial color
		changeSvgColor('#1b69fa');
		
		const animate = () => {
			if (!logoRef.current || !containerRef.current) return;

			const logoWidth = logoRef.current.offsetWidth;
			const logoHeight = logoRef.current.offsetHeight;
			const containerWidth = containerRef.current.offsetWidth;
			const containerHeight = containerRef.current.offsetHeight;

			let newX = posRef.current.x + velRef.current.x;
			let newY = posRef.current.y + velRef.current.y;

			// Collision detection and color change on bounce
			if (newX + logoWidth > containerWidth || newX < 0) {
				velRef.current.x = -velRef.current.x;
				newX = Math.max(0, Math.min(newX, containerWidth - logoWidth));
				// Change color to #1b69fa when bouncing off horizontal walls
				changeSvgColor('#1b69fa');
			}
			if (newY + logoHeight > containerHeight || newY < 0) {
				velRef.current.y = -velRef.current.y;
				newY = Math.max(0, Math.min(newY, containerHeight - logoHeight));
				// Change color to #1b69fa when bouncing off vertical walls
				changeSvgColor('#1b44fa');
			}

			posRef.current = { x: newX, y: newY };
			// Update logo position via CSS transform for smooth animation.
			logoRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
			requestAnimationFrame(animate);
		};

		animate();
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
					width: '200px', // Adjust size as needed
					height: '200px',
				}}
			/>
		</div>
	);
};

export default BouncingLogo;