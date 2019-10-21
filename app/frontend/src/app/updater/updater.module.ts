import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdaterService } from './updater.service';
import { MessagingModule } from '../messaging/messaging.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MessagingModule
  ],
  providers: [
    UpdaterService,
    {
      provide: APP_INITIALIZER,
      useFactory: initModule,
      multi: true,
      deps: [
        UpdaterService,
      ]
    },
  ]
})
export class UpdaterModule { }

function initModule(
  us: UpdaterService,
): () => Promise<any> {
  return (): Promise<any> => {
    us.init();
    return Promise.resolve();
  };
}
