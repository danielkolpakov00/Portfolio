// CardsRow.js
import React from "react";
import { FaUser, FaBook, FaGraduationCap } from "react-icons/fa";
import Card from "./AboutMe"; // Import the Card component

const cardsData = [
  {
    heading: "Profile",
    description: "This card shows your profile details.",
    icon: <FaUser />
  },
  {
    heading: "Education",
    description: "This card contains your education information.",
    icon: <FaGraduationCap />
  },
  {
    heading: "Library",
    description: "This card holds information about your books and learning.",
    icon: <FaBook />
  }
];

export default function CardsRow() {
  return (
    <div className="flex flex-row gap-4 justify-center items-start flex-wrap">
      {cardsData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
}
