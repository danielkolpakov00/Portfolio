import { useRef } from 'react';
import VariableProximity from '../ReactBits/VariableProximity';


const MusicDescription = () => {
  const containerRef = useRef(null);

  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto">
      
      <div ref={containerRef} style={{position: 'relative'}}>
        <VariableProximity
          label={'A music visualizer that transforms your favorite songs into mesmerizing 3D animations'}
          className={'text-xl text-blue2 md:text-2xl lg:text-3xl font-semibold pb-3 w-full'}
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={300}
          falloff='linear'
        />
      </div>
      
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
        I've always been fascinated by how music can be represented visually. So I built this audio visualizer that analyzes your music in real-time and creates stunning 3D animations that pulse, flow, and evolve with every beat and note. This was pretty hard. The initial version of this project was basically a sphere divided into particles. Then I had to map those particles to the frequency data provided in the music. This is the reason why songs from streaming services wouldn't work here. Although you can play and hear the tracks, they don't provide raw audio data, which is what I need to make this work.
      </p>
      <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-full py-2">
      This project definitely deserves a video explanation, so stay tuned!
        </p>
      
   
      
      
      
     
      
      
    </section>
  );
};

export default MusicDescription;
