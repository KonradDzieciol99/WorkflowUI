import { Pipe, PipeTransform } from '@angular/core';
import { IProjectMember, ProjectMemberType } from 'src/app/shared/models/IProjectMember';

@Pipe({
  name: 'findLeader',
  pure: true
})
export class FindLeaderPipe implements PipeTransform {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: IProjectMember[], ...args: unknown[]): IProjectMember | undefined {
    return value.find(x=>x.type===ProjectMemberType.Leader);
  }

}
