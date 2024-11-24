import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductComponent } from '../dialog/product/product.component';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = [
    'name',

    'Code_onee',

    'N_serie',
    'edit',

  ];
  dataSource: any[] = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  N_serie: any;
  selectedItems: any = [];
  materialDetails: any =[];
  filteredSerialNumbers :  any = [];
  filteredCodeOnee :any = [];
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      Nom_et_prenom: [null, Validators.required],
      matricule: [null, Validators.required],
      Adresse_du_site: [null, Validators.required],
      entite: [null, Validators.required],
      product: [null, Validators.required],
      category: [null, Validators.required],
      N_serie: [null, Validators.required],
      Code_onee: [null, Validators.required],
    });
  }

  getCategorys() {
    this.categoryService.getCategory().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.categorys = response;
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  getProductDetails(product: any) {
    if (product) {
        this.productService.getById(product.id).subscribe(
            (response: any) => {
                this.materialDetails = response;

                // Vérifiez que materialDetails est bien un tableau
                if (typeof this.materialDetails === 'string') {
                    this.materialDetails = JSON.parse(this.materialDetails);
                }

                // Vérifiez que les données contiennent les champs corrects
                if (Array.isArray(this.materialDetails)) {
                    this.dataSource = this.materialDetails;
                } else {
                    console.error('materialDetails is not an array:', this.materialDetails);
                    this.dataSource = [];
                }

                console.log('Material Details:', this.materialDetails);
                console.log('Data Source:', this.dataSource);

                if (response.serialNumbers && Array.isArray(response.serialNumbers)) {
                    this.filteredSerialNumbers = response.serialNumbers;
                } else {
                    this.filteredSerialNumbers = [response];
                }

                if (response.codeOnee && Array.isArray(response.codeOnee)) {
                    this.filteredCodeOnee = response.codeOnee;
                } else {
                    this.filteredCodeOnee = [response];
                }
            },
            (error: any) => {
                this.handleError(error);
            }
        );
    }
}
getProductsBycategory(value: any) {
  this.productService.getProductsByCategory(value.id).subscribe(
      (response: any) => {
          this.products = response;
          console.log('Products:', this.products);
      },
      (error: any) => {
          if (error.error?.message) {
              this.responseMessage = error.error?.message;
          } else {
              this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(
              this.responseMessage,
              GlobalConstants.error
          );
      }
  );
}


add() {
  const formData = this.manageOrderForm.value;

  // Ensure dataSource is initialized
  if (!Array.isArray(this.dataSource)) {
    this.dataSource = [];
    console.warn('dataSource was undefined, initializing as empty array');
  }

  if (formData.category && formData.category.id) {
    // Fetch products by category first
    this.productService.getProductsByCategory(formData.category.id).subscribe(
      (response: any) => {
        this.products = response;
        console.log('Products:', this.products);

        if (formData.product && formData.product.id) {
          // Check if the product already exists in the dataSource
          const existingProduct = this.dataSource.find(
            (e: { id: number }) => e.id === formData.product.id
          );

          if (!existingProduct) {
            // Find the corresponding values for Code_onee and N_serie
            const selectedSerial = this.filteredSerialNumbers.find(
              (serial: any) => serial.id === formData.N_serie
            );
            const selectedCodeOnee = this.filteredCodeOnee.find(
              (code: any) => code.id === formData.Code_onee
            );

            // Safeguard against undefined famille
            const famille = formData.product.famille || 'Unknown Famille'; // Default to 'Unknown Famille' if undefined

            // If the product does not exist, add it to the dataSource
            this.dataSource.push({
              id: formData.product.id,
              name: formData.product.name,

              Code_onee: selectedCodeOnee ? selectedCodeOnee.Code_onee : '',
              N_serie: selectedSerial ? selectedSerial.N_serie : '',
            });

            // Trigger change detection
            this.dataSource = [...this.dataSource];
            this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
          } else {
            // If the product already exists, show an error message
            this.snackbarService.openSnackBar(
              GlobalConstants.productExistError,
              GlobalConstants.error
            );
          }
        } else {
          console.error('Product is undefined or missing an ID in formData');
        }
      },
      (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  } else {
    console.error('Category is undefined or missing an ID in formData');
  }
}



  handleDeleteAction(value: any, element: any) {
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction() {
    this.ngxService.start();
    const formData = this.manageOrderForm.value;
    const data = {
      Nom_et_prenom: formData.Nom_et_prenom,
      matricule: formData.matricule,
      Adresse_du_site: formData.Adresse_du_site,
      entite: formData.entite,
      materialDetails: JSON.stringify(this.dataSource),
    };

    console.log('Data sent to API:', data); // Vérifiez les données ici

    this.billService.generateReport(data).subscribe(
      (response: any) => {
        this.downloaFile(response?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }


  downloaFile(fileName: any) {
    const data = { uuid: fileName };
    this.billService.getPdf(data).subscribe((response: any) => {
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    });
  }

  handleError(error: any) {
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  }
}
