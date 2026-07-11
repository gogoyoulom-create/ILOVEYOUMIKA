import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect mobile touch screens to disable cursor glow
    const mobileCheck = () => {
      const match = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(match);
    };

    mobileCheck();
    window.addEventListener('resize', mobileCheck);

    if (isMobile) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', mobileCheck);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div
      className="custom-cursor-glow pointer-events-none transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
      }}
    />
  );
}
