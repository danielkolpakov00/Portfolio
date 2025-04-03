import React from 'react';

const LastFmDemoDescription = () => (
  <div className="bg-blue2/40 p-4 rounded-lg">
    <section className="space-y-8">
        <h3 className="text-xl text-white md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
          An interactive Windows App with Last.fm API integration.
        </h3>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2 text-white">
          This project is a dynamic application that integrates with the Last.fm API to provide real-time music and artist information. It empowers users to explore trending tracks, discover detailed artist bios, and stay updated on the latest releases.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1 text-white">
          This one's kind of funny. If you can't tell, I basically attempted to recreate the windows xp desktop. I used a lot of CSS to get the windows and buttons to look just right. I also used a lot of JavaScript to make the windows draggable and resizable. Try finding the easter egg that gives you a bluescreen! (in the app, of course)
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1 text-white">
          There's a few apps you can open other than the Last.fm app that you see. Try hitting the windows start button on the bottom left. Under all programs, you'll see paint and minesweeper.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-1 text-white">
          A lot of considerations went into making this app. I had to make sure the windows were draggable and resizable. React-draggable played a huge role in this. 
        </p>
         
      </section>
  </div>
);

export default LastFmDemoDescription;
