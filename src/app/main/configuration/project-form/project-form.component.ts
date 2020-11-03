import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Category} from '../../../data/models/category.model';
import {ListResponseBody} from '../../../utils/list-response-body';
import {Project} from '../../../data/models/project.model';
import {ProjectsService} from '../projects/projects.service';

@Component({
    selector: 'configuration-project-form-dialog',
    templateUrl: './project-form.component.html',
    styleUrls: ['./project-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProjectFormComponent {
    action: string;
    project: Project;
    projectForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ProjectFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _projectsService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<ProjectFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _projectsService: ProjectsService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une projet';
            this.project = _data.project;
        } else {
            this.dialogTitle = 'Ajouter une projet';
            this.project = new Project({});
        }

        this.projectForm = this.createProjectForm();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create project form
     *
     * @returns {FormGroup}
     */
    createProjectForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.project.id],
            title: [this.project.title],
            description: [this.project.description],
            startDate: [this.project.startDate],
            endDate: [this.project.endDate],
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.project = new Project();
        this.project = this.projectForm.getRawValue();
        if (!this.project.id) {
            this._projectsService.save(this.project).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._projectsService.getProjects(this._projectsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Project>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        } else {
            this._projectsService.update(this.project).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._projectsService.getProjects(this._projectsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Project>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        }
    }

    closeDialog() {
        this._projectsService.getProjects(this._projectsService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Project>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}
