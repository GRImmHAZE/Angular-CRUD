import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  Observable,
} from 'rxjs';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent {
  getData: any | null;
  currLength: any;
  isFilterActive(): boolean {
    return this.filterSubject.value !== '';
  }
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['firstName', 'lastName', 'address', 'action'];
  filterSubject = new BehaviorSubject<string>('');
  noDataFound: boolean = false;
  length: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageIndex: any = 0;

  constructor(
    private http: HttpClient,
    private apiservice: ApiServiceService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.updateList.subscribe(async (res: any) => {
      console.log('sadadk');
      this.updateTable(this.dataSource.data.slice(-4));
    });
    this.filterSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((filter) => this.fetchData(filter, this.pageIndex)) // Start from page 0
      )
      .subscribe(
        (data: any) => {
          this.updateTable(data.users);
          this.length = data.total;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  updateTable(data: any[]) {
    let store = this.commonService.getFromLocalStorage();
    store = store.concat(data);
    this.dataSource = new MatTableDataSource<any>(store);
    this.currLength = store.length;
    // this.dataSource.paginator = this.paginator;
    this.noDataFound = data.length === 0;
    console.log(this.dataSource, 'data');
  }

  applyFilter(filterValue: any) {
    this.filterSubject.next(filterValue.target.value.trim().toLowerCase());
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.filterSubject.next('');
    this.fetchData('', this.pageIndex).subscribe(
      (data: any) => this.updateTable(data.users),
      (error) => {
        console.error('Error fetching data:', error);
        // Handle error (e.g., show error message)
      }
    );
  }

  fetchData(filter: string, pageIndex: number): Observable<any[]> {
    let url = `https://dummyjson.com/users?limit=4&skip=${
      pageIndex * 4
    }&select=firstName,lastName,address`;
    if (filter) {
      url = `https://dummyjson.com/users/search?q=${filter}`;
    }
    return this.http.get<any[]>(url);
  }

  EditFunction(user: any) {
    this.commonService.editSub.next(user);
  }
  deleteFunction(user: any) {
    this.commonService.deleteItem(user.id);
    this.updateTable(this.dataSource.data.slice(-4));
  }
}
