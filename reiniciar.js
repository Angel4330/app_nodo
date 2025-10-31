// reset_db.js
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
let db = new sqlite3.Database("./base.sqlite3", (err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err.message);
    return;
  }
  console.log("✅ Conectado a la base de datos SQLite.");

  // Ejecutar la consulta para eliminar la tabla
  db.run("DROP TABLE IF EXISTS tareas;", (err) => {
    if (err) {
      console.error("❌ Error al eliminar la tabla:", err.message);
    } else {
      console.log("✅ Tabla 'tareas' eliminada correctamente.");
    }

    // Cerrar conexión
    db.close((err) => {
      if (err) {
        console.error("❌ Error al cerrar la base de datos:", err.message);
      } else {
        console.log("🔒 Conexión cerrada.");
      }
    });
  });
});
