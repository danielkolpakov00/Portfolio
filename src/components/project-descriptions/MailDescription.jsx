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
        <section className="space-y-6 w-full overflow-x-hidden">
            <h3 className="text-xl text-blue2 md:text-2xl lg:text-2xl font-semibold pb-2 border-b border-gray-200 w-full">
                A neat little back-end API for sending emails.
            </h3>
            
            <p className="text-base md:text-lg lg:text-xl leading-relaxed max-w-full">
                Dipping my toes into backend development, I made a simple API that sends emails. I used Node.js and Express to create the server, and Nodemailer to send the emails.
            </p>
            
            <h3 className="text-xl text-blue2 md:text-2xl lg:text-2xl font-semibold pb-2 border-b border-gray-200 w-full">What Makes This Cool</h3>
            
            <p className="text-base md:text-lg lg:text-xl leading-relaxed max-w-full">
                I included a rate limiter to prevent spamming, and I also added a simple form to test the API. The form is built with Vanilla JS and Tailwind CSS.
            </p>
            
            <h3 className="text-xl text-blue2 md:text-2xl lg:text-2xl font-semibold pb-2 border-b border-gray-200 w-full">How It Works</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-4 md:p-6">
                    <h4 className="text-lg font-medium mb-3 text-blue2">Setting Up the Server</h4>
                    <p className="text-base leading-relaxed mb-3">The server is built using Node.js and Express. Here's a quick overview:</p>
                    <ul className="list-disc pl-5 space-y-1 text-base">
                        <li>Initialize a new Node.js project and install Express</li>
                        <li>Set up basic routes for handling email requests</li>
                        <li>Use Nodemailer to configure email transport and send emails</li>
                        <li>Implement session-based rate limiting (so that you can't spam my email)</li>
                    </ul>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-4 md:p-6">
                    <h4 className="text-lg font-medium mb-3 text-blue2">MongoDB</h4>
                    <p className="text-base leading-relaxed mb-3">The API uses MongoDB to store emails.</p>
                    <ul className="list-disc pl-5 space-y-1 text-base">
                        <li>Design a simple form with fields for recipient, subject, and message</li>
                        <li>Use JavaScript to handle form submission and send data to the server</li>
                        <li>Display success or error messages based on the server response</li>
                    </ul>
                   
                    
                </div>
                
            </div>
            <p className="text-blue2 pl-5 py-2 text-sm">Here's an example of what a record would look like in MongoDB:</p>
            <pre className="overflow-x-auto w-full mx-auto flex justify-center">
                
                          <code ref={codeRef} className="language-javascript text-sm">
{`"_id": ObjectId("abcdefg1234567"),
"email": "helloworld@daniel.com",
"message": "Example Message"`}
                          </code>
                        </pre>
        </section>
    );
};

export default MailDescription;
