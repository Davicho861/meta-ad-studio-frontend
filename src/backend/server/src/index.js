"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const api_1 = __importDefault(require("./routes/api"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
prom_client_1.default.register.clear(); // Clear registry before collecting metrics
collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(await prom_client_1.default.register.metrics());
});
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api', api_1.default);
const port = process.env.PORT || 3001;
let server = null;
exports.server = server;
// Only start listening when not running in test environment. This prevents EADDRINUSE
// when tests import the app and start their own server instance.
if (process.env.NODE_ENV !== 'test') {
    exports.server = server = app.listen(port, () => {
        /* CODemod: console.log(`Server is running on port ${port}`); */
    });
}
