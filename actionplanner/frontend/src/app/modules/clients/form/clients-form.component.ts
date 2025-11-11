import { Component, EventEmitter, Output, inject, input, OnChanges, SimpleChanges } from '@angular/core'
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

  client = input<GetClientsDto | null>(null)
  mode = input<'view' | 'edit' | 'create'>('view')
  @Output() closed = new EventEmitter<boolean>()

  form = this.fb.group({
    nome: [''],
    cnpj: [''],
    endereco: [''],
    email: [''],
    telefone: ['']
  })

  ngOnChanges(changes: SimpleChanges) {
    const client = this.client()
    const mode = this.mode()

    if (changes['client'] && client) {
      this.form.patchValue({
        nome: client.nome ?? '',
        cnpj: client.cnpj ?? '',
        endereco: client.endereco ?? '',
        email: client.email ?? '',
        telefone: client.telefone ?? ''
      })
    }

    if (changes['mode']) {
      if (mode === 'view') this.form.disable()
      else this.form.enable()
    }
  }

  save() {
    const mode = this.mode()
    const client = this.client()

    if (mode === 'view') {
      this.closed.emit(false)
      return
    }

    const raw = this.form.getRawValue()
    const data = {
      ...raw,
      cnpj: raw.cnpj ? raw.cnpj.replace(/[^\d]/g, '') : undefined
    } as Partial<GetClientsDto>

    const req =
      mode === 'edit' && client
        ? this.clientsService.updateClient(client.id, data)
        : this.clientsService.createClient(data)

    req.subscribe(() => this.closed.emit(true))
  }

  cancel() {
    this.closed.emit(false)
  }
}
