import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
})
export class AddPatientComponent {
  patientForm: any;
  storedData: any;
  storedDatafromLocal: any;
  parsedData: any;
  newData: any;
  idEdit: any;
  constructor(
    private formBuilder: FormBuilder,
    private apiservice: ApiServiceService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.patientForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      emergencyContacts: this.formBuilder.array([]),
    });

    this.commonService.editSub.subscribe(async (res: any) => {
      console.log(res);
      if (res.hasOwnProperty('id')) {
        this.idEdit = res.id;
        this.patientForm.setValue({
          firstName: res.firstName,
          lastName: res.lastName,
          addressLine1: res.address.address,
          city: res.address.city,
          state: res.address.state,
          zipCode: res.address.postalCode,
          phone: res?.phone || '',
          email: res?.email || '',
          addressLine2: '',
          emergencyContacts: [],
        });
      }
    });
  }

  get emergencyContacts() {
    return this.patientForm.get('emergencyContacts') as FormArray;
  }

  addContact() {
    this.emergencyContacts.push(
      this.formBuilder.group({
        relation: ['', Validators.required],
        name: ['', Validators.required],
        phone: ['', Validators.required],
      })
    );
  }

  getFormControl(controlName: string): FormControl | null {
    return this.patientForm.get(controlName) as FormControl | null;
  }

  removeContact(index: number) {
    this.emergencyContacts.removeAt(index);
  }

  onSubmit() {
    if (this.patientForm.valid) {
      let form = this.patientForm.value;

      let req = {
        id: this.idEdit,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        address: {
          address: form.addressLine1 + ' ' + form.addressLine2,
          city: form.city,
          state: form.state,
          postalCode: form.zipCode,
        },
      };

      this.commonService.updateItem(req);

      this.apiservice.addPatient(req).subscribe((res: any) => {
        this.commonService.updateList.next(res);
        this.patientForm.reset(); // Reset the form using reset() method
        this._snackBar.open('Patient Added Successfully 🎉', 'Ok', {
          duration: 3000,
          panelClass: ['snakbar-green'],
        });
      });
    } else {
      alert('The Data is Invalid');
    }
  }
}
