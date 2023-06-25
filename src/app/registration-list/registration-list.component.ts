import { Component, OnInit,ViewChild } from '@angular/core';
import { Registration } from '../registration/registration.model';
import { RegistrationService } from '../registration/registration.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table'
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {

  pageTitle = 'Registered Users';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';
  @ViewChild('paginator') paginator!: MatPaginator;
  public dataSource=new MatTableDataSource<Registration>();

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredRegistrations = this.listFilter ? this.performFilter(this.listFilter) : this.registrations;
  }

  filteredRegistrations: Registration[] = [];
  registrations: Registration[] = [];

  constructor(private registrationService: RegistrationService) { }

  performFilter(filterBy: string): Registration[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.registrations.filter((registration: Registration) =>
    registration.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.filteredRegistrations);
    this.dataSource.paginator=this.paginator;
}

  // Checks both the product name and tags
  //performFilter2(filterBy: string): Product[] {
   // filterBy = filterBy.toLocaleLowerCase();
   // return this.products.filter((product: Product) =>
    //  product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
     //   (product.tags && product.tags.some(tag => tag.toLocaleLowerCase().indexOf(filterBy) !== -1)));
 // }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    this.registrationService.getUsers().subscribe(
      (registrations:Registration[])=>
      {
        this.registrations = registrations;
        this.filteredRegistrations = this.registrations;
        
    });
  }
}
