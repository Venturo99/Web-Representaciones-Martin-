import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_ROLES } from '../data/initialData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('martin_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      console.warn('Error leyendo martin_users de localStorage, usando INITIAL_USERS', e);
      return INITIAL_USERS;
    }
  });

  // Usuario actualmente autenticado (por defecto Administrador para facilitar la evaluación)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('martin_current_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      return INITIAL_USERS[0];
    } catch (e) {
      console.warn('Error leyendo martin_current_user, usando INITIAL_USERS[0]', e);
      return INITIAL_USERS[0];
    }
  });

  const [roles] = useState(INITIAL_ROLES);

  // Almacén de tokens temporales de recuperación de contraseña (RF-02)
  const [resetTokens, setResetTokens] = useState(() => {
    try {
      const saved = localStorage.getItem('martin_reset_tokens');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('martin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('martin_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('martin_reset_tokens', JSON.stringify(resetTokens));
  }, [resetTokens]);

  // Cambiar de rol o usuario activo rápidamente para demostración RBAC (RF-03, RF-04)
  const switchUser = (userId) => {
    const target = users.find(u => u.id === Number(userId));
    if (target) {
      if (!target.activo) {
        alert('Este usuario se encuentra INACTIVO (Baja lógica). No puede iniciar sesión.');
        return false;
      }
      setCurrentUser(target);
      return true;
    }
    return false;
  };

  // RF-01: Registro y Creación de Usuarios con generación automática de credenciales
  const registerUser = (userData) => {
    // Generar contraseña aleatoria temporal
    const autoPassword = 'Mrt-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '!';
    const roleObj = roles.find(r => r.id === Number(userData.rolId)) || roles[2];

    const newUser = {
      id: Date.now(),
      rolId: roleObj.id,
      rolNombre: roleObj.nombre,
      nombres: userData.nombres.trim(),
      apellidos: userData.apellidos.trim(),
      correo: userData.correo.trim().toLowerCase(),
      telefono: userData.telefono.trim(),
      direccion: userData.direccion?.trim() || 'No especificada',
      activo: true,
      credencialTemporal: autoPassword,
      fechaRegistro: new Date().toISOString(),
      ultimoAcceso: null
    };

    setUsers(prev => [newUser, ...prev]);
    return { success: true, user: newUser, temporaryPassword: autoPassword };
  };

  // RF-21: Inactivación y baja lógica de usuarios
  const toggleUserStatus = (userId, motivoBaja = '') => {
    if (currentUser.id === userId) {
      alert('No puedes inactivar tu propia cuenta activa de administrador.');
      return false;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.activo;
        return {
          ...u,
          activo: nextStatus,
          motivoBaja: nextStatus ? null : (motivoBaja || 'Baja administrativa por jefatura'),
          fechaBaja: nextStatus ? null : new Date().toISOString()
        };
      }
      return u;
    }));
    return true;
  };

  // RF-02: Recuperación y Restablecimiento de Cuenta mediante Token
  const requestPasswordReset = (correo) => {
    const user = users.find(u => u.correo.toLowerCase() === correo.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'El correo electrónico no se encuentra registrado en el sistema.' };
    }
    if (!user.activo) {
      return { success: false, message: 'La cuenta se encuentra inactiva. Contacte al Administrador.' };
    }

    // Generar token seguro temporal válido por 30 minutos
    const token = 'RST-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const resetRecord = {
      id: Date.now(),
      usuarioId: user.id,
      correo: user.correo,
      token,
      expiracion: expiry,
      usado: false,
      creado: new Date().toISOString()
    };

    setResetTokens(prev => [resetRecord, ...prev]);
    return {
      success: true,
      message: `Enlace de recuperación generado con éxito. En un entorno productivo se envía por correo SMTP a ${user.correo}.`,
      token,
      expiry
    };
  };

  const confirmPasswordReset = (token, newPassword) => {
    const record = resetTokens.find(r => r.token === token && !r.usado);
    if (!record) {
      return { success: false, message: 'El token de seguridad es inválido o ya fue utilizado.' };
    }
    if (new Date() > new Date(record.expiracion)) {
      return { success: false, message: 'El token de seguridad ha expirado. Solicite uno nuevo.' };
    }

    // Marcar token como usado
    setResetTokens(prev => prev.map(r => r.token === token ? { ...r, usado: true, usadoEn: new Date().toISOString() } : r));

    return {
      success: true,
      message: 'Contraseña restablecida exitosamente. Ya puede iniciar sesión con su nueva clave.'
    };
  };

  // Helper de permisos según RBAC (RF-03, RF-04)
  const canAccess = (requiredRole) => {
    if (!currentUser) return false;
    if (currentUser.rolNombre === 'Administrador') return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(currentUser.rolNombre);
    }
    return currentUser.rolNombre === requiredRole;
  };

  const isAdmin = currentUser?.rolNombre === 'Administrador';
  const isGerencia = currentUser?.rolNombre === 'Gerencia';
  const isAlmacenero = currentUser?.rolNombre === 'Encargado de Almacén';

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      roles,
      switchUser,
      registerUser,
      toggleUserStatus,
      requestPasswordReset,
      confirmPasswordReset,
      canAccess,
      isAdmin,
      isGerencia,
      isAlmacenero
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
