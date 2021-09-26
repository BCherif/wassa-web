import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-costumer',
    templateUrl: './costumer.component.html',
    styleUrls: ['./costumer.component.scss']
})
export class CostumerComponent implements OnInit {

    dataSource: any;
    displayedColumns = ['reference', 'date', 'phone','fullname','source','nature','desc','cons','etat', 'buttons'];

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    constructor() { }

    ngOnInit(): void {
    }

}
