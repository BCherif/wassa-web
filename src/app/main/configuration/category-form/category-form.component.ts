import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Category} from '../../../data/models/category.model';
import {CategoriesService} from '../categories/categories.service';
import {ListResponseBody} from '../../../utils/list-response-body';

@Component({
    selector: 'configuration-category-form-dialog',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CategoryFormComponent {
    action: string;
    category: Category;
    categoryForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<CategoryFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _categoriesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<CategoryFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _categoriesService: CategoriesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une catégorie';
            this.category = _data.category;
        } else {
            this.dialogTitle = 'Ajouter une catégorie';
            this.category = new Category({});
        }

        this.categoryForm = this.createCategoryForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create axis form
     *
     * @returns {FormGroup}
     */
    createCategoryForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.category.id],
            name: [this.category.name],
            description: [this.category.description]
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.category = new Category();
        this.category = this.categoryForm.getRawValue();
        if (!this.category.id) {
            this._categoriesService.save(this.category).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._categoriesService.getCategories(this._categoriesService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Category>();
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
            this._categoriesService.update(this.category).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._categoriesService.getCategories(this._categoriesService.pageBody).subscribe(data => {
                        const listResponseBody = new ListResponseBody<Category>();
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
}
