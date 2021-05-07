import {FuseNavigation} from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
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
                id: 'expenses-management',
                title: 'Gestion dépense',
                type: 'collapsable',
                icon: 'attach_money',
                children: [
                    {
                        id: 'activities',
                        title: 'Demandes',
                        type: 'item',
                        icon: 'library_books',
                        url: '/main/expenses-management/activities'
                    }
                ]
            },
            {
                id: 'staff-management',
                title: 'Gestion du Personnel',
                type: 'collapsable',
                icon: 'person',
                children: [
                    {
                        id: 'employees',
                        title: 'Employés',
                        type: 'item',
                        icon: 'person',
                        url: '/main/staff-management/employees'
                    }
                ]
            },
            {
                id: 'reporting',
                title: 'Rapports',
                type: 'item',
                icon: 'local_atm',
                url: '/main/reporting/reports'
            },
            {
                id: 'task',
                title: 'Tâches',
                type: 'item',
                icon: 'check_box',
                url: '/main/tasks/all',
                exactMatch: true
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
                    },
                    {
                        id: 'jobs',
                        title: 'Professions',
                        type: 'item',
                        icon: 'work',
                        url: '/main/configuration/jobs'
                    },
                    {
                        id: 'departments',
                        title: 'Départements',
                        type: 'item',
                        icon: 'home',
                        url: '/main/configuration/departments'
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
