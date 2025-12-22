import express from 'express';
import { config } from './config';
import { initDb } from './config/db';
// import userRoute from './modules/users/user.route';
import { vehicleRoute } from './modules/vehicles/vehicle.route';
import { bookRoute } from './modules/bookings/book.route';
import { authRoute } from './modules/auth/auth.route';
import { userRoute } from './modules/users/user.route';

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


app.use('/api/v1/auth', authRoute);

app.use('/api/v1/users', userRoute);
app.use(`/api/v1/vehicles`, vehicleRoute)
app.use(`/api/v1/bookings`, bookRoute)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});