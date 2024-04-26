import React, { useState, useRef,useEffect ,useMemo} from 'react';

function PaintBrush({ colors }) {

  const [selectedColor, setSelectedColor] = useState('red'); // Default color black
  // console.log(selectedColor);
  const[currImage, setCurrImage] = useState(null);
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [size, setSize] = useState(25);
  const canvasRef = useRef(null);

  useEffect(()=>{
    if (currImage) drawOnImage()
  },[selectedColor])

  const handleFileInputChange = async (e) => {
    const [file] = e.target.files;

    const image = new Image();
    image.src = await fileToDataUri(file);

    image.onload = () => {
      setCurrImage(image);
    };
  };

  const fileToDataUri = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(file);
    });
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setStateStack([...stateStack, context.getImageData(0, 0, canvas.width, canvas.height)]);
    setRedoStack([]); 
  };

  const initCanvas =  useMemo(()=>(canvasElement,context)=>{
    if (currImage) {
      const imageWidth = currImage.width;
      const imageHeight = currImage.height;
      console.log(canvasElement,"andar")
      canvasElement.width = imageWidth;
      canvasElement.height = imageHeight;

      context.drawImage(currImage, 0, 0, imageWidth, imageHeight);
      saveState();
    }
  },[currImage]);

  
  const drawOnImage = () => {
    const canvasElement = canvasRef.current;
    const context = canvasElement.getContext("2d");
    console.log(canvasElement, "bahar");
    initCanvas(canvasElement, context);

    let isDrawing = false;

    canvasElement.onmousedown = (e) => {
      isDrawing = true;
      context.beginPath();
      context.lineWidth = size;
      context.lineJoin = "round";
      context.lineCap = "round";
      if (isErasing) {
        context.globalCompositeOperation = "destination-out"; 
        context.strokeStyle = "rgba(0,0,0,0)"; 
      } else {
        context.globalCompositeOperation = "source-over"; 
        context.strokeStyle = selectedColor;
      }
      context.moveTo(e.pageX - canvasElement.offsetLeft, e.pageY - canvasElement.offsetTop); 
    };
    
    canvasElement.onmousemove = (e) => {
      if (isDrawing) {
        context.lineTo(e.pageX - canvasElement.offsetLeft, e.pageY - canvasElement.offsetTop); 
        context.stroke();
        saveState(); // Save state after each drawing action
      }
    };

    canvasElement.onmouseup = function () {
      isDrawing = false;
      context.closePath();
    };
  };

  const undo = () => {
    if (stateStack.length > 1) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      setRedoStack([...redoStack, stateStack.pop()]);
      context.putImageData(stateStack[stateStack.length - 1], 0, 0);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      setStateStack([...stateStack, redoStack.pop()]);
      context.putImageData(redoStack[redoStack.length - 1], 0, 0);
    }
  };

  const saveImage = () => {
    console.log(colors);
    const canvas = canvasRef.current;
    const imageDataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = imageDataURL;
    a.download = "colored_image.png"; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  return (
    <div>
      <input id="upload" type="file" accept="image/*" onChange={handleFileInputChange} />
      <div id="canvasContainer">
        <canvas id="canvas" ref={canvasRef} width="500" height="200"></canvas>
      </div>
      <div className="control">
        <span>Size: </span>
        <input
          type="range"
          min="1"
          max="50"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="size"
          id="sizeRange"
        />
      </div>
      <div className="control">
        <span>Color: </span>
        {colors && colors.map((color, index) => (
          <input
            key={index}
            type="radio"
            name="colorRadio"
            value={color}
            id={color}
            checked={selectedColor === color}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        ))}
        {colors && colors.map((color, index) => (
          <label key={index} htmlFor={color}>{color}</label>
        ))}
      </div>
      <div id="buttonsContainer" className="control">
        <button id="clear" onClick={() => {
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          saveState();
        }}>Clear</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button id="saveButton" onClick={saveImage}>Save Image</button>
      </div>
      <p>Start drawing on the blank canvas, or upload an image and use the brush to draw on it</p>
    </div>
  );
}

export default PaintBrush;
