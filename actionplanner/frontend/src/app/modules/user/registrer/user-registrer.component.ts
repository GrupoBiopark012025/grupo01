import { Component, computed, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { userAccessLevelByString, UserAccessLevelEnum, userAccessLevelOptions, UserStatusEnum } from "@data/user/dtos";
import { UserDataService } from "@data/user/user-data.service";
import { take, tap } from "rxjs";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { ValidationService } from "@shared/services/validation/validation.service";
import { Router } from "@angular/router";
import { toast } from "ngx-sonner";
import { PageHeaderComponent } from "@shared/components/base/page-header/page-header.component";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { BackOrNavigateToDirective } from "@shared/directives/back-or-navigate-to/back-or-navigate-to.directive";
import { TextInputComponent } from "@shared/components/base/form-components/text-input/text-input.component";
import { CheckboxComponent } from "@shared/components/base/form-components/checkbox/checkbox.component";
import { SelectComponent } from "@shared/components/base/form-components/select/select.component";
import { ZardDialogService } from "@shared/components/zardui/dialog/dialog.service";
import {
  SelectUserClientsDialogComponent
} from "@modules/user/select-user-clients-dialog/select-user-clients-dialog.component";
import { GetClientDto } from "@data/client/dtos";
import { ZardDialogRef } from "@shared/components/zardui/dialog/dialog-ref";
import { JsonPipe, NgClass } from "@angular/common";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { GetSectorDto } from "@data/sector/dtos";
import {
  SelectUserSectorsDialogComponent
} from "@modules/user/select-user-sectors-dialog/select-user-sectors-dialog.component";
import { ZardFormMessageComponent } from "@shared/components/zardui/form/form.component";

@Component({
  selector: 'app-user-registrer',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ZardButtonComponent,
    BackOrNavigateToDirective,
    TextInputComponent,
    CheckboxComponent,
    SelectComponent,
    JsonPipe,
    ZardBadgeComponent,
    NgClass,
    ZardFormMessageComponent
  ],
  templateUrl: './user-registrer.component.html'
})
export class UserRegistrerComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly userDataService = inject(UserDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly validationService = inject(ValidationService);
  private readonly dialogService = inject(ZardDialogService);

  private readonly _clientsModalRef = signal<ZardDialogRef<SelectUserClientsDialogComponent> | null>(null);
  private readonly _sectorsModalRef = signal<ZardDialogRef<SelectUserSectorsDialogComponent> | null>(null);

  private readonly _accessLevel = signal<UserAccessLevelEnum | null>(null);
  private readonly _primaryClient = signal<GetClientDto | null>(null);
  private readonly _selectedClients = signal<GetClientDto[]>([]);
  private readonly _selectedSectors = signal<GetSectorDto[]>([]);

  accessLevel = this._accessLevel.asReadonly();
  selectedSectors = this._selectedSectors.asReadonly();
  clientsWithPrimaryFirst = computed(() => {
    const primary = this._primaryClient();
    const selected = this._selectedClients();

    return selected
      .map(client => ({ ...client, isPrimary: client.id === primary?.id }))
      .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  });

  form = this.fb.nonNullable.group({
    nome: this.fb.nonNullable.control('', [Validators.required]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required]),
    clienteId: this.fb.control<number | null>(null, [Validators.required]),
    accessLevel: this.fb.control<UserAccessLevelEnum | null>(null, [Validators.required]),
    isAdmin: this.fb.nonNullable.control(false, [Validators.required]),
    onlyAttachedTasks: this.fb.nonNullable.control(false),
    status: this.fb.nonNullable.control(UserStatusEnum.Ativo, [Validators.required]),
    userClienteIds: this.fb.control<number[] | null>(null),
    sectorIds: this.fb.control<number[] | null>(null)
  });

  isAdminBehindTheScenes = computed(() => {
    const accessLevel = this._accessLevel();
    return accessLevel ? ![UserAccessLevelEnum.ColaboradorCliente].includes(accessLevel) : false;
  });

  constructor() {
    this.listenAccessLevelChange();
  }

  ngOnDestroy() {
    this._clientsModalRef()?.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    // WARN: Isso é carnissa, estou fazendo assim por uma limitação da lib (não ter select múltiplo)
    if (
      this.accessLevel() === UserAccessLevelEnum.ColaboradorCliente &&
      (this.getSectorsError() || this.getClientsError())
    ) {
      return;
    }

    const form = this.form.getRawValue();

    this.userDataService.createUser({
      ...form,
      clienteId: form.clienteId!,
      accessLevel: form.accessLevel!,
    })
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/users']);
          toast.success("Usuário registrado com sucesso!");
        },
        error: (e) => this.validationService.handleServerValidation(e)
      });
  }

  onAccessLevelChange(value: string) {
    const accessLevel = userAccessLevelByString[value];

    this._accessLevel.set(accessLevel);

    if (!(accessLevel === UserAccessLevelEnum.ColaboradorCliente)) {
      this.clearNotAdminFields();
    }
  }

  openSectorSelect() {
    const modalRef = this.dialogService.create({
      zTitle: 'Selecionar Setores',
      zContent: SelectUserSectorsDialogComponent,
      zOnOk: (component) => this.onSectorsSelected(component.selectedSectors())
    });

    const component = modalRef.componentInstance;
    component?.carregarDados({ selectedSectors: this._selectedSectors() });

    this._sectorsModalRef.set(modalRef);
  }

  openClientSelect() {
    const modalRef = this.dialogService.create({
      zTitle: 'Selecionar Clientes',
      zContent: SelectUserClientsDialogComponent,
      zOnOk: (component) => this.onClientsSelected(component.primaryClient(), component.selectedClients())
    });

    const component = modalRef.componentInstance;
    component?.carregarDados({ primaryClient: this._primaryClient(), selectedClients: this._selectedClients() });

    this._clientsModalRef.set(modalRef);
  }

  getClientsError(): string {
    const primaryClient = this.form.controls.clienteId;
    const selectedClients = this.form.controls.userClienteIds;

    if (primaryClient?.hasError('required')) {
      return 'É necessário informar um cliente principal.';
    }

    if (selectedClients?.hasError('required')) {
      return 'É necessário informar ao menos um cliente para acesso.';
    }

    return '';
  }

  getSectorsError(): string {
    const primaryClient = this.form.controls.sectorIds;

    if (primaryClient?.hasError('required')) {
      return 'É necessário informar ao menos um setor.'
    }

    return '';
  }

  private clearNotAdminFields() {
    this._primaryClient.set(null);
    this._selectedClients.set([]);
    this._selectedSectors.set([]);

    const formControls = this.form.controls;
    formControls.sectorIds.reset();
    formControls.userClienteIds.reset();
    formControls.clienteId.reset();
  }

  private onSectorsSelected(selectedSectors: GetSectorDto[]) {
    this._selectedSectors.set(selectedSectors);

    this.form.controls.sectorIds.setValue(
      selectedSectors.length
        ? selectedSectors.map(sector => sector.id)
        : null
    )
  }

  private onClientsSelected(primaryClient: GetClientDto | null, selectedClients: GetClientDto[]) {
    this._primaryClient.set(primaryClient);
    this._selectedClients.set(selectedClients);

    this.form.controls.clienteId.setValue(primaryClient ? primaryClient.id : null);
    this.form.controls.userClienteIds.setValue(
      selectedClients.length
        ? selectedClients.map((client) => client.id)
        : null
    );
  }

  private listenAccessLevelChange() {
    toObservable(this._accessLevel)
      .pipe(
        tap((accessLevel) => {
          const { userClienteIds, sectorIds } = this.form.controls;

          sectorIds.clearValidators();
          userClienteIds.clearValidators();

          switch (accessLevel) {
            case UserAccessLevelEnum.Consultor:
              sectorIds.setValidators(Validators.required);
              userClienteIds.setValidators(Validators.required);
              break;

            case UserAccessLevelEnum.GestorCliente:
            case UserAccessLevelEnum.ColaboradorCliente:
              userClienteIds.setValidators(Validators.required);
              break;

            case UserAccessLevelEnum.Admin:
              break;
          }

          this.form.updateValueAndValidity();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected readonly userAccessLevelOptions = userAccessLevelOptions;
}
