import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  MapPin,
  Layers,
  Weight,
  AlertTriangle,
  Info,
  Package,
  Building,
  CheckCircle2
} from 'lucide-react';

export const AlmacenUbicacionesView = () => {
  const { locations, products } = useInventory();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedZone, setSelectedZone] = useState('ALL');

  const zones = ['ALL', 'ZONA-A', 'ZONA-B', 'ZONA-C', 'ZONA-D', 'ZONA-E'];

  const filteredLocations = selectedZone === 'ALL'
    ? locations
    : locations.filter(l => l.zona === selectedZone);

  const getProductsInLocation = (locId) => {
    return products.filter(p => p.ubicacionId === locId && p.activo);
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado del Módulo */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-martin-green-700 bg-martin-green-50 px-2.5 py-0.5 rounded-full border border-martin-green-200">
              RF-12: Mapa Topográfico de Almacén
            </span>
            <span className="text-xs text-slate-500 font-medium">Distribución Física y Carga Estructural</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Ubicación de Mercadería en Patio y Racks
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de tableros de melamina (2.15x2.44m), drywall y pisos clasificados por Zona, Pasillo, Rack y Nivel.
          </p>
        </div>

        {/* Selector de Zona */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 px-2 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-martin-green-600" /> Filtrar Zona:
          </span>
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="text-xs font-bold bg-white text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
          >
            {zones.map(z => (
              <option key={z} value={z}>{z === 'ALL' ? 'Todas las Zonas' : z}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Interactivo 2D de Racks y Bahías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map(loc => {
          const prods = getProductsInLocation(loc.id);
          const totalWeight = prods.reduce((sum, p) => sum + (p.stockActual * p.pesoUnitarioKg), 0);
          const percentCapacity = Math.min(100, Math.round((totalWeight / loc.capacidadCargaKg) * 100));
          const isOverloaded = totalWeight > loc.capacidadCargaKg;
          const isSelected = selectedLocation?.id === loc.id;

          return (
            <div
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-xs ${
                isSelected
                  ? 'border-martin-green-500 shadow-md ring-2 ring-martin-green-500/20'
                  : 'border-slate-200 hover:border-martin-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-martin-green-50 text-martin-green-800 border border-martin-green-200">
                  {loc.codigo}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {loc.zona} • Pasillo {loc.pasillo}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Rack / Nivel:</span>
                  <span className="font-bold text-slate-800">{loc.rack} • Nivel {loc.nivel}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Artículos Alojadados:</span>
                  <span className="font-black text-slate-900">{prods.length} productos</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Carga Estructural:</span>
                  <span className={`font-bold font-mono ${isOverloaded ? 'text-red-600' : 'text-slate-800'}`}>
                    {totalWeight.toLocaleString()} / {loc.capacidadCargaKg.toLocaleString()} kg
                  </span>
                </div>

                {/* Barra de Capacidad */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverloaded
                        ? 'bg-red-500'
                        : percentCapacity > 80
                        ? 'bg-martin-orange-500'
                        : 'bg-martin-green-500'
                    }`}
                    style={{ width: `${percentCapacity}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalle de Artículos en Ubicación Seleccionada */}
      {selectedLocation && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Detalle de Ubicación: <span className="text-martin-green-700 font-mono">{selectedLocation.codigo}</span>
              </h3>
              <p className="text-xs text-slate-500">{selectedLocation.descripcion} ({selectedLocation.zona})</p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cerrar Detalle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <th className="py-2 px-3">SKU</th>
                  <th className="py-2 px-3">Artículo</th>
                  <th className="py-2 px-3 text-center">Stock Actual</th>
                  <th className="py-2 px-3 text-right">Peso Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getProductsInLocation(selectedLocation.id).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No hay artículos asignados actualmente a esta posición física.
                    </td>
                  </tr>
                ) : (
                  getProductsInLocation(selectedLocation.id).map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{p.sku}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{p.nombre}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-martin-green-700">
                        {p.stockActual} {p.unidadMedida}s
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {(p.stockActual * p.pesoUnitarioKg).toLocaleString()} kg
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
