import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {NatureRequest} from '../../../data/models/nature.request.model';
import {NatureRequestService} from '../nature-request/nature-request.service';
import {Category} from '../../../data/models/category.model';
import {CategoriesService} from '../categories/categories.service';

@Component({
    selector: 'wassa-management-category-form-dialog',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CategoryFormDialogComponent {
    action: string;
    category: Category;
    natureRequests: NatureRequest[] = [];
    natureRequest: NatureRequest;
    categoryForm: FormGroup;
    dialogTitle: string;


    /**
     * Constructor
     *
     * @param {MatDialogRef<CategoryFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _natureRequestService
     * @param _categoriesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<CategoryFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _natureRequestService: NatureRequestService,
        private _categoriesService: CategoriesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        this.getNatures();
        this.createCategoryForm();
        // Set the defaults
        this.action = _data.action;
        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une catégorie';
            this.category = _data.category;
            this.getNatureById(this.category.natureRequest.id);
            this.updateCategoryForm();
        } else {
            this.dialogTitle = 'Ajouter une catégorie';
            this.category = new Category();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create category form
     *
     */
    createCategoryForm() {
        this.categoryForm = this._formBuilder.group({
            id: new FormControl(''),
            category: new FormControl('', Validators.required),
            natureRequest: new FormControl('', Validators.required)
        });
    }


    /**
     * update nature form
     *
     */
    updateCategoryForm() {
        this.categoryForm = this._formBuilder.group({
            id: new FormControl(this.category.id),
            category: new FormControl(this.category.category, Validators.required),
            natureRequest: new FormControl(this.category.natureRequest.id, Validators.required)
        });
    }

    getNatures() {
        this._natureRequestService.getAll().subscribe(value => {
            this.natureRequests = value['data'];
        }, error => console.log(error));
    }


    getNatureById(id: number) {
        this._natureRequestService.getById(id).subscribe(value => {
            this.natureRequest = value['data'];
        }, error => console.log(error));
    }


    saveOrUpdate() {
        this._spinnerService.show();
        this.category = new Category();
        this.category = this.categoryForm.getRawValue();
        this.category.natureRequest = this.natureRequest;
        if (!this.category.id) {
            this._categoriesService.create(this.category).subscribe(data => {
                if (data['ok'] === true) {
                    this._categoriesService.getCategories();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                }
            });
        } else {
            this._categoriesService.update(this.category.id, this.category).subscribe(data => {
                if (data['ok'] === true) {
                    this._categoriesService.getCategories();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                }
            });
        }
    }

    onNatureChange(value: number) {
        this.getNatureById(value);
    }
}
