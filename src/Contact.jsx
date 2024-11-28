// src/Contact.jsx
import React, { useState } from 'react';

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
    <section className={`flex justify-center py-12 bg-blue-50 p-8 ${isOpen ? 'border-4 border-blue2' : ''}`}>
      <div className="w-full max-w-lg p-8 bg-blue-600 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-white italic mb-8">Get In Touch</h2>

        {formSubmitted ? (
          <div className="text-center text-white">
            <h3 className="text-2xl font-semibold mb-4">Thank You!</h3>
            <p>We've received your message and will get back to you soon.</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-white font-semibold mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                aria-label="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-white font-semibold mb-2">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your surname"
                value={formData.surname}
                onChange={handleInputChange}
                aria-label="Enter your surname"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-white font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-label="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-white font-semibold mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                className="w-full p-3 rounded-lg border-none h-32 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleInputChange}
                required
                aria-label="Enter your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-blue-600 font-semibold p-3 rounded-lg hover:bg-blue-100 transition-colors"
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