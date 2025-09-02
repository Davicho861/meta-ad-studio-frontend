"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brandProfileController_1 = require("../controllers/brandProfileController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.route('/')
    .get(auth_1.authMiddleware, brandProfileController_1.getBrandProfile)
    .post(auth_1.authMiddleware, brandProfileController_1.upsertBrandProfile);
exports.default = router;
