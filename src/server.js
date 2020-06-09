import './config/env';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import session from 'express-session';
import morgan from 'morgan';
import moment from 'moment-timezone';
import routes from './routes';
import hcRoute from './routes/healthCheckRoute'
import json from './middlewares/json';
import * as log from './utils/logger';
import * as tracker from './utils/tracer'
import * as errorHandler from './middlewares/errorHandler';
import authorize from './middlewares/authorization';
import * as tracer from './utils/tracer';
import swStats from 'swagger-stats';
import swaggerSpec from './utils/swagger';
import path from 'path';




const app = express();
const APP_PORT =process.env.APP_PORT;
const APP_HOST =  process.env.APP_HOST;
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();


app.set('port', APP_PORT);
app.set('host', APP_HOST);
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(errorHandler.bodyParser);
app.use(json);
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));



// Handle pre-flight request with CORS
app.options("*",function(req,res,next){
 corsOptions(res);
 res.statusCode = 200;
 res.setHeader('Content_length','0');
 res.end();
})
tracer.init();
// API Routes
 app.use('/api',authorize,routes);

// Health Check
 app.use('/health',hcRoute);

 // Swagger UI
 // Workaround for changing the default URL in swagger.json
 // https://github.com/swagger-api/swagger-ui/issues/4624
 const swaggerIndexContent = fs
  .readFileSync(`${pathToSwaggerUi}/index.html`)
   .toString()
   .replace('https://petstore.swagger.io/v2/swagger.json', '/api/swagger.json');

app.get('/api-docs/index.html', (req, res) => res.send(swaggerIndexContent));
app.get('/api-docs', (req, res) => res.redirect('/api-docs/index.html'));
app.use('/api-docs', express.static(pathToSwaggerUi));

app.use(swStats.getMiddleware({swaggerSpec:swaggerSpec}));

app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));

// Combines logging info from request and response
app.use(morgan('combined'));


app.get('/codeCoverage', function (req, res) {
  res.sendFile(path.resolve( `${__dirname}/../coverage/index.html`));
});


// Test Report
app.use(express.static('testReport'));
app.get('/testReport', function (req, res) {
  res.sendFile(path.resolve( `${__dirname}/../testReport/report.html`));
});

// Error Middlewares
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

if(process.env.NODE_ENV===undefined)
{
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}


// Initialize the tracer
tracker.init();

app.listen(app.get('port'), app.get('host'), () => {
  log.info(`Server started at http://${app.get('host')}:${app.get('port')}/api`);
});

// Catch unhandled rejections
process.on('unhandledRejection', err => {
  log.error('Unhandled rejection', err);
});

// Catch uncaught exceptions
process.on('uncaughtException', err => {
  log.error('Uncaught exception', err);
});

tracer.init();

export default app;
