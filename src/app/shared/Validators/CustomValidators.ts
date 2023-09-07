import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IAppTask, Priority, State } from '../models/IAppTask';
import { IProjectMember } from '../models/IProjectMember';
import { isEqual } from 'lodash';

export class CustomValidators {
  static minimumDateNgb(minDate: NgbDateStruct): ValidatorFn {
    return (
      control: AbstractControl<NgbDateStruct>,
    ): ValidationErrors | null => {
      const controlDate = new Date(
        control.value.year,
        control.value.month,
        control.value.day,
        0,
        0,
        0,
        0,
      );

      const test = Date.parse(controlDate.toString());
      if (isNaN(test)) return null;

      const minDateTime = new Date(
        minDate.year,
        minDate.month,
        minDate.day,
        0,
        0,
        0,
        0,
      );
      const result =
        controlDate >= minDateTime ? null : { minimumDateNgb: control.value };
      return result;
    };
  }
  static checkDateOrder(): ValidatorFn {
    return (
      control: AbstractControl<{
        dueDate: NgbDateStruct;
        startDate: NgbDateStruct;
      }>,
    ): ValidationErrors | null => {
      const dueDate = control.get('dueDate')?.value;
      if (!dueDate) return null;

      const dueDateDate = new Date(
        dueDate.year,
        dueDate.month,
        dueDate.day,
        0,
        0,
        0,
        0,
      );
      const dueDateDatetest = Date.parse(dueDateDate.toString());
      if (isNaN(dueDateDatetest)) return null;

      const startDate = control.get('startDate')?.value;
      if (!startDate) return null;

      const startDateDate = new Date(
        startDate.year,
        startDate.month,
        startDate.day,
        0,
        0,
        0,
        0,
      );
      const startDateDatetest = Date.parse(startDateDate.toString());
      if (isNaN(startDateDatetest)) return null;

      const result =
        dueDateDate > startDateDate ? null : { checkDateOrder: true };

      return result;
    };
  }
  static requiredUpdate(initialAppTask:IAppTask): ValidatorFn {
    return (
      control: AbstractControl<{
        id: string
        name: string
        description: string
        projectId: string
        state: State
        priority: Priority
        dueDate: NgbDateStruct
        startDate: NgbDateStruct
        assignee: IProjectMember | undefined
        leader: IProjectMember | undefined
      }>,
    ): ValidationErrors | null => {

      initialAppTask.taskAssignee = initialAppTask.taskAssignee ?? undefined;
      initialAppTask.taskAssigneeMemberId = initialAppTask.taskAssigneeMemberId ?? undefined;

      let IAppTask:IAppTask = {
        id: control.value.id,
        name: control.value.name,
        description: control.value.description,
        projectId: control.value.projectId,
        priority: control.value.priority,
        state:control.value.state,
        dueDate:  this.mapNgbDateStructToDate(control.value.dueDate),
        startDate: this.mapNgbDateStructToDate(control.value.startDate),
        taskLeaderId:control.value.leader?.id,
        taskLeader: control.value.leader,
        taskAssigneeMemberId: control.value.assignee?.id  ?? undefined ,
        taskAssignee:control.value.assignee ?? undefined ,
      }


      const result = isEqual(initialAppTask, IAppTask)  ? { requiredUpdate: "no changes have been made" } : null;
      
      return result
    };
  }
  private static mapNgbDateStructToDate(date: NgbDateStruct): Date {
    
    const mapedDate = new Date(
      date.year,
      date.month,
      date.day,
      0,0,0,0
    );
    // const mapedDate = new Date(
    //   date.year,
    //   date.month - 1,
    //   date.day
    // );

    return mapedDate;
  }
}
