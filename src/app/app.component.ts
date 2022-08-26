
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'src/app/services/api.services';



import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { ActivatedRoute, Router } from '@angular/router';


import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';


import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  id = '';
  todayDate:any;
  covidForm!: FormGroup ;
  DATA:any;
  covidList: any;
  searchText: any;
  searchValue: any;
  count:any=0;
  covidColumns = ['no','name', 'complaint_subject', 'complaint_id', 'complaint_type']
  covidTableDataSource = new MatTableDataSource<Element>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor(private dialog: MatDialog,
    private service: ApiService,
    public datepipe: DatePipe,
   ) { 

   }

  ngOnInit(): void {
    window.scrollTo(0, 0);
   
    this.todayDate=this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    this.DATA = {
   
    }
    this.initForm();
    this.getDate();
    
  }

  initForm() {
    this.covidForm = new FormGroup({
      'dateInput': new FormControl(''),
      
    },



    );
  }
  get f() { return this.covidForm.controls; }
  get today() { return new Date() }

  methodFilterPredicate() {
    this.covidTableDataSource.filterPredicate =

      (data: Element, filters: string) => {
        console.log("data", data)
        console.log("filters", filters)
        const matchFilter: any = [];
        const filterArray = filters.split(' ');
        const columns = (<any>Object).values(data);
        //console.log('array', filterArray);

        filterArray.forEach(filter => {
          const customFilter: any = [];
          // console.log('column', columns);
          // columns.forEach((column:any) => customFilter.push(column.includes(filter)));
          columns.forEach((column: any) => {
            // console.log("column", column)
            customFilter.push(column.toString().toLowerCase() && column.toString().toLowerCase().includes(filter))
          });
          matchFilter.push(customFilter.some(Boolean)); // OR
        });
        return matchFilter.every(Boolean); // AND toLowerCase()
      }
  }
 
  getDate() {
  
    
    let date = this.datepipe.transform(this.covidForm.controls['dateInput'].value, 'dd-MM-yyyy');
    console.log("date",date);
    this.service.login(this.DATA,date).subscribe((res) => {
    
      this.covidList = res;
      console.log(this.covidList);
      this.covidTableDataSource = new MatTableDataSource<any>(this.covidList.centers);
      this.covidTableDataSource.sortingDataAccessor = (data: any, sortHeaderId: any): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }
      
        return data[sortHeaderId];
      };
     this.covidTableDataSource.sort = this.sort;
      this.covidTableDataSource.paginator = this.paginator;

    }
    ,
    
  (err ) =>
   {

    if(err == "Data Not Found"){
          // this.spinner.hide();
      this.covidList=undefined;
      this.covidTableDataSource = new MatTableDataSource<any>(this.covidList);
      let searchText = (<HTMLInputElement>document.getElementById("search")).value;
      this.covidTableDataSource.sort = this.sort;
      this.covidTableDataSource.paginator = this.paginator;
      this.applyFilter();
    }
    else{
        //    this.spinner.hide();
        //  this.toastr.warning("Oops...Something went wrong!");
    }
    
 
     
   });

  }
 
  



  applyFilter() {
    this.covidTableDataSource.filter = this.searchText.trim().toLowerCase();
  
  }

}
