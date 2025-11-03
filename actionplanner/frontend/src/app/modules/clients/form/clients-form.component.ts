import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ClientsDataService } from '@data/clients/clients-data.service'
import { GetClientsDto } from '@data/clients/dtos'

@Component({
  selector: 'app-clients-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients-form.component.html'
})
export class ClientsFormComponent implements OnChanges {
  private fb = inject(FormBuilder)
  private clientsService = inject(ClientsDataService)

  @Input() client?: GetClientsDto | null = null
  @Input() mode: 'edit' | 'view' = 'edit'
  @Output() closed = new EventEmitter<boolean>()

  form = this.fb.group({
    nome: [''],
    cnpj: [''],
    endereco: [''],
    email: [''],
    telefone: ['']
  })

  ngOnChanges(changes: SimpleChanges) {
    if (changes['client'] && this.client) {
      this.form.patchValue({
        nome: this.client.nome ?? '',
        cnpj: this.client.cnpj ?? '',
        endereco: this.client.endereco ?? '',
        email: this.client.email ?? '',
        telefone: this.client.telefone ?? ''
      })
    }

    if (changes['mode']) {
      if (this.mode === 'view') this.form.disable()
      else this.form.enable()
    }
  }

  save() {
    if (this.mode === 'view') {
      this.closed.emit(false)
      return
    }

    const raw = this.form.getRawValue()
    const data = {
      ...raw,
      cnpj: raw.cnpj ? raw.cnpj.replace(/[^\d]/g, '') : undefined
    } as Partial<GetClientsDto>

    const req =
      this.mode === 'edit' && this.client
        ? this.clientsService.updateClient(this.client.id, data)
        : this.clientsService.createClient(data)

    req.subscribe(() => this.closed.emit(true))
  }

  cancel() {
    this.closed.emit(false)
  }
}
