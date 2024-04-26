import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ColorSelection from '../src/components/Colors';
import NextScreen from '../src/components/PaintBrush';

function App() {
  const [colors, setColors] = useState(null);
  
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<ColorSelection colors={colors} setColors={setColors} />}
        />
        <Route
          path="/next"
          element={<NextScreen colors={colors} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
