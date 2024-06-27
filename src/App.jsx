import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [initialUr, setInitialUr] = useState('');
  const [totalUr, setTotalUr] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [occupiedURs, setOccupiedURs] = useState(new Set());
  const [borders, setBorders] = useState([]);

  useEffect(() => {
    // Add event listener for cleanup on unmount
    return () => {
      setBorders([]);
      setOccupiedURs(new Set());
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const initialUrValue = parseInt(initialUr);
    const totalUrValue = parseInt(totalUr);
    const endUr = initialUrValue + totalUrValue - 1;

    if (initialUrValue < 1 || endUr > 45 || initialUrValue > endUr || !equipmentName) {
      alert('Ingrese un rango válido de UR entre 1 y 45 y un nombre de equipo válido.');
      return;
    }

    for (let i = initialUrValue; i <= endUr; i++) {
      if (occupiedURs.has(i)) {
        alert(`La UR ${i} ya está ocupada.`);
        return;
      }
    }

    const newBorder = {
      startTop: initialUrValue,
      endBottom: endUr,
      name: equipmentName,
    };

    setOccupiedURs(prev => {
      const newSet = new Set(prev);
      for (let i = initialUrValue; i <= endUr; i++) {
        newSet.add(i);
      }
      return newSet;
    });

    setBorders([...borders, newBorder]);

    setInitialUr('');
    setTotalUr('');
    setEquipmentName('');
  };

  const handleDelete = () => {
    if (borders.length > 0) {
      const lastBorder = borders[borders.length - 1];
      setOccupiedURs(prev => {
        const newSet = new Set(prev);
        for (let i = lastBorder.startTop; i <= lastBorder.endBottom; i++) {
          newSet.delete(i);
        }
        return newSet;
      });
      setBorders(borders.slice(0, -1));
    }
  };

  return (
    <div className="container">
      <h1>Inventario de Equipos en Rack</h1>
      <form id="equipment-form" onSubmit={handleSubmit}>
        <label htmlFor="initial-ur">UR Inicial:</label>
        <input
          type="number"
          id="initial-ur"
          value={initialUr}
          onChange={(e) => setInitialUr(e.target.value)}
          placeholder="Ingrese la UR inicial"
          required
        />
        <label htmlFor="total-ur">Total UR:</label>
        <input
          type="number"
          id="total-ur"
          value={totalUr}
          onChange={(e) => setTotalUr(e.target.value)}
          placeholder="Ingrese el total de UR"
          required
        />
        <label htmlFor="equipment-name">Nombre del Equipo:</label>
        <input
          type="text"
          id="equipment-name"
          value={equipmentName}
          onChange={(e) => setEquipmentName(e.target.value)}
          placeholder="Ingrese el nombre del equipo"
        />
        <button type="submit">Añadir Equipo</button>
        <button type="button" onClick={handleDelete}>Borrar Equipo</button>
      </form>
      <div id="rack-container" className="rack-container">
        {[...Array(45)].map((_, i) => (
          <div key={i} className="rack-unit" data-index={45 - i}>
            {45 - i}
          </div>
        ))}
        {borders.map((border, index) => (
          <div
            key={index}
            className="border-box"
            style={{
              top: `${(45 - border.endBottom) * 20}px`,
              height: `${(border.endBottom - border.startTop + 1) * 20}px`,
            }}
          >
            <div className="equipment-name">{border.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

