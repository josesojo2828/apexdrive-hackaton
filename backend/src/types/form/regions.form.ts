import { FormStructure } from './generic.form';

/**
 * Módulo de Regiones, Países y Monedas
 * Definiciones para: Currency, Region, Country, State y City.
 */

// --- CURRENCY ---
export const CurrencyForm: FormStructure = {
    slug: 'currency',
    title: 'regions.currency.title',
    fields: [
        { name: 'code', label: 'currency.code', type: 'text', gridCols: 2, validation: { required: true, maxLength: 10 } },
        { name: 'name', label: 'currency.name', type: 'text', gridCols: 2, validation: { required: true } },
        { name: 'decimals', label: 'currency.decimals', type: 'number', gridCols: 2, defaultValue: 2, validation: { required: true, min: 0 } },
        { name: 'isCrypto', label: 'currency.isCrypto', type: 'switch', gridCols: 2, defaultValue: false },
        { name: 'isActive', label: 'currency.isActive', type: 'switch', gridCols: 2, defaultValue: true }
    ]
};

// --- REGION ---
export const RegionForm: FormStructure = {
    slug: 'region',
    title: 'regions.region.title',
    fields: [
        { name: 'name', label: 'region.name', type: 'text', validation: { required: true, minLength: 3 } }
    ]
};

// --- COUNTRY ---
export const CountryForm: FormStructure = {
    slug: 'country',
    title: 'regions.country.title',
    fields: [
        { name: 'name', label: 'country.name', type: 'text', validation: { required: true } },
        { name: 'languaje', label: 'country.language', type: 'text', gridCols: 2, placeholder: 'Ej: es, en' },
        { name: 'timezone', label: 'country.timezone', type: 'text', gridCols: 2, placeholder: 'UTC-4' },
        {
            name: 'regionId',
            label: 'country.region',
            type: 'autocomplete',
            remote: { slug: 'REGIONS' },
            validation: { required: true }
        },
        {
            name: 'currencyId',
            label: 'country.currency',
            type: 'autocomplete',
            remote: { slug: 'CURRENCY' },
            validation: { required: true }
        }
    ]
};

// --- STATE ---
export const StateForm: FormStructure = {
    slug: 'state',
    title: 'regions.state.title',
    fields: [
        { name: 'name', label: 'state.name', type: 'text', validation: { required: true } },
        {
            name: 'countryId',
            label: 'state.country',
            type: 'autocomplete',
            remote: { slug: 'COUNTRY' },
            validation: { required: true }
        }
    ]
};

// --- CITY ---
export const CityForm: FormStructure = {
    slug: 'city',
    title: 'regions.city.title',
    fields: [
        { name: 'name', label: 'city.name', type: 'text', validation: { required: true } },
        {
            name: 'stateId',
            label: 'city.state',
            type: 'autocomplete',
            // Aquí aplicamos la dependencia: solo busca estados del país seleccionado si fuera necesario,
            // pero según tu DTO, la ciudad solo requiere el stateId.
            remote: { slug: 'STATE' },
            validation: { required: true }
        }
    ]
};