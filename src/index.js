const express = require('express');
const path = require('path');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*https://flight-booking-system-frontend-rgvv.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Flight booking service is running',
        apiHealth: '/api/v1/info'
    });
});

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`successfully started the server on 
        port : ${ServerConfig.PORT}`);
}); 
