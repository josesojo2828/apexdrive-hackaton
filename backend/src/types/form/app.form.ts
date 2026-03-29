import { FormStructure } from './generic.form';

// --- CATEGORY BY ITEMS ---
export const CategoryByItemsForm: FormStructure = {
    slug: 'category-items',
    title: 'application.category.title',
    fields: [
        { name: 'name', label: 'category.name', type: 'text', validation: { required: true }, translatable: true },
        { name: 'description', label: 'category.description', type: 'textarea', translatable: true },
        { name: 'icon', label: 'category.icon', type: 'icon_picker', gridCols: 2 },
        { name: 'color', label: 'category.color', type: 'text', gridCols: 2 }
    ]
};

// --- RESOURCE ---
export const ResourceForm: FormStructure = {
    slug: 'resource',
    title: 'application.resource.title',
    fields: [
        { name: 'name', label: 'resource.name', type: 'text', validation: { required: true }, translatable: true },
        { name: 'description', label: 'resource.description', type: 'textarea', translatable: true },
        {
            name: 'categoryId',
            label: 'resource.category',
            type: 'autocomplete',
            remote: { slug: 'CATEGORY_ITEMS' },
            validation: { required: true }
        },
        { name: 'imageUrl', label: 'resource.image', type: 'image' },
        { name: 'enabled', label: 'resource.enabled', type: 'switch', defaultValue: true }
    ]
};

// --- QUESTION ---
export const QuestionForm: FormStructure = {
    slug: 'question',
    title: 'application.question.title',
    fields: [
        { name: 'question', label: 'question.question', type: 'textarea', validation: { required: true }, translatable: true },
        { name: 'response', label: 'question.answer', type: 'textarea', validation: { required: true }, translatable: true },
        { name: 'enabled', label: 'question.enabled', type: 'switch', defaultValue: true }
    ]
};

// --- MESSAGES IN TO WEB ---
export const MessagesInToWebForm: FormStructure = {
    slug: 'messages-web',
    title: 'application.messages.title',
    fields: [
        { name: 'name', label: 'messages.name', type: 'text', validation: { required: true }, disabled: true },
        { name: 'email', label: 'messages.email', type: 'email', validation: { required: true }, disabled: true },
        { name: 'message', label: 'messages.message', type: 'textarea', validation: { required: true }, disabled: true },
        { name: 'read', label: 'messages.read', type: 'switch' }
    ]
};

// --- TESTIMONIALS ---
export const TestimonialsForm: FormStructure = {
    slug: 'testimonial',
    title: 'application.testimonial.title',
    fields: [
        { name: 'name', label: 'testimonial.name', type: 'text', validation: { required: true } },
        { name: 'message', label: 'testimonial.message', type: 'textarea', validation: { required: true }, translatable: true }
    ]
};

// --- APPLICATION ABOUT ---
export const ApplicationAboutForm: FormStructure = {
    slug: 'about',
    title: 'application.about.title',
    fields: [
        { name: 'mision', label: 'about.mision', type: 'textarea', validation: { required: true }, translatable: true },
        { name: 'vision', label: 'about.vision', type: 'textarea', validation: { required: true }, translatable: true }
    ]
};

// --- APPLICATION VALUES ---
export const ApplicationValuesForm: FormStructure = {
    slug: 'value',
    title: 'application.value.title',
    fields: [
        { name: 'title', label: 'value.title', type: 'text', validation: { required: true }, translatable: true },
        { name: 'description', label: 'value.description', type: 'textarea', validation: { required: true }, translatable: true },
        { name: 'icon', label: 'value.icon', type: 'icon_picker' }
    ]
};

// --- APPLICATION OBJECTIVES ---
export const ApplicationObjetivesForm: FormStructure = {
    slug: 'objective',
    title: 'application.objective.title',
    fields: [
        { name: 'objetivo', label: 'objective.objective', type: 'text', validation: { required: true }, translatable: true },
        { name: 'description', label: 'objective.description', type: 'textarea', validation: { required: true }, translatable: true },
        { name: 'icon', label: 'objective.icon', type: 'icon_picker' }
    ]
};

// --- APPLICATION SOCIAL MEDIA ---
export const ApplicationSocialMediaForm: FormStructure = {
    slug: 'social-media',
    title: 'application.social_media.title',
    fields: [
        { name: 'name', label: 'social_media.name', type: 'text', validation: { required: true } },
        { name: 'url', label: 'social_media.url', type: 'text', validation: { required: true } },
        { name: 'icon', label: 'social_media.icon', type: 'icon_picker' }
    ]
};

// --- SERVICE ---
export const ServiceCategoryForm: FormStructure = {
    slug: 'service-category',
    title: 'application.service_category.title',
    fields: [
        { name: 'name', label: 'category.name', type: 'text', validation: { required: true }, translatable: true },
        { name: 'description', label: 'category.description', type: 'textarea', translatable: true },
        { name: 'icon', label: 'category.icon', type: 'icon_picker', gridCols: 2 },
        { name: 'order', label: 'category.order', type: 'number', gridCols: 2 },
        { name: 'enabled', label: 'category.enabled', type: 'switch', defaultValue: true }
    ]
};

export const ServicePlanForm: FormStructure = {
    slug: 'service-plan',
    title: 'application.service_plan.title',
    fields: [
        { name: 'name', label: 'plan.name', type: 'text', validation: { required: true }, translatable: true },
        { name: 'cost', label: 'plan.cost', type: 'number', validation: { required: true }, gridCols: 2 },
        { name: 'billingCycle', label: 'plan.billing_cycle', type: 'text', defaultValue: 'Monthly', gridCols: 2 },
        { 
            name: 'categoryId', 
            label: 'plan.category', 
            type: 'autocomplete', 
            remote: { slug: 'SERVICE_CATEGORY' },
            validation: { required: true }
        },
        { name: 'attributes', label: 'plan.attributes', type: 'json' },
        { name: 'isPopular', label: 'plan.is_popular', type: 'switch', defaultValue: false },
        { name: 'enabled', label: 'plan.enabled', type: 'switch', defaultValue: true }
    ]
};
