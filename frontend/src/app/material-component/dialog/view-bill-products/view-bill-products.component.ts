import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'Code_onee', 'N_serie'];
  dataSource: any = [];
  data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ViewBillProductsComponent>
  ) {}

  ngOnInit() {
    if (this.dialogData) {
      this.data = this.dialogData.data;

      // Check if getProductDetails exists and is valid
      if (this.data && this.data.materialDetails) {
        this.dataSource = Array.isArray(this.data.materialDetails)
          ? this.data.materialDetails
          : JSON.parse(this.data.materialDetails);
      } else {
        console.error('getProductDetails is undefined or empty');
      }
    } else {
      console.error('Dialog Data is undefined or missing');
    }
  }
}
