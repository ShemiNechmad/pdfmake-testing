import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent {
  @Output() changeUrlData: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('signature') signaturePad!: SignaturePadComponent;

  signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 1,
    canvasWidth: 290,
    canvasHeight: 120
  };

  public onDrawStart(event: any): void {
    // console.log(event)
  }

  public onDrawEnd(event: any): void {
    const dataUrl = this.signaturePad.toDataURL();
    const sizeBytes = this.getDataUrlSize(dataUrl);
    const sizeKb = sizeBytes / 1024;

    if (sizeKb < 2) {
      this.changeUrlData.emit('');
    } else {
      this.changeUrlData.emit(dataUrl);
    }
  }

  private getDataUrlSize(dataUrl: string): number {
    const base64 = dataUrl.split(',')[1];
    return Math.ceil((base64.length * 3) / 4);
  }

  public clearSignature(): void {
    this.signaturePad.clear();
    this.changeUrlData.emit('');
  }

}
