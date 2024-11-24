import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EventEmitter } from '@angular/core';
import { error } from 'console';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter<void>();
  onEditCategory = new EventEmitter<void>();
  categoryForm!: FormGroup;
  dialogAction: string = "Add";
  action: string = "Add";
  responseMessage: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
              private formBuilder: FormBuilder,
              private categoryService: CategoryService,
              public dialogRef: MatDialogRef<CategoryComponent>,
              private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    if (this.categoryForm.invalid) {
      console.log("Form is invalid");
      return;
    }
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    };
    console.log("Adding category with data:", data); // Debugging line
    this.categoryService.add(data).subscribe(
      (response: any) => {
        console.log("Add successful:", response); // Debugging line
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      (error: any) => {
        console.log("Error adding category:", error); // Debugging line
        this.dialogRef.close();
        this.responseMessage = error.error?.message || GlobalConstants.genericError;
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  edit() {
    var formData = this.categoryForm.value;
    var data = {
      id:this.dialogData.data.id,
      name: formData.name
    };
    this.categoryService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    });
  }
}
