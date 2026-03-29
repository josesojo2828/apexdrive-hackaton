

export default class AuditLogModel {
    public static model = 'auditLog';

    public static permits = {
        list: 'audit_log_list',
        read: 'audit_log_read',
        create: 'audit_log_create',
    };

    public permits = AuditLogModel.permits;
}
