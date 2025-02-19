const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./public/user');
const app = express();
const axios = require('axios');
// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Conexión a MongoDB
const mongo_uri = 'mongodb://mongo:27017/todos'; // Usa el nombre del servicio definido en docker-compose.yml
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Ruta de autenticación (inicio de sesión)
app.post('/authenticate', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const usuario = await User.findOne({ username });

    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    console.log("Contraseña ingresada:", password);
    console.log("Contraseña almacenada:", usuario.password);
    // Comparar la contraseña ingresada con la almacenada (sin re-hashear)
    const match = await bcrypt.compare(password, usuario.password);

    if (!match) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Autenticación exitosa' });

  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta de registro
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }
  console.log(password)
  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: password });

  try {
    await user.save();
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});


// Iniciar servidor en el puerto 3000
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en puerto 3000');
});
// API para Wordle
app.get('/api/random-word', async (req, res) => {
  try {
    const wordCount = await Word.countDocuments();  // Contamos cuántas palabras hay en la base de datos
    const randomIndex = Math.floor(Math.random() * wordCount);  // Generamos un índice aleatorio
    const randomWord = await Word.findOne().skip(randomIndex);  // Obtenemos la palabra aleatoria
    res.json({ word: randomWord.word });  // Respondemos con la palabra
  } catch (error) {
    console.error("Error en la API random-word:", error);
    res.status(500).json({ message: 'Error al obtener la palabra aleatoria' });
  }
});


module.exports = app;
