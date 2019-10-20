import { ComponentRef } from '@angular/core';

export interface ITabEntry {
    component: ComponentRef<any>;
    id: string;
}
