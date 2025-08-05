import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // <-- This should be cors()

// Root route
app.get('/', (req, res) => {
  res.json('Welcome to Pet Store');
});

// Dynamic route loading
const MODULES: string[] = ['auth', 'users'];

MODULES.forEach(async moduleName => {
  try {
    const module = await import(`./src/routes/${moduleName}`);
    module.default(app);
  } catch (error) {
    console.error(`Failed to load module ${moduleName}:`, error);
  }
});

// Start server
app.listen(3000, () => {
  console.log(`🚀 Server ready at: http://localhost:3000`);
});
