import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Zap,
  ArrowLeftRight,
  BookOpen,
  Sliders,
  Truck,
  TrendingUp,
  FileText,
  Clock,
  Users,
  ShieldAlert,
  Lock
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  const rol = currentUser?.rolNombre || 'Administrador';

  // Configuración de elementos de menú con permisos según RBAC (RF-03, RF-04)
  // NOTA: Se ha retirado la pestaña de 'Base de Datos SSMS' conforme al requerimiento de diseño limpio
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Ejecutivo',
      icon: LayoutDashboard,
      roles: ['Administrador', 'Gerencia', 'Encargado de Almacén'],
      badge: 'RF-14'
    },
    {
      id: 'catalogo',
      label: 'Catálogo de Productos',
      icon: Package,
      roles: ['Administrador', 'Gerencia', 'Encargado de Almacén'],
      badge: 'RF-05..08'
    },
    {
      id: 'almacen',
      label: 'Ubicaciones y Racks 2D',
      icon: MapPin,
      roles: ['Administrador', 'Gerencia', 'Encargado de Almacén'],
      badge: 'RF-12'
    },
    {
      id: 'quickstock',
      label: 'Consulta Rápida Stock',
      icon: Zap,
      roles: ['Administrador', 'Encargado de Almacén'],
      badge: 'RF-18'
    },
    {
      id: 'movimientos',
      label: 'Historial Movimientos',
      icon: ArrowLeftRight,
      roles: ['Administrador', 'Gerencia', 'Encargado de Almacén'],
      badge: 'RF-16'
    },
    {
      id: 'kardex',
      label: 'Kardex Histórico',
      icon: BookOpen,
      roles: ['Administrador', 'Gerencia', 'Encargado de Almacén'],
      badge: 'RF-17'
    },
    {
      id: 'ajustes',
      label: 'Ajustes y Mermas',
      icon: Sliders,
      roles: ['Administrador', 'Encargado de Almacén'],
      badge: 'RF-20'
    },
    {
      id: 'ordenes',
      label: 'Proveedores y Compras',
      icon: Truck,
      roles: ['Administrador', 'Gerencia', 'Encargado de Almacén'],
      badge: 'RF-13'
    },
    {
      id: 'rotacion',
      label: 'Rotación ABC Demanda',
      icon: TrendingUp,
      roles: ['Administrador', 'Gerencia'],
      badge: 'RF-15'
    },
    {
      id: 'reportes',
      label: 'Reportes y Valorizado',
      icon: FileText,
      roles: ['Administrador', 'Gerencia'],
      badge: 'RF-11'
    },
    {
      id: 'cierre',
      label: 'Cierre Diario',
      icon: Clock,
      roles: ['Administrador', 'Gerencia', 'Encargado de Almacén'],
      badge: 'RF-19'
    },
    {
      id: 'usuarios',
      label: 'Usuarios y Accesos',
      icon: Users,
      roles: ['Administrador'],
      badge: 'RF-01/21'
    },
    {
      id: 'auditoria',
      label: 'Bitácora Auditoría',
      icon: ShieldAlert,
      roles: ['Administrador', 'Gerencia'],
      badge: 'RF-22'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 shadow-xs min-h-[calc(100vh-4rem)]">
      {/* Lista de Navegación */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 py-1 mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Módulos del Sistema
          </p>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isAllowed = item.roles.includes(rol);
          const isActive = activeTab === item.id;

          if (!isAllowed) {
            return (
              <div
                key={item.id}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 rounded-xl opacity-40 cursor-not-allowed bg-slate-50"
                title={`Restringido para rol: ${rol} (RF-04)`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                <Lock className="w-3 h-3 text-slate-400" />
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-martin-green-500 text-white shadow-sm shadow-martin-green-900/10'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-martin-orange-50 text-martin-orange-700 border border-martin-orange-200/50'
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer del Sidebar con info de RBAC */}
      <div className="p-3 m-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-[11px]">
        <div className="flex items-center space-x-1.5 font-bold text-martin-green-700 mb-1">
          <span className="w-2 h-2 rounded-full bg-martin-green-500 animate-pulse"></span>
          <span>Sesión Activa</span>
        </div>
        <p className="text-slate-900 font-bold truncate">{currentUser?.nombres}</p>
        <p className="text-slate-500 text-[10px]">Rol: <span className="text-martin-orange-700 font-bold">{currentUser?.rolNombre}</span></p>
        <p className="text-[10px] text-slate-400 mt-1.5 border-t border-slate-200 pt-1.5">
          Control RBAC (RF-03/04)
        </p>
      </div>
    </aside>
  );
};
