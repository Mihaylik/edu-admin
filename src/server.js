import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import subjectRoutes from './routes/subjects.js';
import courseRoutes from './routes/courses.js';
import groupsRoutes from './routes/groups.js';
import gradesRoutes from './routes/grades.js';
import schedulesRoutes from './routes/schedules.js';
import attendanceRoutes from './routes/attendance.js';
import { setupSwagger } from './swagger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/subjects', subjectRoutes);
app.use('/courses', courseRoutes);
app.use('/groups', groupsRoutes);
app.use('/grades', gradesRoutes);
app.use('/schedules', schedulesRoutes);
app.use('/attendances', attendanceRoutes);

// global extension handler
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: 'Internal server error',
  });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

setupSwagger(app);
