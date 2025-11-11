import { Component, EventEmitter, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ClientsDataService } from '@data/clients/clients-data.service'

@Component({
  selector: 'app-create-client-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-client-modal.component.html'
})
export class CreateClientModalComponent {
  private fb = inject(FormBuilder)
  private clientsService = inject(ClientsDataService)
  @Output() closed = new EventEmitter<boolean>()

  serverError = ''

  form = this.fb.nonNullable.group({
    nome: this.fb.nonNullable.control('', Validators.required),
    cnpj: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.control(''),
    telefone: this.fb.control(''),
    endereco: this.fb.control(''),
    sectorId: this.fb.control<number | null>(null)
  })

  save() {
    this.serverError = ''

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const raw = this.form.getRawValue()
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v === null ? undefined : v])
    )

    this.clientsService.createClient(data).subscribe({
      next: () => this.closed.emit(true),
      error: err => {
        this.serverError = err?.error?.message || 'Erro ao salvar cliente.'
      }
    })
  }

  cancel() {
    this.closed.emit(false)
  }
}
