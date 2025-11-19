import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { SectorStatusEnum } from "@data/sector/dtos";
import { ActivatedRoute, Router } from "@angular/router";
import { toast } from "ngx-sonner";
import { PageHeaderComponent } from "@shared/components/base/page-header/page-header.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { BackOrNavigateToDirective } from "@shared/directives/back-or-navigate-to/back-or-navigate-to.directive";
import { TextInputComponent } from "@shared/components/base/form-components/text-input/text-input.component";
import { TextAreaComponent } from "@shared/components/base/form-components/text-area/text-area.component";
import { SectorDataService } from "@data/sector/sector-data.service";
import { ValidationService } from "@shared/services/validation/validation.service";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-sector-form',
  imports: [
    PageHeaderComponent,
    ZardButtonComponent,
    BackOrNavigateToDirective,
    ReactiveFormsModule,
    TextInputComponent,
    TextAreaComponent
  ],
  templateUrl: './sector-form.component.html'
})
export class SectorFormComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly validationService = inject(ValidationService);
  private readonly sectorDataService = inject(SectorDataService);

  private readonly _sectorId = signal<number | null>(null);

  isEditMode = computed(() => !!this._sectorId());
  pageTitle = computed(() => this.isEditMode() ? 'Editar Setor' : 'Registrar Setor');
  submitButtonText = computed(() => this.isEditMode() ? 'Salvar Alterações' : 'Registrar');

  form = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(255)]),
    acronym: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(5)]),
    description: this.fb.nonNullable.control('', [Validators.maxLength(160)]),
    status: this.fb.nonNullable.control(SectorStatusEnum.Ativo, [Validators.required]),
    color: this.fb.nonNullable.control('', [Validators.maxLength(7)])
  });

  ngOnInit() {
    const sectorId = this.route.snapshot.paramMap.get('id');
    const sectorIdNumber = Number(sectorId);

    if (sectorId) {
      if (isNaN(sectorIdNumber)) {
        toast.error('ID do setor inválido.');
        this.router.navigate(['/sectors']);
      } else {
        this._sectorId.set(sectorIdNumber);
        this.loadSectorData(sectorIdNumber);
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();

    const request$ = this.isEditMode()
      ? this.sectorDataService.updateSector(this._sectorId()!, formValue)
      : this.sectorDataService.createSector(formValue);

    request$
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(`Setor ${this.isEditMode() ? 'atualizado' : 'registrado'} com sucesso!`);
          this.router.navigate(['/sectors']);
        },
        error: (e) => this.validationService.handleServerValidation(e)
      });
  }

  private loadSectorData(sectorId: number) {
    this.sectorDataService.getSectorById(sectorId)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (sector) => {
          this.form.patchValue({
            name: sector.name,
            acronym: sector.acronym,
            description: sector.description || '',
            status: sector.status,
            color: sector.color || ''
          });
        },
        error: () => {
          toast.error('Falha ao carregar dados do setor.');
          this.router.navigate(['/sectors']);
        }
      });
  }
}
