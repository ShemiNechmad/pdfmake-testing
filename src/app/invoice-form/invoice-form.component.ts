import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PdfService } from '../services/pdf.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit, OnDestroy {

  public invoiceForm!: FormGroup;
  public isExportDisabled: boolean = true;
  public isLoadingReq: boolean = false;
  private sub: Subscription = new Subscription();
  public monitor: string = '';

  constructor(private fb: FormBuilder, private pdfS: PdfService, private apiS: ApiService) { }

  ngOnInit(): void {
    this.buildForm();
    this.listenToFormChanges();
  }

  private buildForm(): void {
    this.invoiceForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      invoiceNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      invoiceDate: [new Date().toLocaleDateString('en-CA'), Validators.required],
      signature: ['']
    });
  }

  private listenToFormChanges(): void {
    this.sub.add(
      this.invoiceForm.valueChanges.subscribe((data: any) => {
        this.monitor = '';
        if (this.invoiceForm.valid) this.isExportDisabled = false;
        else this.isExportDisabled = true;
      })
    );
  }

  get form() {
    return this.invoiceForm.controls;
  }

  public async exportPDF(): Promise<void> {
    this.monitor = '';
    if (!this.form['signature'].value) {
      this.monitor = 'Please add a signature';
      return;
    }
    this.isExportDisabled = true;
    this.isLoadingReq = true;
    const blob: Blob = await this.pdfS.buildPDF(this.invoiceForm.value);
    const fileName = `Invoice_${this.form['invoiceNumber'].value}.pdf`;
    this.downloadFile(blob, fileName);
    this.apiS.sendFile(this.invoiceForm.value, blob, fileName).subscribe({
      next: (data: any[]) => {
        console.log(data);
        this.monitor = data[0].message + '. ' + data[1].message + '.';
        this.isExportDisabled = false;
        this.isLoadingReq = false;
      }
    });
  }

  private downloadFile(blob: Blob, fileName: string): void {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}


