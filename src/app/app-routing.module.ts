import { NgModule  } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AtualizarComponent } from "./components/atualizar/atualizar.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { RegistrarComponent } from "./components/registrar/registrar.component";

const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/inicio', 
        pathMatch:'full' 
    },
    { 
        path: 'inicio',
        component: InicioComponent
    },
    { 
        path: 'novo',
        component: RegistrarComponent
    },
    { 
        path: 'editar/:id',
        component: AtualizarComponent
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}