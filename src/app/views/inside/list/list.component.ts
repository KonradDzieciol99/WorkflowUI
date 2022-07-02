import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs';
import { CreateTeamComponent } from 'src/app/components/dialogs/create-team/create-team.component';
import { PTask } from 'src/app/models/PTask.model';
import { Team } from 'src/app/models/Team.model';
import { PTaskService } from 'src/app/services/ptask.service';
import { TeamService } from 'src/app/services/team.service';


export interface EditUser {
  currentData?: PTask;
  originalData: PTask;
  editable: boolean;
  validator: FormGroup;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  ELEMENT_DATA_FROM_BACK: PTask[] = [];
  ELEMENT_DATA: EditUser[] = [];
  displayedColumns: string[] = ['id','startDate','endDate','title','description','priorityId','stateId','teamId','action'];
  dataSource!: MatTableDataSource<EditUser>;
  selected = 'option1';

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  editForm!: FormGroup;

  editForm2!:any;
  currentTeam: Team;
  constructor(private pTaskService: PTaskService,private teamService: TeamService,public dialog: MatDialog, private route:Router) {
    const editForm = (e: PTask) => new FormGroup({
      id: new FormControl(e.id,Validators.required),
      startDate: new FormControl(e.startDate,Validators.required),
      endDate: new FormControl(e.endDate,Validators.required),
      title: new FormControl(e.title,Validators.required),
      description: new FormControl(e.description,Validators.required),
      priorityId: new FormControl(e.priorityId,Validators.required),
      stateId: new FormControl(e.stateId,Validators.required),
      teamId: new FormControl(e.teamId,Validators.required),
    });
    this.editForm2=editForm;
  }

  ngOnInit() {
    //this.editForm2.get('id').valueChanges.debounceTime(400).subscribe(value => {console.log()})

    

    this.teamService.currentTeam$.subscribe(res=>{this.currentTeam=res;});
    //this.pTaskService.GetAllByTeamId(this.currentTeam.id).subscribe(res=>{console.log(res)})

    this.pTaskService.GetAllByTeamId(this.currentTeam.id).subscribe({
      next:(x:PTask[])=>{
        this.ELEMENT_DATA_FROM_BACK=x;
        this.ELEMENT_DATA.splice(0);
        this.ELEMENT_DATA_FROM_BACK.forEach(element => {
          console.log(element)
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
        this.dataSource.filterPredicate = (data:EditUser, filterValue: string) => data.originalData.title.indexOf(filterValue) != -1;//filter neeed

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

    // const team:PTask = row.currentData;
    // this.teamService.DeleteTeam(team).subscribe(()=>{

    //   const data = this.dataSource.data;
    //   data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
    //   this.dataSource.data = data;

    //   this.ELEMENT_DATA.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
    //   this.dataSource.filterPredicate = (data:EditUser, filterValue: string) => data.originalData.name.indexOf(filterValue) != -1;
    // })
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
      //this.openDialog();
    }
    openDialog(): void {
      // const dialogRef = this.dialog.open(CreateTeamComponent, {
      //   width: '250px',
      //   data: {name: ""},
      // });

      // dialogRef.afterClosed().subscribe(
      //   (teamName:string)=>{
      //   let team :PTask ={ name:teamName};
      //   this.teamService.CreateTeam(team).subscribe((response:PTask)=>{
      //     this.ELEMENT_DATA.push({
      //       currentData: response, 
      //       originalData: response, 
      //       editable: false, 
      //       validator: this.editForm2(response)
      //     });
      //     this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.slice());
      //     this.dataSource.paginator = this.paginator;
      //     this.dataSource.sort = this.sort;
      //     this.dataSource.filterPredicate = (data:EditUser, filterValue: string) => data.originalData.name.indexOf(filterValue) != -1;
      //   })
      // })
    }

}
