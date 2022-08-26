
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
  user_id: any;
  token: any;
  DATA: any;
  complaintList: any;
  searchText: any;
  searchValue: any;
count:any=0;
  complaintColumns = ['no','name', 'complaint_subject', 'complaint_id', 'complaint_type']
  complaintTableDataSource = new MatTableDataSource<Element>();

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
    this.user_id = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');
    this.DATA = {
      'user_id': this.user_id,
      'token': this.token
    }
    this.initForm();
    this.getComplaint();
    
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
    this.complaintTableDataSource.filterPredicate =

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
   
    let date = this.covidForm.controls['date'].value;
    this.service.login(this.DATA,date).subscribe((res) => {
    
      this.complaintList = res;
      console.log(this.complaintList);
      this.complaintTableDataSource = new MatTableDataSource<any>(this.complaintList.centers);
      this.complaintTableDataSource.sortingDataAccessor = (data: any, sortHeaderId: any): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }
      
        return data[sortHeaderId];
      };
     this.complaintTableDataSource.sort = this.sort;
      this.complaintTableDataSource.paginator = this.paginator;

    }
    ,
    
  (err ) =>
   {

    if(err == "Data Not Found"){
          // this.spinner.hide();
      this.complaintList=undefined;
      this.complaintTableDataSource = new MatTableDataSource<any>(this.complaintList);
      let searchText = (<HTMLInputElement>document.getElementById("search")).value;
      this.complaintTableDataSource.sort = this.sort;
      this.complaintTableDataSource.paginator = this.paginator;
      this.applyFilter();
    }
    else{
        //    this.spinner.hide();
        //  this.toastr.warning("Oops...Something went wrong!");
    }
    
    // this.error = err.message;
   // console.log("message",err.message);
     
   });

  }
  getComplaint() {
  
    
    let date = this.datepipe.transform(this.covidForm.controls['dateInput'].value, 'dd-MM-yyyy');
    console.log("date",date);
    this.service.login(this.DATA,date).subscribe((res) => {
    
      this.complaintList = res;
      console.log(this.complaintList);
      this.complaintTableDataSource = new MatTableDataSource<any>(this.complaintList.centers);
      this.complaintTableDataSource.sortingDataAccessor = (data: any, sortHeaderId: any): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }
      
        return data[sortHeaderId];
      };
     this.complaintTableDataSource.sort = this.sort;
      this.complaintTableDataSource.paginator = this.paginator;

    }
    ,
    
  (err ) =>
   {

    if(err == "Data Not Found"){
          // this.spinner.hide();
      this.complaintList=undefined;
      this.complaintTableDataSource = new MatTableDataSource<any>(this.complaintList);
      let searchText = (<HTMLInputElement>document.getElementById("search")).value;
      this.complaintTableDataSource.sort = this.sort;
      this.complaintTableDataSource.paginator = this.paginator;
      this.applyFilter();
    }
    else{
        //    this.spinner.hide();
        //  this.toastr.warning("Oops...Something went wrong!");
    }
    
    // this.error = err.message;
   // console.log("message",err.message);
     
   });

  }
 
  



  applyFilter() {
    this.complaintTableDataSource.filter = this.searchText.trim().toLowerCase();
   // this.methodFilterPredicate();
  }

}
