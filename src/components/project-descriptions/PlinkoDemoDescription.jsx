import React from 'react';

const PlinkoDemoDescription = () => (
  <div className="bg-blue2/40 p-4 rounded-lg">
    <h4 className="text-lg font-semibold mb-2 text-white">How it's Balanced</h4>
    <p className="text-base leading-relaxed text-white">
      As an attempt to balance the game as much as possible, I added a force that drags the balls inwards in order to balance the game a little bit.
      This didn't come without its challenges, because sometimes the balls got stuck in the pegs. This was fixed by lowering the friction of the pegs and increasing the restitution of the balls.
      Obviously, since the ball's movement isn't 100% calculated by probability (this would take ages to do!), I had to cut a few corners.
      Sometimes, the balls would fly out of the entire game, but I fixed this by adding invisible walls at the edges of the pegs.
      Overall, this was a really fun project, and I learned a lot about how to solve problems in a creative way.
    </p>
  </div>
);

export default PlinkoDemoDescription;
