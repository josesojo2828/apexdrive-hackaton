import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import DashboardService from '../../application/service/dashboard.service';
import AuditLogService from '../../application/service/audit-log.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
        private readonly auditLogService: AuditLogService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getStats(@Request() req: any, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
        return this.dashboardService.getStats(req.user, dateRange);
    }

    @UseGuards(JwtAuthGuard)
    @Get('activity')
    async getActivity(@Request() req: any, @Query('userId') userId?: string) {
        if (userId) {
            return this.auditLogService.getLogsByUser(userId);
        }

        const role = (req.user.role || "").toUpperCase();
        if (role.includes('ADMIN')) {
            return this.auditLogService.getRecentLogs(30);
        }

        return this.auditLogService.getLogsByUser(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('metrics')
    async getMetrics(@Request() req: any, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        const role = (req.user.role || "").toUpperCase();
        const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;

        // Parallel fetch for core metrics
        const [distribution, statuses, timeSeries] = await Promise.all([
            this.dashboardService.getTripDistribution(req.user, dateRange),
            this.dashboardService.getTripStatusDistribution(req.user, dateRange),
            this.dashboardService.getTimeSeriesData(req.user, dateRange)
        ]);

        let extraAdminData = {};
        if (role.includes('ADMIN')) {
            const [businessSessions, driverSessions, topDrivers, topBusinesses] = await Promise.all([
                this.dashboardService.getRecentSessions(5, 'BUSINESS'),
                this.dashboardService.getRecentSessions(5, 'DRIVER'),
                this.dashboardService.getTopPerformers(),
                this.dashboardService.getTopPerformers()
            ]);

            extraAdminData = {
                businessSessions,
                driverSessions,
                topDrivers,
                topBusinesses
            };
        }

        return {
            distribution,
            statuses,
            timeSeries,
            ...extraAdminData
        };
    }
}
