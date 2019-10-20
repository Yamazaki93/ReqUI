import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MonacoEditorComponent } from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @Input() options = { theme: 'vs-dark', language: 'json' };
  @Input() set code(v: string) {
    if (v !== this.codeValue) {
      this.codeChange.emit(v);
    }
    this.codeValue = v;
  }
  get code() {
    return this.codeValue;
  }
  @Output() codeChange = new EventEmitter<string>();
  @Output() actionTriggered = new EventEmitter();
  @ViewChild('editor') editor: MonacoEditorComponent;
  private codeValue = '';
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      if (this.editor.editor) {
        this.editor.editor.onKeyDown(($event) => {
          if ($event.code === 'Enter' && $event.ctrlKey) {
            this.actionTriggered.emit();
            $event.stopPropagation();
            $event.preventDefault();
            return false;
          } else {
            return true;
          }
        });
      }
    }, 2000);
  }
}
