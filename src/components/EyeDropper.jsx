import { useState, useCallback } from "react";
import useEyeDropper from "use-eye-dropper";
import EyeDropperImg from "../images/eye-dropper.svg";

const EyeDropper = ({className, handleClose}) => {
  const { open, close, isSupported } = useEyeDropper();
  const [color, setColor] = useState("#fff");
  // useEyeDropper will reject/cleanup the open() promise on unmount,
  // so setState never fires when the component is unmounted.
  const pickColor = useCallback(() => {
    // Using async/await (can be used as a promise as-well)
    const openPicker = async () => {
      try {
        const color = await open();
        setColor(color.sRGBHex);
        handleClose(color.sRGBHex)
      } catch (e) {
        console.log(e);
        // Ensures component is still mounted
        // before calling setState
        if (!e.canceled) setError(e);
      }
    };
    openPicker();
  }, [open]);
  return (
    <>
      {isSupported() ? (
        <div
          onClick={pickColor}
          className={className}
        >
          <img className="w-5 h-5" src={EyeDropperImg} alt="" />
        </div>
      ) : (
        ""
        
      )}
    </>
  );
};

export default EyeDropper;
