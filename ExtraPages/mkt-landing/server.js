const express = require("express");
const app = express();
const port = 3000;

// Servir archivos estáticos (HTML, CSS, JS, imágenes) desde la carpeta actual
app.use(express.static(__dirname));

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log("Accede desde otro dispositivo con: http://172.18.27.177:3000");
});
