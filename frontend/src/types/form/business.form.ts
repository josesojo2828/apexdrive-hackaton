import { FormStructure } from './generic.form';

export const PromotionForm: FormStructure = {
    slug: 'promotion',
    title: 'business.promotion.title',
    fields: [
        { name: 'title', label: 'promotion.title_label', type: 'text', validation: { required: true } },
        { name: 'description', label: 'promotion.description', type: 'textarea' },
        { name: 'discount', label: 'promotion.discount', type: 'number', validation: { required: true, min: 0 } },
        { name: 'startDate', label: 'promotion.start_date', type: 'date', validation: { required: true } },
        { name: 'endDate', label: 'promotion.end_date', type: 'date', validation: { required: true } },
        {
            name: 'userId',
            label: 'user.user',
            type: 'autocomplete',
            remote: { slug: 'USER' },
            validation: { required: true }
        }
    ]
};

export const BusinessProfileForm: FormStructure = {
    slug: 'business-profile',
    title: 'business.profile.title',
    fields: [
        { name: 'name', label: 'business.profile.name', type: 'text', gridCols: 2, validation: { required: true } },
        { name: 'email', label: 'business.profile.email', type: 'email', gridCols: 2 },
        { name: 'phone', label: 'business.profile.phone', type: 'text', gridCols: 2 },
        { name: 'website', label: 'business.profile.website', type: 'text', gridCols: 2 },
        { name: 'description', label: 'business.profile.description', type: 'textarea', gridCols: 2 },
        { name: 'address', label: 'address.street', type: 'textarea', gridCols: 2 },
        { name: 'city', label: 'address.city', type: 'text', gridCols: 2 },
        { name: 'zipCode', label: 'address.zip', type: 'text', gridCols: 2 },
        { name: 'map_picker', label: 'Ubicación Principal', type: 'map', gridCols: 2 },
        { name: 'latitude', label: 'common-address.latitude', type: 'number', gridCols: 1 },
        { name: 'longitude', label: 'common-address.longitude', type: 'number', gridCols: 1 },
    ]
};


