import { data } from "autoprefixer";
import { useRef, useEffect, useState } from "react";

class CanvasElement {
  constructor(ctx, x, y, width, height) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }
}

class BackgroundElement extends CanvasElement {
  constructor(ctx, x, y, backgroundColor) {
    super(ctx, x, y, ctx.canvas.width, ctx.canvas.height);
    this.backgroundColor = backgroundColor;
  }

  draw() {
    this.ctx.save();
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.restore();
  }
}

class DesignImageElement extends CanvasElement {
  constructor(ctx, x, y, designImage) {
    super(ctx, x, y, ctx.canvas.width, ctx.canvas.height);
    // this.designUrl = designUrl;
    this.designImage = designImage;
  }

  draw() {
    if (this.designImage) {
      // this.ctx.globalCompositeOperation = "source-over";
      this.ctx.drawImage(
        this.designImage,
        this.x,
        this.y,
        this.ctx.canvas.width,
        this.ctx.canvas.height
      );
    }
  }
}

class MaskImageElement extends CanvasElement {
  constructor(ctx, x, y, maskImage) {
    super(ctx, x, y, ctx.canvas.width, ctx.canvas.height);
    this.maskImage = maskImage;
  }
  draw() {
    if (this.maskImage) {
      // this.ctx.globalCompositeOperation = "source-over";
      this.ctx.drawImage(
        this.maskImage,
        this.x,
        this.y,
        this.ctx.canvas.width,
        this.ctx.canvas.height
      );
    }
  }
}

class StrokeImageElement extends CanvasElement {
  constructor(ctx, x, y, strokeImage) {
    super(ctx, x, y, ctx.canvas.width, ctx.canvas.height);
    this.strokeImage = strokeImage;
  }

  draw() {
    if (this.strokeImage) {
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.drawImage(
        this.strokeImage,
        this.x,
        this.y,
        this.ctx.canvas.width,
        this.ctx.canvas.height
      );
    }
  }

  async loadStroke() {
    this.strokeImage = await this.loadImage(this.strokeUrl);
  }
}

class MainImage extends CanvasElement {
  constructor(ctx, x, y, width, height, image) {
    super(ctx, x, y, width, height);
    this.image = image;
  }

  draw() {
    if (this.image) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = "source-in";
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      this.ctx.restore();
    }
  }
}

class CaptionElement extends CanvasElement {
  constructor(
    ctx,
    text,
    x,
    y,
    fontSize,
    alignment,
    textColor,
    maxCharactersPerLine
  ) {
    super(ctx, x, y, 0, 0);
    this.text = text;
    this.fontSize = fontSize;
    this.alignment = alignment;
    this.textColor = textColor;
    this.maxCharactersPerLine = maxCharactersPerLine;
  }

  draw() {
    const lines = breakSentenceToLines(this.text, this.maxCharactersPerLine);
    let y = this.y;
    for (const line of lines) {
      this.ctx.fillStyle = this.textColor;
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.font = `${this.fontSize}px Satoshi`;
      this.ctx.textAlign = this.alignment;
      this.ctx.fillText(line, this.x, y);

      y += this.fontSize + 24;
    }
  }
}

function breakSentenceToLines(sentence, maxCharsPerLine) {
  const words = sentence.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length > maxCharsPerLine) {
      lines.push(currentLine.trim());
      currentLine = "";
    }
    currentLine += `${currentLine ? " " : ""}${word}`;
  }

  return lines.concat(currentLine.trim());
}

class CtaElement extends CanvasElement {
  constructor(ctx, text, x, y, backgroundColor, textColor) {
    super(ctx, x, y, 0, 0);
    this.text = text;
    this.backgroundColor = backgroundColor;
    this.fontSize = 32;
    this.textColor = textColor;
    this.alignment = "center";
    this.font = `${this.fontSize}px Satoshi`;
    this.padding = 56;
    this.radius = 24;
  }

  draw() {
    this.ctx.font = this.font;
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.backgroundColor;

    this.ctx.beginPath();
    this.ctx.roundRect(
      this.x - this.padding / 2,
      this.y - this.padding / 2,
      this.ctx.measureText(this.text).width + this.padding,
      parseInt(this.font, 10) + this.padding,
      this.radius
    );
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.fillStyle = this.textColor;
    this.ctx.fillText(this.text, this.x, this.y);
  }
}

const CanvasEditor = ({
  captionText,
  callToAction,
  image,
  backgroundColor,
  data,
}) => {
  const imageMask = {
    x: 10,
    y: 50,
    width: 200,
    height: 100,
    image: image,
    maskUrl:
      "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
    strokeUrl:
      "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
    designUrl:
      "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png",
  };

  const canvasRef = useRef(null);
  const { caption } = data;
  const { cta } = data;
  const { urls } = data;

  //Fallback Text
  const [fCtaText, setFCtaText] = useState(cta.text);
  const [fCaptionText, setCFaptionText] = useState(caption.text);

  //Current Text
  const [cCtaText, setCCtaText] = useState("");
  const [cCaptionText, setCCaptionText] = useState("");

  const fetchImages = async (urls) => {
    const { mask, stroke, design_pattern } = urls;
    const maskImage = await loadImage(mask);
    const strokeImage = await loadImage(stroke);
    const designImage = await loadImage(design_pattern);
    return {
      maskImage: maskImage,
      strokeImage: strokeImage,
      designImage: designImage,
    };
  };

  const loadImage = async (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  };

  const [urlImages, setUrlImages] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const canvas1 = document.createElement("canvas");
    canvas1.width = canvas.width;
    canvas1.height = canvas.height;
    const ctx1 = canvas1.getContext("2d");

    const { x, y, width, height, image } = imageMask;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const backgroundElement = new BackgroundElement(ctx, 0, 0, backgroundColor);
    const designImageElement = new DesignImageElement(
      ctx,
      0,
      0,
      urlImages.designImage
    );
    const strokeImageElement = new StrokeImageElement(
      ctx,
      0,
      0,
      urlImages.strokeImage
    );
    const maskImageElement = new MaskImageElement(
      ctx1,
      0,
      0,
      urlImages.maskImage
    );
    const mainImage = new MainImage(ctx1, 56, 442, 970, 600, image);
    const captionElement = new CaptionElement(
      ctx,
      cCaptionText,
      caption.position.x,
      caption.position.y,
      caption.font_size,
      caption.alignment,
      caption.text_color,
      caption.max_characters_per_line
    );
    const ctaElement = new CtaElement(
      ctx,
      cCtaText,
      cta.position.x,
      cta.position.y,
      cta.background_color,
      cta.text_color
    );

    if (captionText.length) {
      setCCaptionText(captionText);
    } else {
      setCCaptionText(fCaptionText);
    }

    if (callToAction.length) {
      setCCtaText(callToAction);
    } else {
      setCCtaText(fCtaText);
    }

    backgroundElement.draw();
    designImageElement.draw();
    maskImageElement.draw();
    mainImage.draw();
    strokeImageElement.draw();
    captionElement.draw();
    ctaElement.draw();

    ctx.drawImage(canvas1, 0, 0, canvas.width, canvas.height);
  }, [
    image,
    captionText,
    callToAction,
    backgroundColor,
    urlImages,
    cCaptionText,
  ]);

  useEffect(() => {
    const fetchAndSetImages = async () => {
      const images = await fetchImages({
        mask: imageMask.maskUrl,
        stroke: imageMask.strokeUrl,
        design_pattern: imageMask.designUrl,
      });
      setUrlImages(images);
    };

    fetchAndSetImages();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        height="1080"
        width="1080"
        className="border border-gray-500 h-4/5 w-4/5"
      ></canvas>
    </div>
  );
};
export default CanvasEditor;
