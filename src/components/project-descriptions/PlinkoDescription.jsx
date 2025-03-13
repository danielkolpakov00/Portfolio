import React from 'react';

const PlinkoDescription = () => (
  <section className="space-y-12 w-full max-w-7xl mx-auto">
    <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">
      An interactive physics-based Plinko game with realistic ball physics and probability mechanics
    </h3>
    
    <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
      I built this Plinko game from scratch using Matter.js to handle all the physics. It's not just any Plinko game - it actually tracks real probabilities and gives you that satisfying "bounce" feeling when balls drop through the pegs.
    </p>
    
    
    
    <h3 className="text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 border-b border-gray-200 w-full">How I Built It</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
        <h4 className="text-xl font-medium mb-4 text-blue2">Physics Engine</h4>
        <p className="text-lg leading-relaxed mb-4">Matter.js does the heavy lifting here. I had to experiment a ton with different physics properties to get that "just right" feeling:</p>
        <ul className="list-disc pl-8 space-y-2 text-lg">
          <li>Carefully tuned restitution (bounciness) for realistic ball behavior</li>
          <li>Custom friction coefficients for each surface type</li>
          <li>Gravity settings that feel natural but still fun</li>
        </ul>
      </div>
      
      <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
        <h4 className="text-xl font-medium mb-4 text-blue2">Multiplier System</h4>
        <p className="text-lg leading-relaxed mb-4">Each landing zone has different point values with custom animations:</p>
        <ul className="list-disc pl-8 space-y-2 text-lg">
          <li>Collision detection for precise hit registration</li>
          <li>Animations that react to ball impact</li>
          <li>Score calculation based on where balls land</li>
        </ul>
      </div>
    </div>
    
    <div className="bg-white/80 bg-blur-lg rounded-xl shadow-lg p-8">
      <h4 className="text-xl font-medium mb-4 text-blue2">How it's Balanced</h4>
      <p className="text-lg leading-relaxed mb-4">As an attempt to balance the game as much as possible, I added a force that drags the balls inwards in order to balance the game a little bit. 
        This didn't come without its challenges, because sometimes the balls got stuck in the pegs. This was fixed by lowering the friction of the pegs and increasing the restitution of the balls. 
        Obviously, since the ball's movement isn't 100% calculated by probability (this would take ages to do!), I had to cut a few corners. Sometimes, the balls would fly out of the entire game, but I fixed this by adding invisible walls at the edges of the pegs.
        Overall, this was a really fun project, and I learned a lot about how to solve problems in a creative way.

      </p>
     
    </div>
  </section>
);

export default PlinkoDescription;
