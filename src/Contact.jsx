// src/Contact.jsx
import React, { useState } from 'react';
import TsParticles from "./components/TsParticles";

const Contact = ({ isOpen }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <section className="relative px-4 lg:px-8 py-16">
      <div className="absolute inset-0">
        <TsParticles />
      </div>
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <h2 
          className="text-center text-6xl font-georama text-white font-bold italic mb-12"
          style={{
            textShadow: "2px 2px 0px #1B69FA, -2px -2px 0px #1B69FA, 2px -2px 0px #1B69FA, -2px 2px 0px #1B69FA"
          }}
        >
          Get In Touch
        </h2>

        {formSubmitted ? (
          <div className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue2">Thank You!</h3>
            <p className="text-gray-800">We've received your message and will get back to you soon.</p>
          </div>
        ) : (
          <form className="space-y-6 bg-white/30 backdrop-blur-sm rounded-xl p-8 shadow-lg" onSubmit={handleSubmit}>
            {[
              { id: 'name', label: 'Name', type: 'text', required: true },
              { id: 'surname', label: 'Surname', type: 'text', required: false },
              { id: 'email', label: 'Email', type: 'email', required: true },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-gray-800 font-semibold mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  className="w-full p-3 rounded-lg border-2 border-blue2/20 bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-blue2 focus:border-transparent transition-all"
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                  required={field.required}
                  aria-label={`Enter your ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
            
            <div>
              <label htmlFor="message" className="block text-gray-800 font-semibold mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                className="w-full p-3 rounded-lg border-2 border-blue2/20 bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-blue2 focus:border-transparent transition-all h-32"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleInputChange}
                required
                aria-label="Enter your message"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue2 text-white font-semibold p-3 rounded-lg 
                       hover:bg-blue-700 transition-colors shadow-lg
                       hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;