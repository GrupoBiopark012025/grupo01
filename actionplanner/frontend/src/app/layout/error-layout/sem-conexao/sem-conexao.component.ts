import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { tap } from "rxjs";
import { toast } from "ngx-sonner";

@Component({
  selector: 'app-sem-conexao',
  templateUrl: './sem-conexao.component.html',
})
export class SemConexaoComponent  implements OnInit {

  private _redirectTo = signal<string>('/');
  redirectTo = this._redirectTo.asReadonly();

  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route
      .queryParams
      .pipe(
        tap((params) => this._redirectTo.set(params['redirectTo'] ?? '/')),
        tap(() => toast.dismiss()),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
  }
}
