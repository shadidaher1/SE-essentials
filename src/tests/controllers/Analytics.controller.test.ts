import { Request, Response } from "express";
import { AnalyticsController } from "../../controllers/analytics.controller";
import { AnalyticsService } from "../../services/Analytics.service";
import { ItemCategory } from "../../Model/IItem";

// Type for mocked methods
type MockedAnalyticsService = {
    getTotalOrderCount: jest.Mock;
    getOrderCountByType: jest.Mock;
    getTotalRevenue: jest.Mock;
    getRevenueByType: jest.Mock;
};

describe("AnalyticsController", () => {
    let analyticsController: AnalyticsController;
    let mockAnalyticsService: MockedAnalyticsService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        // Create a mock service
        mockAnalyticsService = {
            getTotalOrderCount: jest.fn(),
            getOrderCountByType: jest.fn(),
            getTotalRevenue: jest.fn(),
            getRevenueByType: jest.fn(),
        };

        // Create controller instance with mocked service
        analyticsController = new AnalyticsController(mockAnalyticsService as unknown as AnalyticsService);

        // Setup mock request and response
        mockRequest = {
            params: {},
            query: {},
            body: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe("getTotalOrderCount", () => {
        it("should return total order count successfully", async () => {
            const totalCount = 100;
            mockAnalyticsService.getTotalOrderCount.mockResolvedValue(totalCount);

            await analyticsController.getTotalOrderCount(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockAnalyticsService.getTotalOrderCount).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Total order count retrieved successfully",
                data: {
                    totalCount: totalCount,
                },
            });
        });

        it("should return zero when there are no orders", async () => {
            mockAnalyticsService.getTotalOrderCount.mockResolvedValue(0);

            await analyticsController.getTotalOrderCount(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Total order count retrieved successfully",
                data: {
                    totalCount: 0,
                },
            });
        });

        it("should handle service errors", async () => {
            const error = new Error("Database connection failed");
            mockAnalyticsService.getTotalOrderCount.mockRejectedValue(error);

            await expect(
                analyticsController.getTotalOrderCount(
                    mockRequest as Request,
                    mockResponse as Response
                )
            ).rejects.toThrow("Database connection failed");

            expect(mockAnalyticsService.getTotalOrderCount).toHaveBeenCalledTimes(1);
        });
    });

    describe("getOrderCountByType", () => {
        it("should return order counts grouped by type successfully", async () => {
            const orderCounts = {
                [ItemCategory.CAKE]: 25,
                [ItemCategory.BOOK]: 40,
                [ItemCategory.TOY]: 35,
            };
            mockAnalyticsService.getOrderCountByType.mockResolvedValue(orderCounts);

            await analyticsController.getOrderCountByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockAnalyticsService.getOrderCountByType).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Order counts by type retrieved successfully",
                data: {
                    counts: orderCounts,
                },
            });
        });

        it("should return zero counts when there are no orders", async () => {
            const orderCounts = {
                [ItemCategory.CAKE]: 0,
                [ItemCategory.BOOK]: 0,
                [ItemCategory.TOY]: 0,
            };
            mockAnalyticsService.getOrderCountByType.mockResolvedValue(orderCounts);

            await analyticsController.getOrderCountByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Order counts by type retrieved successfully",
                data: {
                    counts: orderCounts,
                },
            });
        });

        it("should return different counts for different categories", async () => {
            const orderCounts = {
                [ItemCategory.CAKE]: 100,
                [ItemCategory.BOOK]: 50,
                [ItemCategory.TOY]: 75,
            };
            mockAnalyticsService.getOrderCountByType.mockResolvedValue(orderCounts);

            await analyticsController.getOrderCountByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Order counts by type retrieved successfully",
                data: {
                    counts: orderCounts,
                },
            });
        });

        it("should handle service errors", async () => {
            const error = new Error("Failed to retrieve category data");
            mockAnalyticsService.getOrderCountByType.mockRejectedValue(error);

            await expect(
                analyticsController.getOrderCountByType(
                    mockRequest as Request,
                    mockResponse as Response
                )
            ).rejects.toThrow("Failed to retrieve category data");
        });
    });

    describe("getTotalRevenue", () => {
        it("should return total revenue successfully", async () => {
            const totalRevenue = 5000.75;
            mockAnalyticsService.getTotalRevenue.mockResolvedValue(totalRevenue);

            await analyticsController.getTotalRevenue(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockAnalyticsService.getTotalRevenue).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Total revenue retrieved successfully",
                data: {
                    totalRevenue: totalRevenue,
                },
            });
        });

        it("should return zero when there are no orders", async () => {
            mockAnalyticsService.getTotalRevenue.mockResolvedValue(0);

            await analyticsController.getTotalRevenue(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Total revenue retrieved successfully",
                data: {
                    totalRevenue: 0,
                },
            });
        });

        it("should handle floating point revenues", async () => {
            const totalRevenue = 12345.67;
            mockAnalyticsService.getTotalRevenue.mockResolvedValue(totalRevenue);

            await analyticsController.getTotalRevenue(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Total revenue retrieved successfully",
                data: {
                    totalRevenue: totalRevenue,
                },
            });
        });

        it("should handle service errors", async () => {
            const error = new Error("Failed to calculate revenue");
            mockAnalyticsService.getTotalRevenue.mockRejectedValue(error);

            await expect(
                analyticsController.getTotalRevenue(
                    mockRequest as Request,
                    mockResponse as Response
                )
            ).rejects.toThrow("Failed to calculate revenue");
        });
    });

    describe("getRevenueByType", () => {
        it("should return revenue breakdown by type successfully", async () => {
            const revenueByType = {
                [ItemCategory.CAKE]: 1500.50,
                [ItemCategory.BOOK]: 2000.25,
                [ItemCategory.TOY]: 1500.00,
            };
            mockAnalyticsService.getRevenueByType.mockResolvedValue(revenueByType);

            await analyticsController.getRevenueByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockAnalyticsService.getRevenueByType).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Revenue by type retrieved successfully",
                data: {
                    revenue: revenueByType,
                },
            });
        });

        it("should return zero revenue when there are no orders", async () => {
            const revenueByType = {
                [ItemCategory.CAKE]: 0,
                [ItemCategory.BOOK]: 0,
                [ItemCategory.TOY]: 0,
            };
            mockAnalyticsService.getRevenueByType.mockResolvedValue(revenueByType);

            await analyticsController.getRevenueByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Revenue by type retrieved successfully",
                data: {
                    revenue: revenueByType,
                },
            });
        });

        it("should return different revenues for different categories", async () => {
            const revenueByType = {
                [ItemCategory.CAKE]: 5000.00,
                [ItemCategory.BOOK]: 3000.50,
                [ItemCategory.TOY]: 2500.25,
            };
            mockAnalyticsService.getRevenueByType.mockResolvedValue(revenueByType);

            await analyticsController.getRevenueByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Revenue by type retrieved successfully",
                data: {
                    revenue: revenueByType,
                },
            });
        });

        it("should handle service errors", async () => {
            const error = new Error("Failed to retrieve revenue data");
            mockAnalyticsService.getRevenueByType.mockRejectedValue(error);

            await expect(
                analyticsController.getRevenueByType(
                    mockRequest as Request,
                    mockResponse as Response
                )
            ).rejects.toThrow("Failed to retrieve revenue data");
        });

        it("should handle extreme values", async () => {
            const revenueByType = {
                [ItemCategory.CAKE]: 999999999.99,
                [ItemCategory.BOOK]: 0.01,
                [ItemCategory.TOY]: 500000.50,
            };
            mockAnalyticsService.getRevenueByType.mockResolvedValue(revenueByType);

            await analyticsController.getRevenueByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Revenue by type retrieved successfully",
                data: {
                    revenue: revenueByType,
                },
            });
        });
    });

    describe("Service integration", () => {
        it("should call all service methods independently", async () => {
            mockAnalyticsService.getTotalOrderCount.mockResolvedValue(100);
            mockAnalyticsService.getOrderCountByType.mockResolvedValue({
                [ItemCategory.CAKE]: 25,
                [ItemCategory.BOOK]: 40,
                [ItemCategory.TOY]: 35,
            });
            mockAnalyticsService.getTotalRevenue.mockResolvedValue(5000);
            mockAnalyticsService.getRevenueByType.mockResolvedValue({
                [ItemCategory.CAKE]: 1500,
                [ItemCategory.BOOK]: 2000,
                [ItemCategory.TOY]: 1500,
            });

            await analyticsController.getTotalOrderCount(
                mockRequest as Request,
                mockResponse as Response
            );
            await analyticsController.getOrderCountByType(
                mockRequest as Request,
                mockResponse as Response
            );
            await analyticsController.getTotalRevenue(
                mockRequest as Request,
                mockResponse as Response
            );
            await analyticsController.getRevenueByType(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockAnalyticsService.getTotalOrderCount).toHaveBeenCalledTimes(1);
            expect(mockAnalyticsService.getOrderCountByType).toHaveBeenCalledTimes(1);
            expect(mockAnalyticsService.getTotalRevenue).toHaveBeenCalledTimes(1);
            expect(mockAnalyticsService.getRevenueByType).toHaveBeenCalledTimes(1);
        });
    });
});
