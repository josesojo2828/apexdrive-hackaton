
export type SUPPORT_SELECT =
    | 'TRANSACTION'
    | 'CRYPTOWALLET'
    | 'CURRENCY'
    | 'BANKACCOUNT'
    | 'REGIONS'
    | 'COUNTRY'
    | 'STATE'
    | 'CITY'
    | 'SUBSCRIPTION'
    | 'SUBSCRIPTIONPLAN'
    | 'USER'
    | 'DRIVER'
    | 'BUSINESS'
    | 'COMMON_ADDRESS'
    | 'CATEGORY_ITEMS'
    | 'PERMISSION'
    | 'PERMISSION_USER';

export interface ObjectSelect {
    id: string,
    label: string
}
