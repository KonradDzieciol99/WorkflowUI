import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/models/Team.model';
import { concatWith, mergeMap, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeamComponent } from 'src/app/components/dialogs/create-team/create-team.component';
import { Router } from '@angular/router';


export interface EditUser {
  currentData?: Team;
  originalData: Team;
  editable: boolean;
  validator: FormGroup;
}

@Component({
  selector: 'app-teams-managment',
  templateUrl: './teams-managment.component.html',
  styleUrls: ['./teams-managment.component.css']
})
export class TeamsManagmentComponent implements OnInit {

  ELEMENT_DATA_FROM_BACK: Team[] = [];
  ELEMENT_DATA: EditUser[] = [];
  displayedColumns: string[] = ['name','action'];
  dataSource!: MatTableDataSource<EditUser>;
  selected = 'option1';

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  editForm!: FormGroup;

  editForm2!:any;
  constructor(private teamService: TeamService,public dialog: MatDialog, private route:Router) {
    const editForm = (e: Team) => new FormGroup({
      id: new FormControl(e.id,Validators.required),
      name: new FormControl(e.name,Validators.required),
    });
    this.editForm2=editForm;
  }

  ngOnInit() {

    this.teamService.GetAll().subscribe({
      next:(x:Team[])=>{
        this.ELEMENT_DATA_FROM_BACK=x;
        this.ELEMENT_DATA.splice(0);
        this.ELEMENT_DATA_FROM_BACK.forEach(element => {
        this.ELEMENT_DATA.push({currentData: element, 
                                originalData: element, 
                                editable: false, 
                                validator: this.editForm2(element)
                              });

                                  
        });
        //this.table.renderRows();
        // to było w push
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.slice());
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //
        this.dataSource.filterPredicate = (data:EditUser, filterValue: string) => data.originalData.name.indexOf(filterValue) != -1;//filter neeed

      },
      error: (v)=>console.log(v)
    });

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

  deleteRow(index: number,row:any) {

    const team:Team = row.currentData;
    this.teamService.DeleteTeam(team).subscribe(()=>{

      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;

      this.ELEMENT_DATA.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.filterPredicate = (data:EditUser, filterValue: string) => data.originalData.name.indexOf(filterValue) != -1;
      
      //this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.slice());
      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
      // let Teams:Team;
      // data.forEach(element => {
      //   console.log(element.originalData);
      // });
      //this.teamService.SetExistingTeams(data);
    })
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
        this.deleteRow(i,row);
      }
    }
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
        this.teamService.CreateTeam(team).subscribe((response:Team)=>{
          this.ELEMENT_DATA.push({
            currentData: response, 
            originalData: response, 
            editable: false, 
            validator: this.editForm2(response)
          });
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.slice());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (data:EditUser, filterValue: string) => data.originalData.name.indexOf(filterValue) != -1;
        })
      })
    }
}
