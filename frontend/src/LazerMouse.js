import { useEffect, useRef } from "react";
import { MS_BEFORE_LAZER_FADES } from "./config"


export default function LaserMouse() 
{
const canvasRef = useRef(null);
  const trail = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function handleMouseMove(e) {
      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      });
    }
    window.addEventListener("mousemove", handleMouseMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const duration = MS_BEFORE_LAZER_FADES; 

      // keep only fresh points
      trail.current = trail.current.filter(
        (p) => now - p.time < duration
      );

      // draw trail
      ctx.strokeStyle = "rgba(97, 218, 251, 0.8)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      trail.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}

