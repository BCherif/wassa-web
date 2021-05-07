export enum TYPE_UNITY {
    UNITY1 = 'Unité 1',
    UNITY2 = 'Unité 2'
}

export enum LINE_STATE {
    PENDING = 'En cours',
    IN_FINANCING = 'En financement',
    CLOSE = 'Solder'
}

export enum METHOD_OF_PAYMENT {
    CHECK = 'Chèque',
    TRANSFER = 'Virement',
    CASH = 'Espèce'
}

export enum BUDGET_STATE {
    DRAFT = 'Brouillon',
    DONE = 'Terminé',
    VALIDATED = 'Validé',
    CANCELLED = 'Annulé'
}

export enum ACTIVITY_STATE {
    APPROVED = 'A approuver',
    IN_VALIDATION = 'En validation',
    TO_CONFIRM = 'Confirmer',
    REFUSE = 'Réfuser',
    CLOSE = 'Clôturer'
}

export enum EXPENSE_STATE {
    PENDING = 'En attente',
    VALIDATE = 'Valider'
}

export enum SPEND_STATE {
    AWAITING_APPROVAL = 'En attente d\'approbation',
    APPROVED = 'Approuvé',
    AWAITING_VALIDATION = 'En attente de validation',
    VALIDATION = 'Validé'
}

export enum TASK_PRIORITY {
    LOW = 'Faible',
    MEDIUM = 'Moyenne',
    HIGH = 'Haute',
    URGENT = 'Urgente'
}

export enum TASK_STATE {
    TODO = 'Non commence',
    IN_PROGRESS = 'Commence',
    DONE = 'Termine',
    PENDING = 'En attente',
}