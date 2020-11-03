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

export enum DEMAND_STATE {
    APPROVED = 'A approuver',
    IN_VALIDATION = 'En validation',
    TO_CONFIRM = 'Confirmer',
    REFUSE = 'Réfuser'
}

export enum SPEND_STATE {
    AWAITING_APPROVAL = 'En attente d\'approbation',
    APPROVED = 'Approuvé',
    AWAITING_VALIDATION = 'En attente de validation',
    VALIDATION = 'Validé'
}