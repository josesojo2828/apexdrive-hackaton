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
