import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function ColorSelection({ setColors,colors }) {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000'); // Default color black
  const navigate = useNavigate();

  const handleChangeClassName = (e) => {
    setClassName(e.target.value);
  };


  const handleAddClass = () => {
    if (className.trim() !== '') {
      const newClass = {
        name: className,
        color: selectedColor
      };
      setClasses([...classes, newClass]);
      setClassName('');
    } else {
      alert('Please enter a class name.');
    }
  };

  const handleDeleteClass = (index) => {
    const updatedClasses = [...classes];
    updatedClasses.splice(index, 1);
    setClasses(updatedClasses);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setColors(classes.map(classItem => classItem.color));

    
    // Redirect to the next URL
    navigate("/next");
  };

  const handleChangeClassColor = (index, color) => {
    const updatedClasses = [...classes];
    updatedClasses[index].color = color;
    setClasses(updatedClasses);
  };

  return (
    <div>
      <h2>Add Class</h2>
      {/* Use onSubmit attribute to handle form submission */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="className">Class Name:</label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={handleChangeClassName}
          />
        </div>
        <button type="button" onClick={handleAddClass}>Add Class</button>
        {/* Use type="submit" for the submit button */}
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Classes:</h3>
        <ul>
          {classes.map((classItem, index) => (
            <li key={index} style={{ color: classItem.color }}>
              {classItem.name}
              <input
                type="color"
                value={classItem.color}
                onChange={(e) => handleChangeClassColor(index, e.target.value)}
              />
              <button onClick={() => handleDeleteClass(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {colors && (
        <div>
          <h3>Submitted Colors:</h3>
          <ul>
            {colors.map((color, index) => (
              <li key={index} style={{ color }}>{color}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ColorSelection;
