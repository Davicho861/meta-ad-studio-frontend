"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
const jest_mock_extended_1 = require("jest-mock-extended");
const prisma_1 = require("./prisma");
jest.mock('./prisma', () => ({
    __esModule: true,
    prisma: (0, jest_mock_extended_1.mockDeep)(),
}));
beforeEach(() => {
    (0, jest_mock_extended_1.mockReset)(exports.prismaMock);
});
exports.prismaMock = prisma_1.prisma;
