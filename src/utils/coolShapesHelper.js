/**
 * CoolShapes Helper Utility
 * 
 * This utility provides SVG shapes and animations for decorative elements
 * to enhance presentations with geometric elements.
 */

// Basic shape configurations
const shapes = {
  circle: (props = {}) => ({
    type: 'circle',
    cx: props.cx || 50,
    cy: props.cy || 50,
    r: props.r || 40,
    fill: props.fill || '#3498db',
    ...props
  }),
  
  rect: (props = {}) => ({
    type: 'rect',
    x: props.x || 10,
    y: props.y || 10,
    width: props.width || 80,
    height: props.height || 80,
    rx: props.rx || 0,
    fill: props.fill || '#e74c3c',
    ...props
  }),
  
  polygon: (props = {}) => ({
    type: 'polygon',
    points: props.points || "50,10 90,90 10,90",
    fill: props.fill || '#2ecc71',
    ...props
  }),
  
  wave: (props = {}) => ({
    type: 'path',
    d: props.d || "M0,50 Q25,25 50,50 T100,50",
    fill: props.fill || 'none',
    stroke: props.stroke || '#9b59b6',
    strokeWidth: props.strokeWidth || 4,
    ...props
  }),
  
  blob: (props = {}) => ({
    type: 'path',
    d: props.d || generateBlobPath(),
    fill: props.fill || '#f39c12',
    ...props
  }),
  
  donut: (props = {}) => ({
    type: 'path',
    d: `M ${props.cx || 50},${props.cy || 50} 
        m -${props.outerRadius || 30},0 
        a ${props.outerRadius || 30},${props.outerRadius || 30} 0 1,0 ${(props.outerRadius || 30) * 2},0 
        a ${props.outerRadius || 30},${props.outerRadius || 30} 0 1,0 -${(props.outerRadius || 30) * 2},0
        Z
        m ${(props.outerRadius || 30) - (props.innerRadius || 15)},0
        a ${props.innerRadius || 15},${props.innerRadius || 15} 0 1,1 ${(props.innerRadius || 15) * 2},0
        a ${props.innerRadius || 15},${props.innerRadius || 15} 0 1,1 -${(props.innerRadius || 15) * 2},0
        Z`,
    fill: props.fill || '#3498db',
    ...props
  }),
  
  star: (props = {}) => {
    const points = props.points || 5;
    const outerRadius = props.outerRadius || 30;
    const innerRadius = props.innerRadius || 15;
    const cx = props.cx || 50;
    const cy = props.cy || 50;
    
    return {
      type: 'polygon',
      points: generateStarPoints(points, outerRadius, innerRadius, cx, cy),
      fill: props.fill || '#e74c3c',
      ...props
    };
  },
  
  zigzag: (props = {}) => {
    const width = props.width || 100;
    const height = props.height || 20;
    const steps = props.steps || 8;
    const startX = props.x || 0;
    const startY = props.y || 50;
    
    let path = `M${startX},${startY} `;
    const stepWidth = width / steps;
    
    for (let i = 0; i < steps; i++) {
      const x1 = startX + stepWidth * i + (stepWidth / 2);
      const y1 = startY + (i % 2 === 0 ? height : -height);
      const x2 = startX + stepWidth * (i + 1);
      const y2 = startY;
      
      path += `L ${x1},${y1} L ${x2},${y2} `;
    }
    
    return {
      type: 'path',
      d: path,
      fill: 'none',
      stroke: props.stroke || '#9b59b6',
      strokeWidth: props.strokeWidth || 4,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...props
    };
  }
};

/**
 * Generate random blob path with smooth curves
 * @returns {string} SVG path data for a blob
 */
function generateBlobPath() {
  const points = 8;  // Number of points for the blob
  const radius = 30; // Base radius
  const centerX = 50;
  const centerY = 50;
  const pathData = [];
  
  // Generate random points for the blob
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // Vary the radius for each point to create organic shape
    const randomRadius = radius * (0.8 + Math.random() * 0.4);
    const x = centerX + Math.cos(angle) * randomRadius;
    const y = centerY + Math.sin(angle) * randomRadius;
    
    if (i === 0) {
      pathData.push(`M${x},${y}`);
    } else {
      // Use cubic bezier curves for smooth connections
      const prevAngle = ((i - 1) / points) * Math.PI * 2;
      const prevX = centerX + Math.cos(prevAngle) * radius;
      const prevY = centerY + Math.sin(prevAngle) * radius;
      
      // Control points for the curve
      const cp1x = prevX + (x - prevX) * 0.5 - (y - prevY) * 0.2;
      const cp1y = prevY + (y - prevY) * 0.5 + (x - prevX) * 0.2;
      const cp2x = x - (x - prevX) * 0.5 - (y - prevY) * 0.2;
      const cp2y = y - (y - prevY) * 0.5 + (x - prevX) * 0.2;
      
      pathData.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`);
    }
  }
  
  // Close the path with a curve back to the first point
  const firstPoint = pathData[0].slice(1).split(',');
  const lastAngle = ((points - 1) / points) * Math.PI * 2;
  const lastX = centerX + Math.cos(lastAngle) * radius;
  const lastY = centerY + Math.sin(lastAngle) * radius;
  
  // Control points for closing curve
  const cp1x = lastX + (parseFloat(firstPoint[0]) - lastX) * 0.5 - (parseFloat(firstPoint[1]) - lastY) * 0.2;
  const cp1y = lastY + (parseFloat(firstPoint[1]) - lastY) * 0.5 + (parseFloat(firstPoint[0]) - lastX) * 0.2;
  const cp2x = parseFloat(firstPoint[0]) - (parseFloat(firstPoint[0]) - lastX) * 0.5 - (parseFloat(firstPoint[1]) - lastY) * 0.2;
  const cp2y = parseFloat(firstPoint[1]) - (parseFloat(firstPoint[1]) - lastY) * 0.5 + (parseFloat(firstPoint[0]) - lastX) * 0.2;
  
  pathData.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${firstPoint[0]},${firstPoint[1]}`);
  pathData.push('Z');
  
  return pathData.join(' ');
}

/**
 * Generate points for a star shape
 * @param {number} points - Number of star points
 * @param {number} outerRadius - Outer radius of the star
 * @param {number} innerRadius - Inner radius of the star
 * @param {number} cx - Center X position
 * @param {number} cy - Center Y position
 * @returns {string} Points string for SVG polygon
 */
function generateStarPoints(points, outerRadius, innerRadius, cx, cy) {
  let pointsString = '';
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    
    pointsString += `${x},${y} `;
  }
  
  return pointsString.trim();
}

/**
 * Generate random polygon points string
 * @param {number} sides - Number of sides for the polygon
 * @returns {string} SVG polygon points attribute value
 */
function generateRandomPolygonPoints(sides = 0) {
  const actualSides = sides || Math.floor(Math.random() * 4) + 3; // 3-6 sides if not specified
  const points = [];
  const centerX = 50;
  const centerY = 50;
  const radius = Math.random() * 30 + 20;
  
  for (let i = 0; i < actualSides; i++) {
    const angle = (i / actualSides) * Math.PI * 2;
    // Add some randomness to each point for more organic shapes
    const randomOffset = Math.random() * 10 - 5;
    const x = centerX + (Math.cos(angle) * (radius + randomOffset));
    const y = centerY + (Math.sin(angle) * (radius + randomOffset));
    points.push(`${x},${y}`);
  }
  
  return points.join(' ');
}

/**
 * Create an SVG shape with animation properties
 * @param {string} shapeType - Type of shape to create
 * @param {Object} props - Shape properties
 * @returns {Object} Shape configuration object
 */
export const createShape = (shapeType, props = {}) => {
  if (!shapes[shapeType]) {
    console.warn(`Shape type "${shapeType}" not found. Using circle as default.`);
    return shapes.circle(props);
  }
  
  return shapes[shapeType](props);
};

/**
 * Generate random shapes for background decoration
 * @param {number} count - Number of shapes to generate
 * @param {Array} types - Array of shape types to choose from
 * @param {Object} options - Additional options for shapes
 * @returns {Array} Array of shape configuration objects
 */
export const generateRandomShapes = (count = 5, types = ['circle', 'rect', 'polygon', 'blob', 'star'], options = {}) => {
  const randomShapes = [];
  const colors = options.colors || ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  const availableTypes = types.filter(type => shapes[type]); // Filter only valid shape types
  
  for (let i = 0; i < count; i++) {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Common props
    const baseProps = {
      fill: color,
      opacity: options.opacity || Math.random() * 0.5 + 0.2,
      // Add animation attributes for GSAP or Framer Motion
      'data-animate': 'true',
      'data-delay': Math.random() * 1.5,
      'data-duration': Math.random() * 1.5 + 0.8,
    };
    
    // Shape-specific properties
    switch (type) {
      case 'circle':
        baseProps.cx = Math.random() * 100;
        baseProps.cy = Math.random() * 100;
        baseProps.r = Math.random() * 20 + 5;
        break;
      case 'rect':
        baseProps.x = Math.random() * 100;
        baseProps.y = Math.random() * 100;
        baseProps.width = Math.random() * 40 + 10;
        baseProps.height = Math.random() * 40 + 10;
        baseProps.rx = Math.random() * 10;
        break;
      case 'polygon':
        baseProps.points = generateRandomPolygonPoints();
        break;
      case 'star':
        baseProps.cx = Math.random() * 100;
        baseProps.cy = Math.random() * 100;
        baseProps.outerRadius = Math.random() * 20 + 15;
        baseProps.innerRadius = baseProps.outerRadius * 0.4;
        baseProps.points = Math.floor(Math.random() * 3) + 5; // 5-7 points
        break;
      case 'blob':
        // Blob uses the auto-generated path
        break;
      default:
        // Other shapes can use their default properties
        break;
    }
    
    randomShapes.push(createShape(type, baseProps));
  }
  
  return randomShapes;
};

/**
 * Generate grid-based pattern of shapes
 * @param {string} shapeType - Type of shape to create in pattern
 * @param {number} rows - Number of rows in grid
 * @param {number} cols - Number of columns in grid
 * @param {Object} options - Additional options for shapes
 * @returns {Array} Array of shape configuration objects
 */
export const generateShapePattern = (shapeType = 'circle', rows = 5, cols = 5, options = {}) => {
  const shapePatterns = [];
  const colors = options.colors || ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const color = options.useRandomColors 
        ? colors[Math.floor(Math.random() * colors.length)]
        : colors[row % colors.length];
      
      shapePatterns.push(createShape(shapeType, {
        cx: (100 / cols) * col + (100 / cols / 2),
        cy: (100 / rows) * row + (100 / rows / 2),
        x: (100 / cols) * col + 5,
        y: (100 / rows) * row + 5,
        width: (100 / cols) - 10,
        height: (100 / rows) - 10,
        r: Math.min(100 / cols, 100 / rows) / 2.5,
        fill: color,
        opacity: options.opacity || 0.6,
        'data-animate': 'true',
        'data-delay': row * 0.1 + col * 0.05,
        'data-duration': 0.8,
      }));
    }
  }
  
  return shapePatterns;
};

// Default export with all functions
export default {
  createShape,
  generateRandomShapes,
  generateShapePattern,
  shapes
};