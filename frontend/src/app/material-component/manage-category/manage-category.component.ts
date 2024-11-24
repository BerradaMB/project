import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, Event, NavigationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;
  private routerSubscription: Subscription | undefined;

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this.categoryService.getCategory().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        this.ngxService.stop();
        console.error('Error:', error);
        this.responseMessage = error.error?.message || GlobalConstants.genericError;
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleAddAction(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { action: 'Add' };
    dialogConfig.width = '850px';

    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        dialogRef.close();
      }
    });

    const sub = dialogRef.componentInstance.onAddCategory.subscribe(() => {
      this.tableData();
    });

    // Clean up subscriptions
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  handleEditAction(value: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { action: 'Edit',
      data:value
     };
    dialogConfig.width = '850px';

    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        dialogRef.close();
      }
    });

    const sub = dialogRef.componentInstance.onEditCategory.subscribe(() => {
      this.tableData();
    });

    // Clean up subscriptions
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}

