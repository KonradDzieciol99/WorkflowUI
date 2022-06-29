import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs';
import { CreateTeamComponent } from 'src/app/components/dialogs/create-team/create-team.component';
import { Team } from 'src/app/models/Team.model';
import { TeamService } from 'src/app/services/team.service';


export interface EditUser {
  currentData?: Team;
  originalData: Team;
  editable: boolean;
  validator: FormGroup;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  newTeamName!: string;
//dialog

  ELEMENT_DATA_FROM_BACK: Team[] = [];

  ELEMENT_DATA: EditUser[] = [];

  displayedColumns: string[] = ['id', 'name','action'];

  dataSource!: MatTableDataSource<EditUser>;
  selected = 'option1';

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  editForm!: FormGroup;

  listofTeams!:Team[];

  //@ViewChild(MatTable) table: MatTable<string[]>;

  
  // constructor(private teamService: TeamService,public dialog: MatDialog) {
  //   const editForm = (e: Team) => new FormGroup({
  //     id: new FormControl(e.id,Validators.required),
  //     name: new FormControl(e.name,Validators.required),
  //   });
  //   this.GetTeams(editForm);
  // }
  editForm2!:any;
  constructor(private teamService: TeamService,public dialog: MatDialog, private route:Router) {
    const editForm = (e: Team) => new FormGroup({
      id: new FormControl(e.id,Validators.required),
      name: new FormControl(e.name,Validators.required),
    });
    this.editForm2=editForm;
  }



  ngOnInit() {

    this.teamService.existingTeams$.subscribe({
      next:(x:Team[])=>{
        this.ELEMENT_DATA_FROM_BACK=x;
        this.ELEMENT_DATA.splice(0);
        this.ELEMENT_DATA_FROM_BACK.forEach(element => {
          this.ELEMENT_DATA.push({currentData: element, 
                                  originalData: element, 
                                  editable: false, 
                                  validator: this.editForm2(element)});
                                  this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.slice());
                                  this.dataSource.paginator = this.paginator;
                                  this.dataSource.sort = this.sort;
                                  //this.table.renderRows();
                                  this.dataSource.filterPredicate = (data:EditUser, filterValue: string) => data.originalData.name.indexOf(filterValue) != -1;//filter neeed

        });

      },
      error: (v)=>console.log(v)
    });

  }

  GetTeams(editForm:any){

    // return this.teamService.GetAll().subscribe({next:(x:Team[])=>
    //   this.ELEMENT_DATA_FROM_BACK=x});
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue==null)
    {
      return;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteRow(index: number) {
    const data = this.dataSource.data;
    data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);

    this.dataSource.data = data;
  }

    confirmEditCreate(row: any) {
      row.editable = false;
      // save form control values to data object
      Object.keys(row.validator.controls).forEach(item => {
        row.currentData[item] = row.validator.controls[item].value;
      });
    }

    startEdit(row : any) {
      row.editable = true;
    }

    cancelOrDelete(row: any, i: any) {
      if (row.editable) {
        row.editable = false;
        // cancel - reset form control values to data object
        Object.keys(row.validator.controls).forEach(item => {
          row.validator.controls[item].patchValue(row.currentData[item]);
        });
      }
      else {
        // delete
        this.deleteRow(i);
      }
    }
    
    // GetTeams(editForm:any){
    //   this.teamService.GetAll().subscribe({
    //     next:(x:Team[])=>{
    //       this.ELEMENT_DATA_FROM_BACK=x;
    //       this.ELEMENT_DATA_FROM_BACK.forEach(element => {
    //         this.ELEMENT_DATA.push({currentData: element, 
    //                                 originalData: element, 
    //                                 editable: false, 
    //                                 validator: editForm(element)});
    //                                 this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.slice());
    //                                 this.dataSource.paginator = this.paginator;
    //                                 this.dataSource.sort = this.sort;
    //       });
        
    //     },
    //     error: (v)=>console.log(v)
    //   });
    //   // return this.teamService.GetAll().subscribe({next:(x:Team[])=>
    //   //   this.ELEMENT_DATA_FROM_BACK=x});
    // }

    // SelectTeam(row:any){
    //   this.teamService.sourceCurrentTeam.next(row.currentData);
    //   this.route.navigate(['/inside/dashboard']);
    // }
    addData()
    {
      this.openDialog();
    }
    openDialog(): void {
      const dialogRef = this.dialog.open(CreateTeamComponent, {
        width: '250px',
        data: {name: ""},
      });

      dialogRef.afterClosed().subscribe((teamName:string)=>{
        let team :Team ={ name:teamName};
        this.teamService.CreateTeam(team).subscribe()
      })
    }


}
