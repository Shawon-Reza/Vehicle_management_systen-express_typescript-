import express from 'express';
import { config } from './config';
import { initDb } from './config/db';
import userRoute from './modules/users/user.route';

const app = express();
const PORT = config.port;
app.use(express.json());

// Initialize database tables
initDb()

// Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200)
        .json({
            success: true,
            message: 'Vehicle Management System API is running..........'
        })
});

app.use('/api/users', userRoute);;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});