import React, { useRef, useEffect } from 'react';

class CanvasElement {
  constructor(ctx, x, y, width, height) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    // Implement the drawing logic for this canvas element
  }
}

class BackgroundElement extends CanvasElement {
  constructor(ctx, backgroundColor) {
    super(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height);
    this.backgroundColor = backgroundColor;
  }

  draw() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class MaskElement extends CanvasElement {
  constructor(ctx, maskImage, x, y, width, height) {
    super(ctx, x, y, width, height);
    this.maskImage = maskImage;
  }

  draw() {
    this.ctx.globalCompositeOperation = 'source-in';
    this.ctx.drawImage(this.maskImage, this.x, this.y, this.width, this.height);
  }
}

class CaptionElement extends CanvasElement {
  constructor(ctx, text, x, y, fontSize, alignment, textColor) {
    super(ctx, x, y, 0, 0);
    this.text = text;
    this.fontSize = fontSize;
    this.alignment = alignment;
    this.textColor = textColor;
  }

  draw() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.font = `${this.fontSize}px Arial`;
    this.ctx.fillStyle = this.textColor;
    this.ctx.textAlign = this.alignment;
    this.ctx.fillText(this.text, this.x, this.y);
  }
}

const CanvasEditor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const backgroundColor = '#0369A1';
    const backgroundElement = new BackgroundElement(ctx, backgroundColor);
    backgroundElement.draw();

    const maskImage = new Image();
    maskImage.src = templateData.urls.mask;
    maskImage.onload = () => {
      const { x, y, width, height } = templateData.imageMask;
      const maskElement = new MaskElement(ctx, maskImage, x, y, width, height);
      maskElement.draw();

      const { text, position, fontSize, alignment, textColor } = templateData.caption;
      const captionElement = new CaptionElement(
        ctx,
        text,
        position.x,
        position.y,
        fontSize,
        alignment,
        textColor
      );
      captionElement.draw();
    };
  }, []);

  return <canvas ref={canvasRef} width={1080} height={1080} />;
};