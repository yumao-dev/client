import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'filter',
    // pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], callback: (item: any, arg: any) => boolean, arg?: Object): any {
        if (!items || !callback) {
            return items;
        }
        return items.filter(item => callback(item, arg));
    }
}

@Pipe({ name: 'get' })
export class GetPipe implements PipeTransform {
    transform(value: any, fn?: (i: any) => any) {
        return fn ? fn(value) : '未知参数';
    }
}