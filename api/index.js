try {
  const mod = require('../dist/app.js');
  const app = mod.default || mod;

  module.exports = (req, res) =>
    new Promise((resolve, reject) => {
      try {
        app(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
} catch (err) {
  // si falló la require (p.ej. aún no compilado), exportamos un handler que devuelve 500
  module.exports = (_req, res) =>
    res.status(500).json({ message: 'Server not built. Run npm run build' });
}