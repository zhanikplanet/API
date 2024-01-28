const http = require('http');
const express = require('express');
const cors = require('cors'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = require('./swagger-config'); 

const app = express();
const server = http.createServer(app);


app.use(cors());


app.use(express.static(__dirname));

//it's to launch already in html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//swagger of my endpoints but it's broken so i decide to create endpoint without swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//it's for my api url
const sampleRoutes = require('./route/sample');
app.use('/api', sampleRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
