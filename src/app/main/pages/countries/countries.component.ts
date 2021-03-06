import { Component, OnInit } from '@angular/core';
import {TypeModel} from "../../../../models/type.model";
import {DataService} from "../../../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";
import {EditTypeComponent} from "../dialog/edit-type/edit-type.component";
import {CountryModel} from "../../../../models/country.model";
import {EditCountryComponent} from "../dialog/edit-country/edit-country.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {


    displayedColumns: string[] = [ 'name_en', 'name_ar' , 'image' , 'status', 'action'];
    dataSource: any;
    page = 0;
    types: TypeModel[] = [];
    length: number;
    id: number;


    constructor(public restService: DataService,
                private activatedRoute: ActivatedRoute,
                private dialog: MatDialog,
                private toastr: ToastrService) {

    }


    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    deleteConfirm(id) {
        // tslint:disable-next-line:prefer-const
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to country this user ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        })
            .then(result => {
                if (result.value) {
                    this.deleteCountry(id);

                }
            });
    }

    deleteCountry(id) {
        // tslint:disable-next-line:prefer-const
        this.restService.deleteCountry(id).then((res) => {
            this.dataSource.filteredData = this.dataSource.filteredData.filter(item => item._id !== id);
            this.dataSource = new MatTableDataSource(this.dataSource.filteredData);

        }).catch((err: HttpErrorResponse) => {
            if (err.status) {
                this.toastr.error(err.error.message, '');
                if (err.error.code === 401) {
                    this.restService.refreshTokenUser();
                }
            }
        });
    }

    updateCountry(country: CountryModel, value) {
        // tslint:disable-next-line:prefer-const
        country.active = value;
        this.restService.updateCountry(country).then((res) => {
            this.toastr.success('The country has been updated successfully', '');

        }).catch((err: HttpErrorResponse) => {
           if (err.status) {
                this.toastr.error(err.error.message, '');
                if(err.error.code === 401) {
                    this.restService.refreshTokenUser();
                }
            }
        });
    }

    getCountries() {
        this.restService.getCountries().then((res) => {
            this.dataSource = new MatTableDataSource(res.results);
        }).catch((err: HttpErrorResponse) => {
           if (err.status) {
                this.toastr.error(err.error.message, '');
                if(err.error.code === 401) {
                    this.restService.refreshTokenUser();
                }
            }
        });
    }

    openEditDialog(country: CountryModel) {
        let dialog = this.dialog.open(EditCountryComponent);
        dialog.componentInstance.data = country;
        dialog.afterClosed().subscribe(result => {
            if (result) {
                let index = this.dataSource.filteredData.indexOf(country);
                this.dataSource.filteredData[index] = result;
                this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
            }
        });
    }

    openAddDialog() {
        let dialog = this.dialog.open(EditCountryComponent);
        dialog.afterClosed().subscribe(result => {
            if (result) {
                this.dataSource.filteredData.push(result);
                this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
            }
        });
    }


    ngOnInit() {
        this.getCountries();
    }


}
