import {FuseNavigation} from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'wassa-management',
                title: 'Wassa',
                type: 'collapsable',
                icon: 'local_atm',
                children: [
                    {
                        id: 'nature',
                        title: 'Natures',
                        type: 'item',
                        icon: 'local_atm',
                        url: '/main/wassa-management/nature-request'
                    },
                    {
                        id: 'categories',
                        title: 'catégories',
                        type: 'item',
                        icon: 'local_atm',
                        url: '/main/wassa-management/categories'
                    },
                    {
                        id: 'type',
                        title: 'Types',
                        type: 'item',
                        icon: 'local_atm',
                        url: '/main/wassa-management/request-types'
                    }
                ]
            },
            {
                id: 'main-dashboard',
                title: 'Gestion de la fiche client',
                type: 'item',
                icon: 'dashboard',
                url: '/main/customer-file-management/customer-forms'
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
