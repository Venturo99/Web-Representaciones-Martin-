import express from 'express';
import cors from 'cors';
import sql from 'mssql';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  server: '127.0.0.1',
  port: 1434,
  user: 'martin_user',
  password: 'Martin2026!',
  database: 'RepresentacionesMartinDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }
  return pool;
}

// Endpoint de verificación de estado de conexión a SQL Server
app.get('/api/status', async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query(`
      SELECT 
        DB_NAME() AS DatabaseName,
        @@VERSION AS SqlVersion,
        (SELECT COUNT(*) FROM Productos WHERE Activo = 1) AS TotalProductos,
        (SELECT COUNT(*) FROM Kardex) AS TotalKardex,
        (SELECT COUNT(*) FROM MovimientosInventario) AS TotalMovimientos,
        (SELECT COUNT(*) FROM vw_AlertasReabastecimiento) AS TotalAlertas
    `);

    res.json({
      connected: true,
      message: 'Conectado exitosamente a SQL Server (SSMS)',
      data: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      message: 'Error al conectar con SQL Server',
      error: error.message
    });
  }
});

// Endpoint para consultar productos desde SQL Server
app.get('/api/productos', async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query('SELECT * FROM Productos WHERE Activo = 1 ORDER BY IdProducto;');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para consultar alertas de reabastecimiento en vivo
app.get('/api/alertas', async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query('SELECT * FROM vw_AlertasReabastecimiento;');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para consultar Kardex desde SQL Server
app.get('/api/kardex', async (req, res) => {
  try {
    const p = await getPool();
    const result = await p.request().query('SELECT * FROM Kardex ORDER BY IdKardex DESC;');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API de Base de Datos ejecutándose en http://localhost:${PORT}`);
  console.log(`🔗 Verificando conexión con RepresentacionesMartinDB...`);
});
