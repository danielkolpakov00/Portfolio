const StarBorder = ({
  as: Component = "div",
  className = "",
  color = "#3B82F6",
  speed = "6s",
  children,
  ...rest
}) => {
  return (
    <Component className={`relative inline-block overflow-hidden rounded-lg ${className}`} {...rest}>
      <div
        className="absolute w-[300%] h-[30%] bottom-[-5px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[30%] top-[-5px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
        }}
      ></div>
      <div className="relative z-1 border border-blue-500 rounded-lg">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;