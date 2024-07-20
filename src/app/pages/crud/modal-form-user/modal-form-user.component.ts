import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../interface/user';

@Component({
  selector: 'app-modal-form-user',
  templateUrl: './modal-form-user.component.html',
  styleUrl: './modal-form-user.component.scss'
})
export class ModalFormUserComponent {
  planosSaude = [
    {
      id: 1,
      descricao: 'Plano 300 Enfermaria'
    },
    {
      id: 2,
      descricao: 'Plano 400 Enfermaria'
    },
    {
      id: 3,
      descricao: 'Plano 700 plus'
    }
  ]

  planosOdonto = [
    {
      id: 1,
      descricao: 'Plano Basic'
    },
    {
      id: 2,
      descricao: 'Plano Mediun'
    },
    {
      id: 3,
      descricao: 'Plano plus'
    }
  ]
  formUser!: FormGroup;
  userData: any = null;
  isEditarUser = false;

  constructor(
     public dialogRef: MatDialogRef<ModalFormUserComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private formBuilder: FormBuilder,
     private usersService: UsersService,
     private cdref: ChangeDetectorRef){
    this.formUser = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      sector: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      role: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      dentalPlan: new FormControl(''),
      healthPlan: new FormControl(''),
  });
  this.userData = data;
  }


  ngAfterViewInit() {
    if (this.userData !== null) {
      this.isEditarUser = true;
      this.fillForm();
    }
    this.cdref.detectChanges();
  }
  fillForm(){
    if (this.userData.firebaseId) {
      this.formUser.patchValue({
        name: this.userData.name,
        email: this.userData.email,
        sector: this.userData.sector,
        role: this.userData.role,
        dentalPlan: this.userData.dentalPlan,
        healthPlan: this.userData.healthPlan,
      })
    }
  }

  saveUser(){
    const dados: User = this.formUser.getRawValue();
    if (this.isEditarUser === true) {

      this.usersService.updateUser(this.userData.firebaseId, dados).then(
        (resp: any) =>{
          alert('Usuário editado com sucesso!')
          this.closeModal();

        }
      ).catch(
        err => {
          console.error(err)
        }
      )
    } else {
      this.usersService.addUser(dados).then(
        (resp: any) =>{
          alert('Usuário salvo com sucesso!')
          this.closeModal();

        }
      ).catch(
        err => {
          console.error(err)
        }
      )

    }

  }

  closeModal() {
    this.dialogRef.close();
  }

}
