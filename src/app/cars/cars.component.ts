import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../_services/token-storage.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { AddCarComponent } from '../addcar/addcar.component';
import { MatDialog } from '@angular/material/dialog';
import { AddLoggerDeviceComponent } from '../addloggerdevice/addloggerdevice.component';
import { TranslateService } from '@ngx-translate/core';
import { CarProfileComponent } from '../carprofile/carprofile.component';


@Injectable()
@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  form: any;
  dataSource: MatTableDataSource<any>;
  dataSource1: MatTableDataSource<any>;
  isLoadingResults = true;
  displayedColumns = ['id', 'model', 'plateNumber', 'blocked', 'loggerDevice'];
  displayedColumns2 = ['id', 'serialNumber', 'simCardNumber'];
  id: number;
  cars: any = [];
  loggerDevices: any = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  // tslint:disable-next-line: max-line-length
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private router: Router, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private translate: TranslateService) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + this.tokenStorage.getToken()
    })
  };

  ngOnInit() {
    this.translate.getStreamOnTranslationChange('Items per page:').subscribe((text: string) => {
      this.paginator._intl.itemsPerPageLabel = text;
    });
    this.http.get<any>('https://backend.carfleetmanagementsystem.pl:443/listofcars', this.httpOptions)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoadingResults = false;
          this.cars = data;
          console.log(this.cars.length)
        },
        err => {
          this.isLoadingResults = false;
        });
    this.http.get<any>('https://backend.carfleetmanagementsystem.pl:443/listofloggerdevices', this.httpOptions)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.dataSource1 = new MatTableDataSource(response);
          this.dataSource1.sort = this.sort;
          this.dataSource1.paginator = this.paginator;
          this.isLoadingResults = false;
          this.loggerDevices = response;
        },
        err => {
          this.isLoadingResults = false;
        });
  }

  btnClick(newValue: number) {
    this.router.navigate(['/carprofile'], { queryParams: { id: newValue }, relativeTo: this.activatedRoute });
  }

  btnClick1(newValue: number) {
    this.router.navigate(['/loggerdevicedetails'], { queryParams: { id: newValue }, relativeTo: this.activatedRoute });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  addCar(): void {
    let dialogRef = this.dialog.open(AddCarComponent, {
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  addLoggerDevice(): void {
    let dialogRef = this.dialog.open(AddLoggerDeviceComponent, {
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

}

