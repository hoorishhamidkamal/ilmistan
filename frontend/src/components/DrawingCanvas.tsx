import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  selectedColor: string;
  brushSize: number;
  tool: string;
  selectedPreset: string;
  selectedSticker: string;
  clearTrigger: number;
}

export default function DrawingCanvas({
  selectedColor,
  brushSize,
  tool,
  selectedPreset,
  selectedSticker,
  clearTrigger
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Redraw Outline Helper Function
  const redrawPreset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawPresetOutline(ctx, selectedPreset, canvas.width, canvas.height);
  };

  // Clear Canvas when clearTrigger or preset changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPresetOutline(ctx, selectedPreset, canvas.width, canvas.height);
  }, [clearTrigger, selectedPreset]);

  // Dynamic Custom Cursors for Tools
  const getCustomCursor = () => {
    let icon = '🖌️';
    if (tool === 'eraser') icon = '🧽';
    else if (tool === 'pencil') icon = '✏️';
    else if (tool === 'sticker') icon = selectedSticker;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text x="0" y="24" font-size="22">${icon}</text></svg>`;
    return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') 4 24, auto`;
  };

  // Real Tracing Outlines for Presets
  const drawPresetOutline = (ctx: CanvasRenderingContext2D, preset: string, width: number, height: number) => {
    if (preset === 'free') return;

    ctx.save();
    ctx.strokeStyle = '#64748b'; // Clear slate dashed lines
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    const cx = width / 2;
    const cy = height / 2;

    if (preset === 'tree') {
      ctx.beginPath();
      // Tree Trunk
      ctx.moveTo(cx - 30, cy + 140);
      ctx.bezierCurveTo(cx - 25, cy + 80, cx - 15, cy + 40, cx - 50, cy + 10);
      ctx.moveTo(cx - 20, cy + 30);
      ctx.lineTo(cx, cy - 10);
      ctx.moveTo(cx + 30, cy + 140);
      ctx.bezierCurveTo(cx + 25, cy + 80, cx + 15, cy + 40, cx + 50, cy + 10);
      
      // Tree Foliage
      ctx.moveTo(cx - 40, cy + 30);
      ctx.arc(cx - 70, cy + 10, 40, 0.2 * Math.PI, 1.4 * Math.PI);
      ctx.arc(cx - 70, cy - 50, 45, 0.4 * Math.PI, 1.6 * Math.PI);
      ctx.arc(cx, cy - 80, 55, 0.9 * Math.PI, 0.1 * Math.PI);
      ctx.arc(cx + 70, cy - 50, 45, 1.4 * Math.PI, 0.6 * Math.PI);
      ctx.arc(cx + 70, cy + 10, 40, 1.6 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      // Bark Lines
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(cx - 5, cy + 60);
      ctx.lineTo(cx - 10, cy + 120);
      ctx.moveTo(cx + 10, cy + 70);
      ctx.lineTo(cx + 5, cy + 125);
      ctx.stroke();

    } else if (preset === 'apple') {
      ctx.beginPath();
      ctx.bezierCurveTo(cx, cy - 80, cx + 90, cy - 80, cx + 90, cy + 10);
      ctx.bezierCurveTo(cx + 90, cy + 90, cx + 20, cy + 110, cx, cy + 80);
      ctx.bezierCurveTo(cx - 20, cy + 110, cx - 90, cy + 90, cx - 90, cy + 10);
      ctx.bezierCurveTo(cx - 90, cy - 80, cx, cy - 80, cx, cy - 50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - 50);
      ctx.bezierCurveTo(cx - 5, cy - 80, cx - 15, cy - 95, cx - 25, cy - 100);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 75);
      ctx.quadraticCurveTo(cx + 25, cy - 100, cx + 35, cy - 75);
      ctx.quadraticCurveTo(cx, cy - 60, cx - 10, cy - 75);
      ctx.stroke();

    } else if (preset === 'sun') {
      ctx.beginPath();
      ctx.arc(cx, cy, 65, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = cx + Math.cos(angle) * 75;
        const y1 = cy + Math.sin(angle) * 75;
        const x2 = cx + Math.cos(angle) * 110;
        const y2 = cy + Math.sin(angle) * 110;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

    } else if (preset === 'star') {
      ctx.beginPath();
      const points = 5;
      const outerRadius = 100;
      const innerRadius = 45;

      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

    } else if (preset === 'house') {
      ctx.beginPath();
      ctx.rect(cx - 80, cy - 10, 160, 110);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 95, cy - 10);
      ctx.lineTo(cx, cy - 90);
      ctx.lineTo(cx + 95, cy - 10);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(cx - 20, cy + 40, 40, 60);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(cx + 25, cy + 15, 35, 35);
      ctx.stroke();

    } else if (preset === 'flower') {
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = cx + Math.cos(angle) * 55;
        const py = cy + Math.sin(angle) * 55;

        ctx.beginPath();
        ctx.arc(px, py, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(cx, cy + 60);
      ctx.quadraticCurveTo(cx + 20, cy + 110, cx, cy + 140);
      ctx.stroke();
    }

    ctx.restore();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    if (tool === 'sticker') {
      ctx.font = `${brushSize * 2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker, x, y);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'sticker') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : selectedColor;
    ctx.lineWidth = tool === 'pencil' ? Math.max(2, brushSize / 3) : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Redraw Preset outline after eraser stroke so outline remains safe
    if (tool === 'eraser') {
      redrawPreset();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && tool === 'eraser') {
      redrawPreset();
    }
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={450}
      style={{ cursor: getCustomCursor() }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className="border-4 border-dashed border-sky-200 rounded-3xl bg-white w-full h-[450px] touch-none shadow-inner"
    />
  );
}