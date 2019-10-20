import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from './electron.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ElectronService,
    {
      provide: APP_INITIALIZER,
      useFactory: initModule,
      multi: true,
      deps: [
        ElectronService,
      ]
    },
  ]
})
export class MessagingModule { }

function initModule(
  elec: ElectronService,
): () => Promise<any> {
  return (): Promise<any> => {
    return Promise.resolve();
  };
}
