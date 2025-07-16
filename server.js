require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/App');

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port http://localhost:${process.env.PORT || 5000}`);
    });
}).catch((err) => console.error('DB connection error:', err));