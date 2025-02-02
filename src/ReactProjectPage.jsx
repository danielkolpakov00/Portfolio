import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import TsParticles from './components/TsParticles'; // Updated import for default export

const ReactProjectPage = () => {
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);

  // Shared tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null
  });

  // Project descriptions
  const glslExplanations = {
    '#version 300 es': 'Specifies the GLSL version (ES 3.0)',
    'precision highp float': 'Sets high precision for floating-point calculations',
    'uniform vec2 u_resolution': 'Screen resolution passed from JavaScript',
    'uniform vec3 u_color1': 'First color of the gradient',
    'uniform vec3 u_color2': 'Second color of the gradient',
    'uniform float u_angle': 'Angle of the gradient in radians',
    'out vec4 fragColor': 'Output color for the fragment shader',
    'vec2 pos = gl_FragCoord.xy / u_resolution': 'Normalizes pixel coordinates to [0,1] range',
    'vec2 dir = vec2(cos(u_angle), sin(u_angle))': 'Calculates gradient direction vector',
    'float proj = dot(pos, dir)': 'Projects position onto gradient direction',
    'vec3 color = mix(u_color1, u_color2, proj)': 'Interpolates between colors',
    'fragColor = vec4(color, 1.0)': 'Sets final output color with full opacity'
  };

  // Tooltip event handlers
  const showTooltip = (e, explanation) => {
    setTooltip({
      visible: true,
      x: e.clientX + 15,
      y: e.clientY - 10,
      content: explanation
    });
  };
  const updateTooltip = (e) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY - 10 }));
    }
  };
  const hideTooltip = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: null });
  };

  const formatCodeWithTooltips = (code) => (
    <div className="code-container relative">
      {code.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        // Remove inline comments and trailing semicolon for matching
        const normalizedLine = trimmedLine.split('//')[0].trim().replace(/;$/, '');
        const explanation = glslExplanations[trimmedLine] || glslExplanations[normalizedLine];
        return (
          <div 
            key={index}
            className="relative"
            onMouseEnter={explanation ? (e) => showTooltip(e, explanation) : undefined}
            onMouseMove={explanation ? updateTooltip : undefined}
            onMouseLeave={explanation ? hideTooltip : undefined}
          >
            <div
              className="opacity-0 animate-reveal hover:bg-gray-700/50 transition-colors duration-150"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="whitespace-pre block px-4 py-0.5">{line}</span>
            </div>
          </div>
        );
      })}
      {tooltip.visible && (
        <div 
          className="fixed bg-gray-800 text-white p-3 rounded-lg shadow-lg z-[9999] pointer-events-none" // removed w-96 and letting width adjust
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="mt-1 shrink-0" />
            <span>{tooltip.content}</span>
          </div>
        </div>
      )}
    </div>
  );

  const projectDescriptions = {
    'gradient-generator': (
      <section className="space-y-8">
        <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
          A dynamic gradient generator built with React and Tailwind CSS. This tool lets users create and customize gradient backgrounds with live previews.
        </h3>
        
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
          This project was super interesting to make for me, as I love making interactive projects that gives users the flexibility to create and export their own designs. I learned a lot about shaders and how they can be used to create stunning visual effects. I also learned a few things about the different types of shaders, such as vertex shaders and fragment shaders, and how they work together to render a scene.
        </p>
        <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">What is OpenGLSL?</h3>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
          Open GLSL is a C-like language that allows for high-performance graphics rendering. The shader program is responsible for rendering the scene by calculating the color of each pixel on the screen. It's a cool language that I want to learn more in-depth in the future.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
          OpenGLSL's flexibility allows for some really cool effects that would be difficult to achieve with other languages. I'm excited to see what other projects I can create with shaders in the future.
        </p>
        <p className="text-md md:text-sm lg:text-md leading-relaxed max-w-full py-2">
          Here's a sample of gradient generation in GLSL:
        </p>
        <pre className="bg-gray-900 w-full text-white p-4 rounded-lg overflow-x-auto opacity-90 relative">
          <code className="hljs language-glsl block"> 
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
        </pre>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
          This code snippet shows the fragment shader used to generate the gradient effect. The shader takes in the screen resolution, two colors, and an angle as inputs. It then calculates the gradient direction and projects the pixel position onto this direction to determine the color at that point. The final color is then output to the screen.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
        I also had to learn a bit of Blender to combine animations to the model (which I named Grad Dude). I used Mixamo to get animations and Blender to combine them. I also had to learn how to export the model and animations to GLTF format, which is a common format for 3D models on the web. Overall, it was a great learning experience, and I'm excited to see what other projects I can create with 3D models in the future.
        </p>
        <p className="text-md md:text-sm lg:text-md leading-relaxed max-w-full py-2">
          Here's a sneak peek of what the Blender process looked like:
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className="flex flex-col items-center w-full md:w-1/2">
            <h4 className="text-lg text-blue2 font-semibold mb-2">Talking Animation</h4>
            <video autoPlay loop muted className="w-full rounded-lg shadow-lg">
              <source src="src/assets/blenderdemo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="flex flex-col items-center w-full md:w-1/2">
            <h4 className="text-lg text-blue2 font-semibold mb-2">Idle Animation</h4>
            <video autoPlay loop muted className="w-full rounded-lg shadow-lg">
              <source src="src/assets/blenderdemo2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
    ),
    'lastfm-app': (
      <section className="space-y-8">
        <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
          An interactive Windows App with Last.fm API integration.
        </h3>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
          This project is a dynamic application that integrates with the Last.fm API to provide real-time music and artist information. It empowers users to explore trending tracks, discover detailed artist bios, and stay updated on the latest releases.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
          This one's kind of funny. If you can't tell, I basically attempted to recreate the windows xp desktop. I used a lot of CSS to get the windows and buttons to look just right. I also used a lot of JavaScript to make the windows draggable and resizable. Try finding the easter egg that gives you a bluescreen! (in the app, of course)
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
          There's a few apps you can open other than the Last.fm app that you see. Try hitting the windows start button on the bottom left. Under all programs, you'll see paint and minesweeper.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
          A lot of considerations went into making this app. I had to make sure the windows were draggable and resizable, and that they would stack properly when opened (which currently doesn't really work the way I expected). 
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
         I think that what really brought this to the next level is the blue bar at the top, which sort of makes it look like it is running in a virtual machine. 
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
         Side note, it's sort of hard to make a project like this responsive, since it's supposed to look like an old windows desktop. I did my best to make it look good on all screen sizes, but it's not perfect and I plan on changing that in the future.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1">
         Share me the best drawings you can make in the paint app!
        </p>
   
        
      </section>
    )
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {

      try {
        const response = await fetch('/react-projects.json');
        if (!response.ok) throw new Error('Failed to load projects data');
        const data = await response.json();
        const project = data.projects.find((proj) => proj.id === id);
        if (!project) throw new Error('Project not found.');
        if (isMounted) setSelectedProject(project);
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };
    fetchProjects();
    return () => { isMounted = false; };
  }, [id]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  const codeAnimations = `
    @keyframes reveal {
      0% {
        opacity: 0;
        transform: translateX(-10px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .animate-reveal {
      animation: reveal 0.5s ease-out forwards;
    }
  `;

  return (
    <> 
      <div className="relative">
      <TsParticles/>
        <style>{codeAnimations}</style>
        <div className="min-h-screen relative overflow-y-auto overflow-x-hidden">
          
          
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            
            {/* Header */}
            <header className="text-center space-y-4">
              
              <h1 className="text-4xl font-bold text-blue-600">
                {selectedProject?.title}
              </h1>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedProject?.technologies?.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </header>

            {/* Project Demo iFrame */}
            <div className="bg-white shadow-lg overflow-hidden">
              {selectedProject?.demoUrl ? (
                <div className="h-[1200px]">
                  <iframe
                    src={selectedProject.demoUrl}
                    title={`${selectedProject.title} Demo`}
                    className="w-full h-full border-0"
                    allow="fullscreen"
                  />
                </div>
              ) : (
                <div className="h-[1200px] flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Demo not available</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                {selectedProject && projectDescriptions[selectedProject.id]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReactProjectPage;
