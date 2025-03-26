require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(express.json());

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Project Management API',
    endpoints: {
      projects: '/api/projects',
      tasks: '/api/tasks',
      documentation: '/api-docs'
    }
  });
});

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
    
    // Initialize sample data
    await initializeData();
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
}

// Sample data initialization
async function initializeData() {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      // Create sample projects
      const project1 = await Project.create({
        name: "Website Redesign",
        description: "Complete website overhaul",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30*24*60*60*1000),
        status: "in-progress",
        budget: 15000,
        client: "Acme Corp"
      });

      // Create sample tasks
      await Task.create([
        {
          title: "Design Homepage",
          description: "Create new layout",
          dueDate: new Date(Date.now() + 7*24*60*60*1000),
          priority: "high",
          project: project1._id,
          assignedTo: "design@example.com"
        },
        {
          title: "Implement API",
          description: "Build backend endpoints",
          dueDate: new Date(Date.now() + 14*24*60*60*1000),
          priority: "medium",
          project: project1._id,
          assignedTo: "dev@example.com"
        }
      ]);
      
      console.log('Sample data initialized');
    }
  } catch (err) {
    console.error('Data initialization error:', err);
  }
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server,
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Try these endpoints:`);
    console.log(`http://localhost:${PORT}/api/projects`);
    console.log(`http://localhost:${PORT}/api/tasks`);
  });
});