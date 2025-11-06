import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { SectorStatusEnum } from "@data/sector/dtos";
import { ActivatedRoute, Router } from "@angular/router";
import { toast } from "ngx-sonner";
import { PageHeaderComponent } from "@shared/components/base/page-header/page-header.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { BackOrNavigateToDirective } from "@shared/directives/back-or-navigate-to/back-or-navigate-to.directive";
import { TextInputComponent } from "@shared/components/base/form-components/text-input/text-input.component";

@Component({
  selector: 'app-sector-form',
  imports: [
    PageHeaderComponent,
    ZardButtonComponent,
    BackOrNavigateToDirective,
    ReactiveFormsModule,
    TextInputComponent
  ],
  templateUrl: './sector-form.component.html'
})
export class SectorFormComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private readonly _sectorId = signal<number | null>(null);

  isEditMode = computed(() => !!this._sectorId());
  pageTitle = computed(() => this.isEditMode() ? 'Editar Setor' : 'Registrar Setor');
  submitButtonText = computed(() => this.isEditMode() ? 'Salvar Alterações' : 'Registrar');

  form = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(255)]),
    acronym: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(3)]),
    description: this.fb.nonNullable.control('', [Validators.maxLength(500)]),
    status: this.fb.nonNullable.control(SectorStatusEnum.Ativo, [Validators.required]),
    color: this.fb.nonNullable.control('', [Validators.maxLength(7)])
  });

  ngOnInit() {
    const sectorId = this.route.snapshot.paramMap.get('id');
    const sectorIdNumber = Number(sectorId);

    if (sectorId) {
      if (isNaN(sectorIdNumber)) {
        this._sectorId.set(sectorIdNumber);
      } else {
        toast.error('ID do setor inválido.');
        this.router.navigate(['/sectors']);
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
  }
}
