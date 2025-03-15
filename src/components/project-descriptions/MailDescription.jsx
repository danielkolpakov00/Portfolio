import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import '../../dk-blue.css';

const MailDescription = () => {
    const codeRef = useRef(null);
    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
        }
    }, []);
    
    return (
        <section className="space-y-8 w-full max-w-7xl mx-auto">
            <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
                A neat little back-end API for sending emails.
            </h3>
            
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
                Dipping my toes into backend development, I made a simple API that sends emails. I used Node.js and Express to create the server, and Nodemailer to send the emails.
            </p>
            
            <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">What Makes This Cool</h3>
            
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
                I included a rate limiter to prevent spamming, and I also added a simple form to test the API. The form is built with Vanilla JS and Tailwind CSS.
            </p>
            
            <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">How It Works</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
                    <h4 className="text-xl font-medium mb-4 text-blue2">Setting Up the Server</h4>
                    <p className="text-lg leading-relaxed mb-4">The server is built using Node.js and Express. Here's a quick overview:</p>
                    <ul className="list-disc pl-8 space-y-2 text-lg">
                        <li>Initialize a new Node.js project and install Express</li>
                        <li>Set up basic routes for handling email requests</li>
                        <li>Use Nodemailer to configure email transport and send emails</li>
                        <li>Implement session-based rate limiting (so that you can't spam my email)</li>
                    </ul>
                </div>
                
                <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
                    <h4 className="text-xl font-medium mb-4 text-blue2">MongoDB</h4>
                    <p className="text-lg leading-relaxed mb-4">The API uses MongoDB to store emails.</p>
                    <ul className="list-disc pl-8 space-y-2 text-lg">
                        <li>Design a simple form with fields for recipient, subject, and message</li>
                        <li>Use JavaScript to handle form submission and send data to the server</li>
                        <li>Display success or error messages based on the server response</li>
                        
                    </ul>
                    <p className="text-blue2 pl-8 py-2">Here's an example of what a record would look like in MongoDB:</p>
                    <div className="p-8">
                        <pre>
                          <code ref={codeRef} className="language-javascript">
{`"_id": ObjectId("67d44dbc0342b5f2ebcfd209"),
"email": "helloworld@daniel.com",
"message": "Example Message"`}
                          </code>
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MailDescription;
