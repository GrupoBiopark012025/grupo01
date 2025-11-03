import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserDataService } from "@data/user/user-data.service";
import { ValidationService } from "@shared/services/validation/validation.service";
import { ZardDialogService } from "@shared/components/zardui/dialog/dialog.service";
import { ZardDialogRef } from "@shared/components/zardui/dialog/dialog-ref";
import {
  SelectUserClientsDialogComponent
} from "@modules/user/select-user-clients-dialog/select-user-clients-dialog.component";
import {
  SelectUserSectorsDialogComponent
} from "@modules/user/select-user-sectors-dialog/select-user-sectors-dialog.component";
import {
  GetUserDto,
  userAccessLevelByString,
  UserAccessLevelEnum,
  userAccessLevelOptions,
  UserStatusEnum
} from "@data/user/dtos";
import { GetClientDto } from "@data/client/dtos";
import { GetSectorDto } from "@data/sector/dtos";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { toast } from "ngx-sonner";
import { ZardButtonComponent } from "@shared/components/zardui/button/button.component";
import { BackOrNavigateToDirective } from "@shared/directives/back-or-navigate-to/back-or-navigate-to.directive";
import { CheckboxComponent } from "@shared/components/base/form-components/checkbox/checkbox.component";
import { ZardFormMessageComponent } from "@shared/components/zardui/form/form.component";
import { JsonPipe, NgClass } from "@angular/common";
import { ZardBadgeComponent } from "@shared/components/zardui/badge/badge.component";
import { SelectComponent } from "@shared/components/base/form-components/select/select.component";
import { TextInputComponent } from "@shared/components/base/form-components/text-input/text-input.component";
import { PageHeaderComponent } from "@shared/components/base/page-header/page-header.component";

@Component({
  selector: 'app-user-form',
  imports: [
    ZardButtonComponent,
    BackOrNavigateToDirective,
    CheckboxComponent,
    ReactiveFormsModule,
    ZardFormMessageComponent,
    NgClass,
    ZardBadgeComponent,
    SelectComponent,
    TextInputComponent,
    PageHeaderComponent,
    JsonPipe
  ],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly userDataService = inject(UserDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly validationService = inject(ValidationService);
  private readonly dialogService = inject(ZardDialogService);

  private readonly _clientsModalRef = signal<ZardDialogRef<SelectUserClientsDialogComponent> | null>(null);
  private readonly _sectorsModalRef = signal<ZardDialogRef<SelectUserSectorsDialogComponent> | null>(null);

  private readonly _userId = signal<number | null>(null);
  private readonly _accessLevel = signal<UserAccessLevelEnum | null>(null);
  private readonly _primaryClient = signal<GetClientDto | null>(null);
  private readonly _selectedClients = signal<GetClientDto[]>([]);
  private readonly _selectedSectors = signal<GetSectorDto[]>([]);

  isEditMode = computed(() => !!this._userId());
  pageTitle = computed(() => this.isEditMode() ? 'Editar Usuário' : 'Registrar Usuário');
  submitButtonText = computed(() => this.isEditMode() ? 'Salvar Alterações' : 'Registrar');

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
    nome: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(255)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]), // Validação será ajustada no ngOnInit
    clienteId: this.fb.control<number | null>(null),
    accessLevel: this.fb.control<UserAccessLevelEnum | null>(null, [Validators.required]),
    isAdmin: this.fb.nonNullable.control(false),
    onlyAttachedTasks: this.fb.nonNullable.control(false),
    status: this.fb.nonNullable.control(UserStatusEnum.Ativo, [Validators.required]),
    userClienteIds: this.fb.control<number[] | null>(null),
    userSectorIds: this.fb.control<number[] | null>(null)
  });

  isAdminBehindTheScenes = computed(() => {
    const accessLevel = this._accessLevel();
    return accessLevel ? ![UserAccessLevelEnum.ColaboradorCliente].includes(accessLevel) : false;
  });

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this._userId.set(+userId);
      this.setupEditMode();
      this.loadUserData(+userId);
    }
  }

  ngOnDestroy() {
    this._clientsModalRef()?.close();
    this._sectorsModalRef()?.close();
  }

  private setupEditMode() {
    const passwordControl = this.form.controls.password;
    passwordControl.clearValidators();
    passwordControl.setValidators([Validators.minLength(6)]);
    passwordControl.updateValueAndValidity();
  }

  private loadUserData(id: number) {
    this.userDataService.getUserById(id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: GetUserDto) => {
          this.setAccessLevel(user.accessLevel);

          this.form.patchValue({
            nome: user.nome,
            email: user.email,
            clienteId: user.clienteId,
            password: '',
            accessLevel: user.accessLevel,
            isAdmin: user.isAdmin,
            onlyAttachedTasks: user.onlyAttachedTasks,
            status: user.status
          });

          const primaryClient = user.userClientes.find(uc => uc.id === user.clienteId) || null;

          this.onClientsSelected(primaryClient, user.userClientes || []);
          this.onSectorsSelected(user.sectors || []);

          this.form.updateValueAndValidity();
        },
        error: (e) => {
          toast.error("Falha ao carregar usuário.");
          this.router.navigate(['/users']);
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    // WARN: Isso é carnissa, fiz assim por uma limitação da lib (não ter select múltiplo)
    if (this.accessLevel() !== UserAccessLevelEnum.Admin && this.getClientsError()) {
      return;
    }

    const formValue = this.form.getRawValue();
    const payload = {
      ...formValue,
      clienteId: formValue.clienteId!,
      accessLevel: formValue.accessLevel!,
      userClienteIds: formValue.userClienteIds || [],
      userSectorIds: formValue.userSectorIds || []
    };

    if (this.isEditMode() && !payload.password) {
      delete (payload as any).password;
    }

    const request$ = this.isEditMode()
      ? this.userDataService.updateUser(this._userId()!, payload)
      : this.userDataService.createUser(payload);

    request$
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          toast.success(`Usuário ${this.isEditMode() ? 'atualizado' : 'registrado'} com sucesso!`);
          this.router.navigate(['/users']);
        },
        error: (e) => this.validationService.handleServerValidation(e)
      });
  }

  onAccessLevelChange(value: string) {
    const accessLevel = userAccessLevelByString[value];
    this.setAccessLevel(accessLevel);
  }

  private setAccessLevel(accessLevel: UserAccessLevelEnum) {
    this._accessLevel.set(accessLevel);

    if (accessLevel === UserAccessLevelEnum.Admin) {
      this.form.controls.isAdmin.setValue(true);
    } else {
      this.form.controls.isAdmin.setValue(false);
    }

    this.handleAccessLevelValidations(accessLevel);
    console.log('this form: ', this.form)
  }

  private handleAccessLevelValidations(accessLevel: UserAccessLevelEnum) {
    const formControls = this.form.controls;
    this.resetNotAdminFields();

    console.log('oi')

    console.log('accessLevel: ', accessLevel)

    switch (accessLevel) {
      case UserAccessLevelEnum.Admin:
        formControls.clienteId.clearValidators();
        formControls.userClienteIds.clearValidators();
        break;

      case UserAccessLevelEnum.Consultor:
      case UserAccessLevelEnum.GestorCliente:
        formControls.clienteId.setValidators([Validators.required]);
        formControls.userClienteIds.setValidators([Validators.required]);
        console.log('oi 2')
        break;

      case UserAccessLevelEnum.ColaboradorCliente:
        formControls.clienteId.setValidators([Validators.required]);
        formControls.userClienteIds.setValidators([Validators.required]);
        break;

      default:
        formControls.clienteId.clearValidators();
        formControls.userClienteIds.clearValidators();
        break;
    }

    formControls.clienteId.updateValueAndValidity();
    formControls.userClienteIds.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  private resetNotAdminFields() {
    this._primaryClient.set(null);
    this._selectedClients.set([]);
    this._selectedSectors.set([]);

    const formControls = this.form.controls;
    formControls.userSectorIds.reset();
    formControls.userClienteIds.reset();
    formControls.clienteId.reset();

    formControls.userClienteIds.clearValidators();

    this.form.updateValueAndValidity();
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

  private onSectorsSelected(selectedSectors: GetSectorDto[]) {
    this._selectedSectors.set(selectedSectors);
    this.form.controls.userSectorIds.setValue(
      selectedSectors.length ? selectedSectors.map(sector => sector.id) : null
    );
  }

  private onClientsSelected(primaryClient: GetClientDto | null, selectedClients: GetClientDto[]) {
    this._primaryClient.set(primaryClient);
    this._selectedClients.set(selectedClients);
    this.form.controls.clienteId.setValue(primaryClient ? primaryClient.id : null);
    this.form.controls.userClienteIds.setValue(
      selectedClients.length ? selectedClients.map((client) => client.id) : null
    );
  }

  getClientsError(): string {
    const primaryClient = this.form.controls.clienteId;
    const selectedClients = this.form.controls.userClienteIds;
    if (selectedClients.hasError('required')) {
      return 'É necessário informar ao menos um cliente para acesso.';
    }
    if (primaryClient.hasError('required')) {
      return 'É necessário informar um cliente principal.';
    }
    return '';
  }

  protected readonly userAccessLevelOptions = userAccessLevelOptions;
  protected readonly UserAccessLevelEnum = UserAccessLevelEnum;
}
