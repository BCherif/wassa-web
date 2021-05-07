import {Injectable} from '@angular/core';
import {Employee} from '../data/models/employee.model';
import {Project} from '../data/models/project.model';

@Injectable()
export class EntityListUtils {

    searchUser(query: string, employees: Employee[]): Employee[] {
        return employees.filter((employee) => ((employee.email.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1) || (employee.telephone.indexOf(query.trim().toLowerCase()) > -1) ||
            (employee.firstname.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1)) || (employee.lastname.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1));
    }

    searchCustomer(query: string, projects: Project[]): Project[] {
        return projects.filter((project) => ((project.title.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1)));
    }


}