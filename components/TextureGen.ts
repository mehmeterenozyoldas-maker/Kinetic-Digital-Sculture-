import * as THREE from 'three';

export const CHAR_SET = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'M', 'E', 'H', 'T'];

/**
 * Generates a texture atlas containing numbers 0-9 and letters M, E, H, T.
 */
export const generateAtlasTexture = (): THREE.CanvasTexture => {
  const width = 2048; // Increased resolution
  const height = 256; 
  const cols = CHAR_SET.length;
  const cellWidth = width / cols;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not create canvas context');

  // Background - Stone Grey
  ctx.fillStyle = '#888899';
  ctx.fillRect(0, 0, width, height);

  // Noise/Grunge Pass
  for(let i=0; i<10000; i++) {
     ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
     ctx.fillRect(Math.random() * width, Math.random() * height, 4, 4);
  }

  // Text settings
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';

  // Draw characters
  CHAR_SET.forEach((char, i) => {
    const x = i * cellWidth + cellWidth / 2;
    const y = height / 2;
    
    // Draw a border for "Brutalist" panel look
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 8;
    ctx.strokeRect(i * cellWidth + 10, 10, cellWidth - 20, height - 20);

    // Main Character
    ctx.font = 'bold 160px "Courier New", monospace';
    ctx.fillText(char, x, y);
    
    // Add some "Data" artifacts
    ctx.font = '20px monospace';
    const hexCode = char.charCodeAt(0).toString(16).toUpperCase();
    ctx.fillText(`0x${hexCode}`, x, y + 80);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
};

/**
 * Generates a normal map for the stone texture
 */
export const generateNormalMap = (): THREE.CanvasTexture => {
   const size = 512;
   const canvas = document.createElement('canvas');
   canvas.width = size;
   canvas.height = size;
   const ctx = canvas.getContext('2d');
   if(!ctx) throw new Error("No context");

   ctx.fillStyle = '#8080ff'; // Flat normal color
   ctx.fillRect(0,0,size,size);

   // Simple noise for bumps
   for(let i=0; i<10000; i++) {
       const x = Math.random() * size;
       const y = Math.random() * size;
       // Creating localized perturbation
       const shade = Math.random() > 0.5 ? '#9090ff' : '#7070ff';
       ctx.fillStyle = shade;
       ctx.fillRect(x,y, 4, 4);
   }

   const tex = new THREE.CanvasTexture(canvas);
   tex.wrapS = THREE.RepeatWrapping;
   tex.wrapT = THREE.RepeatWrapping;
   return tex;
}