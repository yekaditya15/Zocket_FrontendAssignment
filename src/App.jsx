import { useState } from "react";
import DeleteIcon from "./images/delete.png";
import "./App.css";
import { HexColorPicker } from "react-colorful";
import CanvasEditor from "./components/CanvasEditor";
// import CanvasEditor from "./components/CanvasTesting";
import EyeDropper from "./components/EyeDropper";

function App() {
  // const [count, setCount] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null);
  const [color, setColor] = useState([]);
  // const [selectedColor, setSelectedColor] = useState("rgb(229 231 235)");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("rgb(229 231 235)");

  const [captionText, setCaptionText] = useState("");
  const [callToAction, setCallToAction] = useState("");

  const [data, setData] = useState({
    caption: {
      text: "1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs",
      position: { x: 50, y: 50 },
      max_characters_per_line: 31,
      font_size: 44,
      alignment: "left",
      text_color: "#000000",
    },
    cta: {
      text: "Shop Now",
      position: { x: 190, y: 320 },
      text_color: "#FFFFFF",
      background_color: "#000000",
    },
    image_mask: { x: 56, y: 442, width: 970, height: 600 },
    urls: {
      mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
      stroke:
        "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
      design_pattern:
        "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_0_Design_Pattern.png",
    },
  });

  const handleColorSelect = (color) => {
    setCurrentColor(color);
  };

  const handleClick = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
  };

  const handleClose = (colorInput) => {
    setIsColorPickerOpen(false);
    if (!color.includes(colorInput)) {
      const updatedColorList = [...color, colorInput];

      if (updatedColorList.length > 5) {
        // Remove the first element from the updatedColorList array
        setColor(updatedColorList.slice(1));
      } else {
        setColor(updatedColorList);
      }
      setCurrentColor(colorInput);
    } else {
      setCurrentColor(colorInput);
    }
  };

  return (
    <div className="min-h-screen p-6 w-screen bg-gray-100 flex justify-center items-center">
      <div className=" bg-white shadow-md rounded-2xl grid grid-cols-12 max-md:max-w-[32rem] max-md:max-h-full">
        {/* Canvas Element */}
        <div className="left col-span-7 h-full max-md:col-span-full max-md:h-96 p-2">
          <CanvasEditor
            captionText={captionText}
            callToAction={callToAction}
            image={selectedImage}
            backgroundColor={currentColor}
            data={data}
          />
        </div>
        {/* Customisation Element */}
        <div className="right md:col-span-5 bg-white font-satoshi py-12 px-6 h-full col-span-full rounded-lg">
          <div className="header text-center">
            <h4>Ad Customisation</h4>
            <p>Customise you ad and get template accordingly</p>
          </div>

          {/* Choose image */}
          <div className="flex flex-row mt-4 gap-2">
            <div className="w-full">
              <label htmlFor="imageInput">
                <div className="p-3 border-gray-100 border-solid border-[2px] rounded-lg cursor-pointer ">
                  <p>
                    Change the ad creative image.{" "}
                    <span className="text-blue-400 underline font-bold">
                      select file.
                    </span>
                  </p>
                </div>
              </label>
            </div>
            {/* File input */}
            <input
              id="imageInput"
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = () => {
                  const img = new Image();
                  img.onload = () => {
                    setSelectedImage(img);
                  };
                  img.src = reader.result;
                };

                reader.readAsDataURL(file);
              }}
              accept="image/*"
            />
            {selectedImage && (
              <div
                className="p-2 flex justify-center items-center border-gray-100 border-solid border-[2px] rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(null)}
              >
                <img className="w-5 h-5" src={DeleteIcon} alt="" />
              </div>
            )}
          </div>

          <div className="h-12 w-full px-3 flex justify-between items-center my-5">
            <div className="w-full h-[1px] bg-gray-400"></div>
            <p className="mx-2 text-gray-400 w-56 text-center">Edit Contents</p>
            <div className="w-full h-[1px] bg-gray-400"></div>
          </div>

          {/* Input for Ad Content */}
          <div className="mb-5 border  border-gray-400 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:text-blue-500 rounded-lg px-3 py-1 check w-full">
            <label
              htmlFor="text"
              className="block mb-1 focus-within:text-blue-500"
            >
              <p>Ad Content</p>
            </label>
            <input
              type="text"
              id="text"
              className="focus-visible:border-blue placeholder:text-gray-400 text-gray-900 text-sm block w-full"
              placeholder="Enter Ad Content"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              required
            />
          </div>

          {/* Input for CTA */}
          <div className="mb-5 border border-gray-400 focus-within:ring-blue-500 focus-within:border-blue-500 rounded-lg px-3 py-1 check">
            <label htmlFor="text" className="block mb-1">
              <p>CTA</p>
            </label>
            <input
              type="text"
              id="text"
              className="focus-visible:border-blue placeholder:text-gray-400 text-gray-900 text-sm block w-full "
              placeholder="Enter Ad Content"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <p>Choose You Color</p>
          </div>

          {/* Color Pick Option */}
          <div className="flex flex-row gap-2 items-center relative h-8">
            {color.length > 0 && (
              <>
                {color.map((color, index) => (
                  <>
                    <div
                      className={`${
                        currentColor === color
                          ? "border-2 border-blue-500 "
                          : ""
                      }rounded-full`}
                    >
                      <div
                        key={index}
                        className={`w-6 h-6 border flex justify-center items-center rounded-full cursor-pointer ${
                          currentColor === color
                            ? "border-2 border-white"
                            : "border-4 border-white"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      ></div>
                    </div>
                  </>
                ))}
              </>
            )}

            <div
              className="w-6 h-6 border bg-gray-200 flex justify-center items-center rounded-full cursor-pointer"
              onClick={handleClick}
            >
              <p className="text-gray-700 font-black text-base">+</p>
            </div>

            {isColorPickerOpen && (
              <>
                <HexColorPicker
                  className="absolute bottom-0 left-0 z-10"
                  color={color[color.length - 1]}
                  onChange={handleColorChange}
                />
                <EyeDropper
                  className="p-3 bg-white rounded-full shadow-md w-10 h-10 cursor-pointer absolute z-[11] top-[-180px] left-[208px]"
                  handleClose={handleClose}
                />
              </>
            )}
          </div>
          {isColorPickerOpen && (
            <div
              className="inset-0 absolute"
              onClick={() => {
                handleClose(currentColor);
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
