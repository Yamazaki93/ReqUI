import { Component } from '@angular/core';
import { ElectronService } from './messaging/electron.service';
import { LoadApplicationCommand } from '../../../load-application-command';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public constructor(
    private elec: ElectronService
  ) {
    elec.Send(new LoadApplicationCommand());
  }
}
