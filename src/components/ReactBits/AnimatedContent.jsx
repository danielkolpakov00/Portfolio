import { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedContent = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0
}) => {
  // Force inView to true immediately for fixing visibility issues
  const [inView, setInView] = useState(true);
  const ref = useRef();

  // Set up intersection observer only if we want to observe scrolling
  useEffect(() => {
    if (!ref.current || threshold === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(ref.current);
          setTimeout(() => {
            setInView(true);
          }, delay);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, delay]);

  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${reverse ? `-${distance}px` : `${distance}px`}) scale(${scale})`,
      opacity: animateOpacity ? initialOpacity : 1,
    },
    to: {
      transform: `translate${directions[direction]}(0px) scale(1)`,
      opacity: 1,
    },
    delay,
    config,
  });

  return (
    <animated.div ref={ref} style={springProps} className="w-full h-full">
      {children}
    </animated.div>
  );
};

export default AnimatedContent;