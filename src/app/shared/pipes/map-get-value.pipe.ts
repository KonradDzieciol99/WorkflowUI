import { Pipe, PipeTransform } from '@angular/core';
import { ITextIconPair } from '../models/ITextIconPair';

@Pipe({
  name: 'mapGetValue',
  pure: true
})
export class MapGetValuePipe<T> implements PipeTransform {
  transform(value: Map<T, ITextIconPair> | undefined, args: T) {
    
    if (!value) 
      return undefined;
    
    let mapValue = value.get(args)

    return mapValue;
  }
}
