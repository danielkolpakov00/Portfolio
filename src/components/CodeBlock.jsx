import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCog } from "@fortawesome/free-solid-svg-icons";

// Add available libraries configuration
const availableLibraries = {
  three: {
    name: "Three.js",
    url: "https://unpkg.com/three@0.159.0/build/three.module.js",
    checked: true
  },
  gsap: {
    name: "GSAP",
    url: "https://unpkg.com/gsap@3.12.2/dist/gsap.min.js",
    checked: false
  },
  threeAddons: {
    name: "Three.js Addons",
    url: "https://unpkg.com/three@0.159.0/examples/jsm/",
    checked: true
  },
  postprocessing: {
    name: "Post Processing",
    url: "https://unpkg.com/three@0.159.0/examples/jsm/postprocessing/",
    checked: false
  }
};

const CodeBlock = ({
  initialCode = { html: "", css: "", js: "" },
  steps = [],  // New prop for step-by-step tutorial
  enablePreview = false,
  previewSetup = {
    imports: {},
    setupCode: "",
    wrapperCode: (code) => code,
  },
}) => {
  const [activeTab, setActiveTab] = useState("html");
  const [isEditing, setIsEditing] = useState(false);
  const [codeValues, setCodeValues] = useState(initialCode);
  const [isValidCode, setIsValidCode] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLibraries, setSelectedLibraries] = useState(availableLibraries);
  const [previewError, setPreviewError] = useState(null);

  const codeBlockRef = useRef(null);
  const iframeId = useRef(`preview-${Math.random().toString(36).substr(2, 9)}`);

  // Highlight the code using hljs
  const highlightCode = (code, language) => {
    const sanitizedCode = DOMPurify.sanitize(code);
    const languageMap = {
      html: 'html',
      css: 'css',
      js: 'javascript'
    };
    return hljs.highlight(sanitizedCode, { language: languageMap[language] || 'javascript' }).value;
  };

  // Utility: Get the caret position in a contentEditable element
  const getCaretPosition = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(codeBlockRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const caretOffset = preCaretRange.toString().length;

    return caretOffset;
  };

  // Utility: Restore the caret position in a contentEditable element
  const restoreCaretPosition = (caretOffset) => {
    const selection = window.getSelection();
    selection.removeAllRanges();

    const range = document.createRange();
    let charCount = 0;
    const findCaretNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharCount = charCount + node.textContent.length;
        if (caretOffset <= nextCharCount) {
          range.setStart(node, caretOffset - charCount);
          range.collapse(true);
          return true;
        }
        charCount = nextCharCount;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (findCaretNode(node.childNodes[i])) return true;
        }
      }
      return false;
    };

    findCaretNode(codeBlockRef.current);
    selection.addRange(range);
  };

  // Validate the code based on language
  const validateCode = (code, language) => {
    try {
      switch (language) {
        case 'js':
          new Function(`"use strict"; ${code}`);
          break;
        case 'css':
          // Basic CSS validation (check for matching braces)
          if ((code.match(/{/g) || []).length !== (code.match(/}/g) || []).length) {
            throw new Error('Invalid CSS');
          }
          break;
        case 'html':
          // Basic HTML validation (create temporary element to parse HTML)
          const parser = new DOMParser();
          const doc = parser.parseFromString(code, 'text/html');
          if (doc.querySelector('parsererror')) {
            throw new Error('Invalid HTML');
          }
          break;
      }
      setIsValidCode(true);
      return true;
    } catch (error) {
      setIsValidCode(false);
      return false;
    }
  };

  // Handle input changes
  const handleInput = (event) => {
    const caretOffset = getCaretPosition();
    const newCode = event.target.innerText;
    setCodeValues(prev => ({
      ...prev,
      [activeTab]: newCode
    }));

    if (validateCode(newCode, activeTab)) {
      if (enablePreview) updatePreview();
    }

    setTimeout(() => {
      if (codeBlockRef.current) {
        codeBlockRef.current.innerHTML = highlightCode(newCode, activeTab);
        restoreCaretPosition(caretOffset);
      }
    }, 0);
  };

  // Handle Tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const caretOffset = getCaretPosition(); // Save cursor position
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const textNode = range.startContainer;
      const startOffset = range.startOffset;

      const beforeText = textNode.textContent.substring(0, startOffset);
      const afterText = textNode.textContent.substring(startOffset);

      textNode.textContent = `${beforeText}  ${afterText}`; // Add 2 spaces for Tab
      range.setStart(textNode, startOffset + 2);
      range.setEnd(textNode, startOffset + 2);

      setCodeValue(codeBlockRef.current.innerText);

      restoreCaretPosition(caretOffset + 2); // Restore the cursor position
    }
  };

  // Update the imports configuration
  const getImportsMap = () => {
    const imports = {};
    
    if (selectedLibraries.three.checked) {
      imports['three'] = 'https://unpkg.com/three@0.159.0/build/three.module.js';
    }
    
    if (selectedLibraries.threeAddons.checked) {
      imports['three/addons/'] = 'https://unpkg.com/three@0.159.0/examples/jsm/';
      imports['three/examples/jsm/'] = 'https://unpkg.com/three@0.159.0/examples/jsm/';
    }
    
    if (selectedLibraries.postprocessing.checked) {
      imports['three/examples/jsm/postprocessing/'] = 'https://unpkg.com/three@0.159.0/examples/jsm/postprocessing/';
    }
    
    return imports;
  };

  // Update style tag to use a string attribute
  const cssStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 0.75rem;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 9999px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;

  // Update preview iframe with combined code
  const updatePreview = () => {
    const iframe = document.getElementById(iframeId.current);
    if (!iframe) return;

    try {
      // Simplify the imports to avoid multiple import maps
      const moduleImports = `
        import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
        import { EffectComposer } from 'https://unpkg.com/three@0.159.0/examples/jsm/postprocessing/EffectComposer.js';
        import { RenderPass } from 'https://unpkg.com/three@0.159.0/examples/jsm/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'https://unpkg.com/three@0.159.0/examples/jsm/postprocessing/UnrealBloomPass.js';
        import { SVGLoader } from 'https://unpkg.com/three@0.159.0/examples/jsm/loaders/SVGLoader.js';
      `;

      const previewContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Preview</title>
  ${selectedLibraries.gsap.checked ? 
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>' 
    : ''}
  <style>
    body { margin: 0; overflow: hidden; }
    ${codeValues.css}
  </style>
</head>
<body>
  ${codeValues.html}
  <script type="module">
    // Error handling
    window.onerror = (msg, url, line, col, error) => {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#fee2e2;color:#dc2626;padding:0.75rem;z-index:9999;';
      errorDiv.textContent = \`Error: \${msg} (line \${line})\`;
      document.body.insertBefore(errorDiv, document.body.firstChild);
      return false;
    };

    try {
      ${moduleImports}
      ${codeValues.js}
    } catch (error) {
      window.onerror(error.message, null, error.lineNumber);
    }
  </script>
</body>
</html>`;

      const blob = new Blob([previewContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      iframe.src = url;
      iframe.onload = () => URL.revokeObjectURL(url);
      
      setPreviewError(null);
    } catch (error) {
      setPreviewError(error.message);
    }
  };

  // Initialize code display on mount and tab change
  useEffect(() => {
    if (codeBlockRef.current && codeValues[activeTab]) {
      codeBlockRef.current.textContent = codeValues[activeTab];
      codeBlockRef.current.innerHTML = highlightCode(codeValues[activeTab], activeTab);
    }
  }, [activeTab, codeValues]);

  // Handle preview updates when code changes
  useEffect(() => {
    if (enablePreview) {
      updatePreview();
    }
  }, [codeValues]);

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCodeValues(steps[currentStep + 1].code);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCodeValues(steps[currentStep - 1].code);
    }
  };

  // Add library toggle handler
  const toggleLibrary = (libraryKey) => {
    setSelectedLibraries(prev => ({
      ...prev,
      [libraryKey]: {
        ...prev[libraryKey],
        checked: !prev[libraryKey].checked
      }
    }));
  };

  return (
    <div className="flex flex-col h-auto min-h-[500px] max-h-screen"> {/* Changed height handling */}
      {previewError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Preview Error</p>
          <p>{previewError}</p>
        </div>
      )}
      <div className="flex flex-1 min-h-0"> {/* Added min-h-0 to allow proper scrolling */}
        <div className={`${enablePreview ? "w-1/2" : "w-full"} bg-gray-900 shadow-lg overflow-hidden relative flex flex-col`}>
          <div className="flex border-b border-gray-700">
            {["html", "css", "js"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 uppercase flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-gray-800 text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <i className={`fas fa-${
                  tab === 'html' ? 'code' : 
                  tab === 'css' ? 'palette' : 
                  'js-square'
                }`}></i>
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden relative">
            <pre className="hljs h-full overflow-auto custom-scrollbar">
              <code
                ref={codeBlockRef}
                className={`language-${activeTab} block p-6`}
                contentEditable={isEditing}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                suppressContentEditableWarning={true}
              />
            </pre>
          </div>
          <div className="absolute left-2 bottom-2 flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-all duration-200 transform hover:scale-110"
              title="Settings"
            >
              <FontAwesomeIcon
                icon={faCog}
                className={`w-4 h-4 text-gray-400 ${showSettings ? 'rotate-90' : ''} transition-transform duration-200`}
              />
            </button>
            
            {/* Existing edit button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`${
                isEditing ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
              } rounded-full p-2 transition-all duration-200 transform hover:scale-110`}
              title={isEditing ? "View" : "Edit"}
            >
              <FontAwesomeIcon
                icon={faPenToSquare}
                className={`w-4 h-4 ${isValidCode ? "text-gray-400" : "text-red-400"}`}
              />
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute left-2 bottom-14 bg-gray-800 rounded-lg shadow-lg p-4 z-50">
              <h3 className="text-white text-sm font-semibold mb-2">Libraries</h3>
              <div className="space-y-2">
                {Object.entries(selectedLibraries).map(([key, lib]) => (
                  <label key={key} className="flex items-center gap-2 text-gray-300 text-sm">
                    <input
                      type="checkbox"
                      checked={lib.checked}
                      onChange={() => toggleLibrary(key)}
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    {lib.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {enablePreview && (
          <div className="w-1/2 bg-gray-900">
            <iframe
              id={iframeId.current}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
              title="Code Preview"
            />
          </div>
        )}
      </div>

      {steps.length > 0 && (
        <div className="bg-gray-900 p-4 border-t border-gray-700 sticky bottom-0">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded ${
                currentStep === 0
                  ? "bg-gray-700 text-gray-500"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              Previous Step
            </button>
            <span className="text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={goToNextStep}
              disabled={currentStep === steps.length - 1}
              className={`px-4 py-2 rounded ${
                currentStep === steps.length - 1
                  ? "bg-gray-700 text-gray-500"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              Next Step
            </button>
          </div>
          <div className="text-gray-300">
            <h3 className="text-lg font-semibold mb-2">{steps[currentStep]?.title}</h3>
            <p className="text-sm">{steps[currentStep]?.description}</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
    </div>
  );
};

export default CodeBlock;
