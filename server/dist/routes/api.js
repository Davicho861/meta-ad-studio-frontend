"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/data', (req, res) => {
    res.json({ message: 'Success', data: [1, 2, 3] });
});
exports.default = router;
