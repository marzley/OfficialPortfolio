<?php

/*
 | Default role -> permission map. '*' grants everything within the role's scope.
 | Tenant-level overrides are a planned later phase (stored per tenant).
 */
return [
    'platform_roles' => ['platform_super_admin', 'platform_support_admin', 'platform_finance_admin', 'platform_auditor'],

    'roles' => [
        'platform_super_admin'   => ['platform.tenants.manage', 'platform.plans.manage', 'platform.audit.view'],
        'platform_support_admin' => ['platform.tenants.view'],
        'platform_finance_admin' => ['platform.tenants.view', 'platform.plans.manage'],
        'platform_auditor'       => ['platform.tenants.view', 'platform.audit.view'],

        'isp_owner'          => ['*'],
        'isp_admin'          => ['customers.view', 'customers.manage', 'packages.manage', 'routers.manage', 'locations.view', 'locations.manage', 'staff.manage', 'reports.view', 'payments.record', 'audit.view'],
        'billing_manager'    => ['customers.view', 'packages.manage', 'payments.record', 'invoices.edit', 'refunds.issue', 'reports.view', 'locations.view'],
        'accountant'         => ['customers.view', 'payments.record', 'reports.view', 'reports.export', 'locations.view'],
        'network_admin'      => ['routers.manage', 'locations.view', 'locations.manage', 'customers.view'],
        'support_agent'      => ['customers.view', 'tickets.manage', 'locations.view'],
        'field_technician'   => ['tickets.manage', 'locations.view'],
        'read_only_staff'    => ['customers.view', 'locations.view', 'reports.view'],
    ],
];
