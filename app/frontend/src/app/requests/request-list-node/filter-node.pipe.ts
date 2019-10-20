import { Pipe, PipeTransform } from '@angular/core';
import { IRequestTreeEntry } from '../requests.service';
@Pipe({
    name: 'nodeFilter'
})
export class NodeFilterPipe implements PipeTransform {
    transform(items: IRequestTreeEntry[], currentType: string, hideIncompatible: boolean): any[] {
        if (!items) { return []; }
        return items.filter(it => {
            return !it.request || (it.request.Type) === currentType || !hideIncompatible;
        });
    }
}
