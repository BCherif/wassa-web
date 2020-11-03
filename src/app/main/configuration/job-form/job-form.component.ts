import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ListResponseBody} from '../../../utils/list-response-body';
import {Job} from '../../../data/models/job.model';
import {JobsService} from '../jobs/jobs.service';

@Component({
    selector: 'configuration-job-form-dialog',
    templateUrl: './job-form.component.html',
    styleUrls: ['./job-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class JobFormComponent {
    action: string;
    job: Job;
    jobForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<JobFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _jobsService
     * @param _toast
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<JobFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _jobsService: JobsService,
        private _toast: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une profession';
            this.job = _data.job;
        } else {
            this.dialogTitle = 'Ajouter une profession';
            this.job = new Job({});
        }

        this.jobForm = this.createJobForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create job form
     *
     * @returns {FormGroup}
     */
    createJobForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.job.id],
            title: [this.job.title, Validators.required],
            description: [this.job.description],
            jobRole: [this.job.jobRole],
            jobDuty: [this.job.jobDuty],
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.job = new Job();
        this.job = this.jobForm.getRawValue();
        if (!this.job.id) {
            this._jobsService.save(this.job).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._jobsService.getJobs(this._jobsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Job>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                } else {
                    this._toast.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        } else {
            this._jobsService.update(this.job).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toast.success(data['message']);
                    this._jobsService.getJobs(this._jobsService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Job>();
                        listResponseBody.content = data['content'];
                        listResponseBody.totalElements = data['totalElements'];
                        this.matDialogRef.close(listResponseBody);
                        this._spinnerService.hide();
                    });
                } else {
                    this._toast.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        }
    }

    closeDialog() {
        this._jobsService.getJobs(this._jobsService.pageBody).subscribe(data => {
            const listResponseBody = new ListResponseBody<Job>();
            listResponseBody.content = data['content'];
            listResponseBody.totalElements = data['totalElements'];
            this.matDialogRef.close(listResponseBody);
        });
    }
}
