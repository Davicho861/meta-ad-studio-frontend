"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
const vitest_mock_extended_1 = require("vitest-mock-extended");
const vitest_1 = require("vitest");
vitest_1.vi.mock('./prisma', () => ({
    __esModule: true,
    prisma: (0, vitest_mock_extended_1.mockDeep)(),
}));
const prisma_1 = require("./prisma");
(0, vitest_1.beforeEach)(() => {
    (0, vitest_mock_extended_1.mockReset)(exports.prismaMock);
});
exports.prismaMock = prisma_1.prisma;
