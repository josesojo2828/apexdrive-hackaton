import { TableColumn } from "@/types/user/dashboard";

export const ModuleColumns: Record<string, TableColumn[]> = {
    // --- USUARIO Y SESIONES ---
    'user': [
        { key: 'firstName', label: 'user.firstName', type: 'text', responsive: 'always', sortable: true },
        { key: 'lastName', label: 'user.lastName', type: 'text', responsive: 'always', sortable: true },
        { key: 'email', label: 'user.email', type: 'text', responsive: 'always' },
        { key: 'status', label: 'user.status', type: 'badge', responsive: 'always' },
        { key: 'createdAt', label: 'action.createdAt', type: 'date', responsive: 'md' }
    ],
    'address': [
        { key: 'country', label: 'region.country', type: 'text', responsive: 'always' },
        { key: 'city', label: 'region.city', type: 'text', responsive: 'always' },
        { key: 'street', label: 'address.street', type: 'text', responsive: 'md' }
    ],

    // --- DELIVERY ---
    'vehicle': [
        { key: 'brand', label: 'vehicle.brand', type: 'text', sortable: true },
        { key: 'model', label: 'vehicle.model', type: 'text' },
        { key: 'plate', label: 'vehicle.plate', type: 'text' },
        { key: 'type', label: 'vehicle.type', type: 'text' },
    ],
    'trip': [
        { key: 'origin', label: 'trip.origin', type: 'text' },
        { key: 'destination', label: 'trip.destination', type: 'text' },
        { key: 'amount', label: 'trip.amount', type: 'currency', sortable: true },
        { key: 'status', label: 'trip.status', type: 'badge' },
    ],
    'common-address': [
        { key: 'name', label: 'common-address.name_label', type: 'text', sortable: true },
        { key: 'address', label: 'common-address.address_label', type: 'text' },
    ],

    // --- SUSCRIPCIONES ---
    'subscription-plan': [
        { key: 'name', label: 'subscription.plan.name', type: 'text', responsive: 'always' },
        { key: 'price', label: 'subscription.plan.price', type: 'currency', responsive: 'always' },
        { key: 'isActive', label: 'subscription.plan.isActive', type: 'boolean', responsive: 'always' }
    ],
    'subscription': [
        { key: 'status', label: 'subscription.status', type: 'badge', responsive: 'always' },
        { key: 'endDate', label: 'subscription.endDate', type: 'date', responsive: 'md' }
    ],

    // --- REGIONES ---
    'region': [
        { key: 'name', label: 'region.region', type: 'text', responsive: 'always' }
    ],
    'country': [
        { key: 'name', label: 'region.country', type: 'text', responsive: 'always' }
    ],
    'state': [
        { key: 'name', label: 'region.state', type: 'text', responsive: 'always' }
    ],
    'city': [
        { key: 'name', label: 'region.city', type: 'text', responsive: 'always' }
    ],
    'currency': [
        { key: 'code', label: 'region.currency.code', type: 'text', responsive: 'always' },
        { key: 'name', label: 'region.currency.name', type: 'text', responsive: 'always' }
    ],

    // --- FINANZAS ---
    'bank-account': [
        { key: 'accountNumber', label: 'transaction.bank-account.number', type: 'text', responsive: 'always' },
        { key: 'availableBalance', label: 'transaction.available_balance', type: 'currency', responsive: 'always' },
        { key: 'status', label: 'transaction.status', type: 'badge', responsive: 'always' }
    ],
    'crypto-wallet': [
        { key: 'address', label: 'transaction.crypto-wallet.address', type: 'text', responsive: 'always' },
        { key: 'isActive', label: 'transaction.status', type: 'boolean', responsive: 'always' }
    ],
    'transaction': [
        { key: 'amount', label: 'transaction.amount', type: 'currency', responsive: 'always' },
        { key: 'type', label: 'transaction.type', type: 'badge', responsive: 'always' },
        { key: 'status', label: 'transaction.status', type: 'badge', responsive: 'always' }
    ],
    'service-category': [
        { key: 'name', label: 'category.name', type: 'text', responsive: 'always', sortable: true },
        { key: 'icon', label: 'category.icon', type: 'text', responsive: 'always' },
        { key: 'order', label: 'category.order', type: 'text', responsive: 'md' }
    ],
    'service-plan': [
        { key: 'name', label: 'plan.name', type: 'text', responsive: 'always', sortable: true },
        { key: 'cost', label: 'plan.cost', type: 'currency', responsive: 'always', sortable: true },
        { key: 'billingCycle', label: 'plan.billing_cycle', type: 'text', responsive: 'always' },
        { key: 'isPopular', label: 'plan.is_popular', type: 'boolean', responsive: 'md' }
    ]
};