import { ModalFormUserComponent } from './modal-form-user/modal-form-user.component';
import { User } from './../../interface/user';
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../../services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalViewUserComponent } from './modal-view-user/modal-view-user.component';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss',
})
export class CrudComponent {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = [
    'firebaseId',
    'name',
    'email',
    'role',
    'benefits',
    'action',
  ];
  dataSource: any;
  listUsers: User[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private usersService: UsersService,
    private cdref: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe({
      next: (response: any) => {
        this.listUsers = response;
        this.dataSource = new MatTableDataSource(this.listUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel='Itens por páginas'
        this.cdref.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteUser(id: string) {
this.usersService.deleteUser(id)
.then(
  (resp: any) =>{
    alert('Usuário Deletado com sucesso!');

  }
)
.catch(
  err => {
    console.error(err)
  }
);
  }

  openModalViewUser(user: User) {
    const dialogRef = this.dialog.open(ModalViewUserComponent, {
      width: '700px',
      height: '320px',
      data: user,
    });
  }
  openModalAddUser() {
    const dialogRef = this.dialog.open(ModalFormUserComponent, {
      width: '700px',
      height: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllUsers();
    });
  }

  openModalEditUser(user: User){
    const dialogRef = this.dialog.open(ModalFormUserComponent, {
      width: '700px',
      height: '500px',
      data: user,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllUsers();
    });
  }
}
