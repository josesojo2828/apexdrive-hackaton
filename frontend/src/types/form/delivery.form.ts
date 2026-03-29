import { FormStructure } from './generic.form';

export const VehicleForm: FormStructure = {
    slug: 'vehicle',
    title: 'vehicle.title',
    fields: [
        { name: 'brand', label: 'vehicle.brand', type: 'text', validation: { required: true } },
        { name: 'model', label: 'vehicle.model', type: 'text', validation: { required: true } },
        { name: 'plate', label: 'vehicle.plate', type: 'text', validation: { required: true } },
        { name: 'type', label: 'vehicle.type', type: 'text', validation: { required: true } },
        { name: 'year', label: 'vehicle.year', type: 'number' },
        {
            name: 'userId',
            label: 'delivery.driver',
            type: 'autocomplete',
            remote: { slug: 'USER' },
            validation: { required: true }
        }
    ]
};

export const TripForm: FormStructure = {
    slug: 'trip',
    title: 'trip.title',
    fields: [
        { name: 'origin', label: 'trip.origin', type: 'text', validation: { required: true } },
        { name: 'destination', label: 'trip.destination', type: 'text', validation: { required: true } },
        { name: 'amount', label: 'trip.amount', type: 'number', validation: { required: true } },
        {
            name: 'businessId',
            label: 'trip.business',
            type: 'autocomplete',
            remote: { slug: 'BUSINESS' },
            validation: { required: true }
        },
        {
            name: 'driverId',
            label: 'trip.driver',
            type: 'autocomplete',
            remote: { slug: 'DRIVER' }
        },
        {
            name: 'status',
            label: 'trip.status',
            type: 'select',
            options: [
                { label: 'trip.status_pending', value: 'PENDING' },
                { label: 'trip.status_accepted', value: 'ACCEPTED' },
                { label: 'trip.status_picked_up', value: 'PICKED_UP' },
                { label: 'trip.status_in_transit', value: 'IN_TRANSIT' },
                { label: 'trip.status_delivered', value: 'DELIVERED' },
                { label: 'trip.status_cancelled', value: 'CANCELLED' }
            ]
        }
    ]
};

export const CommonAddressForm: FormStructure = {
    slug: 'common-address',
    title: 'common-address.title',
    fields: [
        { name: 'name', label: 'common-address.name_label', type: 'text', validation: { required: true }, placeholder: 'Sucursal, Casa, Trabajo...' },
        { name: 'address', label: 'common-address.address_label', type: 'textarea', gridCols: 2, validation: { required: true } },
        { name: 'map_picker', label: 'Ubicación en Mapa', type: 'map', gridCols: 2 },
        { name: 'latitude', label: 'common-address.latitude', type: 'number', gridCols: 1 },
        { name: 'longitude', label: 'common-address.longitude', type: 'number', gridCols: 1 },

    ]
};
