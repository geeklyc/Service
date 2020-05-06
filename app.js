const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production';

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// static file support:
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// add controller:
app.use(controller());

module.exports = app;

// const WebSocket = require('ws');

// const WebSocketServer = WebSocket.Server;

// const wss = new WebSocketServer({
//     port: 3000
// });

// wss.on('connection', function (ws) {
//     console.log(`[SERVER] connection()`);
//     ws.on('message', function (message) {
//         console.log(`[SERVER] Received: ${message}`);
//         setTimeout(() => {
//             ws.send(`What's your name?`, (err) => {
//                 if (err) {
//                     console.log(`[SERVER] error: ${err}`);
//                 }
//             });
//         }, 1000);
//     })
// });

// console.log('ws server started at port 3000...');

// // client test:

// let count = 0;

// let ws = new WebSocket('ws://localhost:3000/ws/chat');

// ws.on('open', function () {
//     console.log(`[CLIENT] open()`);
//     ws.send('Hello!');
// });

// ws.on('message', function (message) {
//     console.log(`[CLIENT] Received: ${message}`);
//     count++;
//     if (count > 3) {
//         ws.send('Goodbye!');
//         ws.close();
//     } else {
//         setTimeout(() => {
//             ws.send(`Hello, I'm Mr No.${count}!`);
//         }, 1000);
//     }
// })