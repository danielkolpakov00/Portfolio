import React from "react";

const AboutMeSectionHeader = ({ 
  title, 
  description,
  titleColor = "text-blue2",
  descriptionColor = "text-blue2/80",
  dividerColor = "bg-gradient-to-r from-transparent via-blue2/60 to-transparent",
  className = ""
}) => {
  return (
    <div className={`mb-6 sm:mb-8 text-center px-4 ${className}`}>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${titleColor} mb-2 sm:mb-3`}>{title}</h2>
      <p className={`${descriptionColor} text-base sm:text-lg max-w-2xl mx-auto`}>{description}</p>
      <div className={`w-16 sm:w-24 h-1 ${dividerColor} mx-auto mt-4 sm:mt-6 rounded-full`}></div>
    </div>
  );
};

export default AboutMeSectionHeader;
