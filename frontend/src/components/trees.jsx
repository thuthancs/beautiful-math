import { useEffect, useState } from 'react';

// Helper: convert degrees to radians
const degToRad = (deg) => (deg * Math.PI) / 180;

// Helper: draw a line on a given 2D canvas context in green
const drawLine = (ctx, x1, y1, x2, y2) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = 'green';
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

// Recursive branch function
function drawBranch(
  ctx,
  x1,
  y1,
  length,
  angle, // in degrees
  a, // branching angle
  threshold,
  fraction,
  depth,
  maxDepth
) {
  // Stop when the segment is too small or recursion is too deep
  if (length < threshold || depth >= maxDepth) return;

  // Convert degrees to radians for trig
  const rad = degToRad(angle);

  // y axis goes down in canvas, so subtract the y component
  const x2 = x1 + length * Math.cos(rad);
  const y2 = y1 - length * Math.sin(rad);

  // Draw the branch
  drawLine(ctx, x1, y1, x2, y2);

  // Point along the branch where children start (fraction of the way)
  const mx = x1 + (x2 - x1) * fraction;
  const my = y1 + (y2 - y1) * fraction;

  // Length of child branches
  const childLen = length * fraction;
  if (childLen < threshold) return;

  // Recursively draw three branches from that point
  drawBranch(ctx, mx, my, childLen, angle + a, a, threshold, fraction, depth + 1, maxDepth);
  drawBranch(ctx, mx, my, childLen, angle - a, a, threshold, fraction, depth + 1, maxDepth);
  drawBranch(ctx, mx, my, childLen, angle, a, threshold, fraction, depth + 1, maxDepth);
}

// Public function: draw one tree
function drawTree(ctx, cx, cy, l, a, threshold = 2, fraction = 0.5, maxDepth = 8) {
  // Vertical trunk going up from (cx, cy)
  let angle = 90;
  const rad = degToRad(angle);

  const x1 = cx;
  const y1 = cy;
  const x2 = x1 + l * Math.cos(rad);
  const y2 = y1 - l * Math.sin(rad);

  drawLine(ctx, x1, y1, x2, y2);

  // Point along the trunk where child branches start
  const mx = x1 + (x2 - x1) * fraction;
  const my = y1 + (y2 - y1) * fraction;

  const childLen = l * fraction;
  if (childLen >= threshold) {
    drawBranch(ctx, mx, my, childLen, angle + a, a, threshold, fraction, 1, maxDepth);
    drawBranch(ctx, mx, my, childLen, angle - a, a, threshold, fraction, 1, maxDepth);
    drawBranch(ctx, mx, my, childLen, angle, a, threshold, fraction, 1, maxDepth);
  }
}

export default function Trees() {
  const [treeData, setTreeData] = useState({
    length: 60,
    fraction: 0.7,
    angle: 30,
    threshold: 1,
    maxDepth: 10,
  });

  const GRID_SIZE = 5;
  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
  const [savedTrees, setSavedTrees] = useState(() => {
    try {
      const raw = window.localStorage.getItem('trees-grid');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const nextIndex = Math.min(savedTrees.length, TOTAL_CELLS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTreeData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nextIndex >= TOTAL_CELLS) {
      // Grid is full; you could add logic here to overwrite or reset.
      return;
    }

    const { length, fraction, angle, threshold, maxDepth } = treeData;

    const newConfig = { length, fraction, angle, threshold, maxDepth };
    const updated = [...savedTrees, newConfig];
    setSavedTrees(updated);
    try {
      window.localStorage.setItem('trees-grid', JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  // Redraw all saved trees whenever savedTrees changes (including on load)
  useEffect(() => {
    savedTrees.forEach((config, idx) => {
      if (!config) return;
      const canvas = document.getElementById(`tree-canvas-${idx}`);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { length, fraction, angle, threshold, maxDepth } = config;
      const cx = canvas.width / 2;
      const cy = canvas.height - 10;
      drawTree(ctx, cx, cy, length, angle, threshold, fraction, maxDepth);
    });
  }, [savedTrees]);

  return (
    <>
      <form className="tree-controls" onSubmit={handleSubmit}>
        <label className="tree-controls__field">
          Length:
          <input
            type="number"
            name="length"
            max={150}
            value={treeData.length}
            onChange={handleChange}
          />
        </label>
        <label className="tree-controls__field">
          Fraction:
          <input
            type="number"
            step="0.05"
            name="fraction"
            value={treeData.fraction}
            onChange={handleChange}
          />
        </label>
        <label className="tree-controls__field">
          Angle:
          <input
            type="number"
            name="angle"
            value={treeData.angle}
            onChange={handleChange}
          />
        </label>
        <label className="tree-controls__field">
          Threshold:
          <input
            type="number"
            name="threshold"
            value={treeData.threshold}
            onChange={handleChange}
          />
        </label>
        <button className="tree-controls__button" type="submit">
          Create Tree
        </button>
      </form>

      <div
        className="tree-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, auto)`,
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {Array.from({ length: TOTAL_CELLS }).map((_, idx) => (
          <canvas
            key={idx}
            id={`tree-canvas-${idx}`}
            width={280}
            height={280}
          />
        ))}
      </div>
    </>
  );
}