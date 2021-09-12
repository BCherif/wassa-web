import {RequestType} from './request.type.model';
import {Entity} from '../../utils/entity';

export class NatureRequest {
    id?: number;
    nature: string;
    state: boolean;
    slaTto: string;
    slaTtr: string;
    requestType: RequestType;
}