import { useEffect, useRef } from 'react';

export default function StarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    let shootingStars = [];
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const density = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random(),
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          color: Math.random() > 0.35 ? '#ffffff' : Math.random() > 0.5 ? '#64ffda' : '#00f0ff',
          parallaxFactor: Math.random() * 0.04 + 0.01 // Parallax movement depth
        });
      }
    };

    const addShootingStar = () => {
      // Periodic shooting stars
      if (Math.random() > 0.995 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.6,
          y: Math.random() * canvas.height * 0.4,
          dx: Math.random() * 4 + 4,
          dy: Math.random() * 2 + 2,
          length: Math.random() * 80 + 40,
          opacity: 1,
          speed: Math.random() * 3 + 5
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse lerping for parallax sway
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw Twinkling Stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed * star.twinkleDirection;
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.twinkleDirection = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.twinkleDirection = 1;
        }

        // Apply mouse parallax shift
        const shiftX = mouse.x * star.parallaxFactor;
        const shiftY = mouse.y * star.parallaxFactor;

        // Wrap stars around screen borders if parallax shifts them off
        let finalX = (star.x + shiftX + canvas.width) % canvas.width;
        let finalY = (star.y + shiftY + canvas.height) % canvas.height;

        ctx.beginPath();
        ctx.arc(finalX, finalY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
      });

      // Draw and Update Shooting Stars
      shootingStars.forEach((star, index) => {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(star.x, star.y, star.x - star.dx * 8, star.y - star.dy * 8);
        grad.addColorStop(0, `rgba(0, 240, 255, ${star.opacity})`);
        grad.addColorStop(0.3, `rgba(100, 255, 218, ${star.opacity * 0.6})`);
        grad.addColorStop(1, 'rgba(10, 25, 47, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.dx * 8, star.y - star.dy * 8);
        ctx.stroke();

        // Update shooting star coordinates
        star.x += star.dx;
        star.y += star.dy;
        star.opacity -= 0.015;

        // Remove shooting star if it fades out or goes offscreen
        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });
      ctx.globalAlpha = 1.0; // Reset opacity

      addShootingStar();
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      // Capture coordinates relative to the screen center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouse.targetX = e.clientX - centerX;
      mouse.targetY = e.clientY - centerY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        mouse.targetX = e.touches[0].clientX - centerX;
        mouse.targetY = e.touches[0].clientY - centerY;
      }
    };

    // Listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    resizeCanvas();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
    />
  );
}
