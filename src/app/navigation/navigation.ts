import {FuseNavigation} from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            /*{
                id       : 'sample',
                title    : 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },*/
            {
                id: 'budget-management',
                title: 'Gestion Budgétaire',
                type: 'collapsable',
                icon: 'local_atm',
                children: [
                    {
                        id: 'budgets',
                        title: 'Budgets',
                        type: 'item',
                        icon: 'local_atm',
                        url: '/main/budget-management/budgets'
                    }
                ]
            },
            {
                id: 'configuration',
                title: 'Configurations',
                type: 'collapsable',
                icon: 'settings',
                children: [
                    {
                        id: 'partners',
                        title: 'Partenaires',
                        type: 'item',
                        icon: 'person',
                        url: '/main/configuration/partners'
                    },
                    {
                        id: 'projects',
                        title: 'Projets',
                        type: 'item',
                        icon: 'folder',
                        url: '/main/configuration/projects'
                    },
                    {
                        id: 'categories',
                        title: 'Catégories',
                        type: 'item',
                        icon: 'settings',
                        url: '/main/configuration/categories'
                    },
                    {
                        id: 'units',
                        title: 'Unités',
                        type: 'item',
                        icon: 'settings',
                        url: '/main/configuration/units'
                    }
                ]
            },
            {
                id: 'administration',
                title: 'Administrations',
                type: 'collapsable',
                icon: 'person_add',
                children: [
                    {
                        id: 'users',
                        title: 'Utilisateurs',
                        type: 'item',
                        icon: 'person',
                        url: '/main/administration/users'
                    },
                    {
                        id: 'roles',
                        title: 'Rôles',
                        type: 'item',
                        icon: 'people_outline',
                        url: '/main/administration/roles'
                    }
                ]
            }
        ]
    }
];
