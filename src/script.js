
gsap.to(".logo", {
    scale: 1.1,
    duration: 1.0,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
  
  
  gsap.to(".logo", {
    scale: 1.2,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
  
  gsap.to("#path1", {
    morphSVG: "#path2", 
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
  
  
  gsap.to(".logo", {
    rotateY: 0,  
    rotateX: 10,  
    duration: 3, 
    repeat: -1,  
    yoyo: true,   
    ease: "power1.inOut",
    transformOrigin: "center center", 
  });
  
  
  
  var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
  tl.from(".logo", {y: 100, duration: 1});
  // tl.to(".logo",  {x:1000, duration:0.2, scale:0.001});
  