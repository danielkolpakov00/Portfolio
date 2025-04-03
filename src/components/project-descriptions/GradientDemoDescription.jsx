import React from 'react';

const formatCodeWithTooltips = (codeString) => {
  // First split the code by line breaks
  const lines = codeString.split('\n').filter(line => line.trim() !== '');
  
  const keywords = [
    'precision', 'highp', 'float', 'vec2', 'vec3', 'vec4', 'uniform', 'out', 'void', 'main',
    'gl_FragCoord', 'u_resolution', 'u_color1', 'u_color2', 'u_angle', 'fragColor', 'cos', 'sin', 'dot', 'mix'
  ];

  const keywordTooltips = {
    'precision': 'Controls how accurate decimal numbers are in the shader.',
    'highp': 'Tells the computer to use very accurate decimal calculations.',
    'float': 'A number with a decimal point (like 3.14).',
    'vec2': 'A pair of numbers together (like x,y coordinates).',
    'vec3': 'Three numbers grouped together (often for RGB colors).',
    'vec4': 'Four numbers grouped together (often for colors with transparency).',
    'uniform': 'A value that stays the same for every pixel in the image.',
    'out': 'Marks a value that will be output from the shader.',
    'void': 'Means this function doesn\'t return any value.',
    'main': 'The main function that runs for every pixel on screen.',
    'gl_FragCoord': 'The current pixel\'s position on the screen.',
    'u_resolution': 'The width and height of the drawing area.',
    'u_color1': 'The first color used in the gradient.',
    'u_color2': 'The second color used in the gradient.',
    'u_angle': 'The direction the gradient flows in.',
    'fragColor': 'The final color that will be drawn on screen.',
    'cos': 'Cosine function from trigonometry, used for circular/wave effects.',
    'sin': 'Sine function from trigonometry, used for circular/wave effects.',
    'dot': 'Calculates how similar two directions are.',
    'mix': 'Blends between two values (like mixing two colors).'
  };

  // Process each line separately
  return (
    <React.Fragment>
      {lines.map((line, lineIndex) => {
        // Process words in each line
        const processedLine = line.split(/(\s+|[{}();.,])/).map((part, partIndex) => {
          const trimmedPart = part.trim();
          
          if (keywords.includes(trimmedPart) && trimmedPart !== '') {
            return (
              <span key={`${lineIndex}-${partIndex}`} className="relative group cursor-pointer">
                <span className="keyword-highlight group-hover:bg-blue-700/50 transition-colors duration-150 rounded px-0.5">{part}</span>
                <span className="tooltip absolute z-50 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs p-3 rounded shadow-lg 
                  transform -translate-x-1/2 bottom-full mb-2 left-1/2 border border-blue-400 pointer-events-none transition-opacity duration-200 ease-in-out whitespace-normal min-w-[200px] max-w-[300px] break-words">
                  {keywordTooltips[trimmedPart]}
                </span>
              </span>
            );
          }
          return part;
        });

        // Return the processed line with a line break
        return (
          <div key={lineIndex} className="code-line">
            {processedLine}
          </div>
        );
      })}
    </React.Fragment>
  );
};

const GradientDemoDescription = () => (
    <section className="space-y-8">
    <h3 className="text-xl text-white md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
      A dynamic gradient generator built with React and Tailwind CSS. This tool lets users create and customize gradient backgrounds with live previews.
    </h3>
    
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2 text-white">
      This project was super interesting to make for me, as I love making interactive projects that gives users the flexibility to create and export their own designs. I learned a lot about shaders and how they can be used to create stunning visual effects. I also learned a few things about the different types of shaders, such as vertex shaders and fragment shaders, and how they work together to render a scene.
    </p>
    <h3 className="text-xl text-white md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">What is OpenGLSL?</h3>
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2 text-white">
      Open GLSL is a C-like language that allows for high-performance graphics rendering. The shader program is responsible for rendering the scene by calculating the color of each pixel on the screen. It's a cool language that I want to learn more in-depth in the future.
    </p>
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1 text-white">
      OpenGLSL's flexibility allows for some really cool effects that would be difficult to achieve with other languages. I'm excited to see what other projects I can create with shaders in the future.
    </p>
    <p className="text-md md:text-sm lg:text-md leading-relaxed max-w-full py-2 text-white">
      Here's a sample of gradient generation in GLSL:
    </p>
    <pre className="bg-blue-900 w-full text-white p-4 rounded-lg overflow-visible relative shadow-lg">
      <code className="hljs block whitespace-pre text-sm overflow-visible"> 
        {formatCodeWithTooltips(`
#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2; 
uniform float u_angle; 

out vec4 fragColor;

void main() {
    vec2 pos = gl_FragCoord.xy / u_resolution;

    vec2 dir = vec2(cos(u_angle), sin(u_angle));
    float proj = dot(pos, dir);

    vec3 color = mix(u_color1, u_color2, proj);
    fragColor = vec4(color, 1.0);
}`)}
      </code>
      <div className="absolute bottom-2 right-2 text-xs text-blue-300 opacity-70">
        Hover over highlighted keywords for details
      </div>
    </pre>
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1 text-white">
      This code snippet shows the fragment shader used to generate the gradient effect. The shader takes in the screen resolution, two colors, and an angle as inputs. It then calculates the gradient direction and projects the pixel position onto this direction to determine the color at that point. The final color is then output to the screen.
    </p>
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1 text-white">
    I also had to learn a bit of Blender to combine animations to the model (which I named Grad Dude). I used Mixamo to get animations and Blender to combine them. I also had to learn how to export the model and animations to GLTF format, which is a common format for 3D models on the web. Overall, it was a great learning experience, and I'm excited to see what other projects I can create with 3D models in the future.
    </p>
    <p className="text-md md:text-sm lg:text-md leading-relaxed max-w-full py-2 text-white">
      Here's a sneak peek of what the Blender process looked like:
    </p>
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <div className="flex flex-col items-center w-full md:w-1/2">
        <h4 className="text-lg text-white font-semibold mb-2">Talking Animation</h4>
        <video autoPlay loop muted className="w-full rounded-lg shadow-lg">
          <source src="assets/blenderdemo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex flex-col items-center w-full md:w-1/2">
        <h4 className="text-lg text-white font-semibold mb-2">Idle Animation</h4>
        <video autoPlay loop muted className="w-full rounded-lg shadow-lg">
          <source src="assets/blenderdemo2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
    
    <style jsx>{`
      .keyword-highlight {
        color: #88ccff;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      .group:hover .keyword-highlight {
        color: #ffffff;
      }
      .keyword-highlight {
        color: #88ccff;
        font-weight: 500;
      }
      .code-line {
        line-height: 1.5;
        position: relative;
      }
      pre {
        position: relative;
        background-color: #0c2d6b !important;
        overflow-x: visible !important;
        overflow-y: visible !important;
      }
      .tooltip {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        width: auto !important;
        max-width: 300px !important;
        word-break: normal;
        text-align: center;
        line-height: 1.4;
      }
      .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: #1f2937 transparent transparent transparent;
      }
      /* Prevent tooltip from getting cut off at screen edges */
      @media (max-width: 640px) {
        .tooltip {
          left: auto !important;
          right: 0;
          transform: none;
        }
        .tooltip::after {
          left: 80%;
        }
      }
      /* Make sure tooltips don't get cut off by container */
      .hljs {
        overflow: visible !important;
      }
      /* Ensure tooltip can be seen even at the page edges */
      .relative.group {
        position: relative;
        z-index: 20;
      }
      .group:hover .tooltip {
        z-index: 100;
      }
    `}</style>
  </section>
);

export default GradientDemoDescription;