import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { ConocenosComponent } from './components/conocenos/conocenos.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SingledishComponent } from './components/singledish/singledish.component';
import { CreatenewdishComponent } from './components/createnewdish/createnewdish.component';
import { EditdishComponent } from './components/editdish/editdish.component';
import { CreatemenuComponent } from './components/createmenu/createmenu.component';
import { EditmenuComponent } from './components/editmenu/editmenu.component';
import { ReservasadminComponent } from './components/reservasadmin/reservasadmin.component';
import { UserinfoAdminComponent } from './components/userinfo-admin/userinfo-admin.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "menu", component: MenuComponent},
    {path: "conocenos", component: ConocenosComponent},
    {path: "contacto", component: ContactoComponent},
    {path: "reservas", component: ReservasComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dish/:id', component: SingledishComponent},
    {path: 'create-dish', component: CreatenewdishComponent, canActivate: [authGuard]},
    {path: 'edit-dish/:id', component: EditdishComponent, canActivate: [authGuard]},
    {path: 'create-menu', component: CreatemenuComponent, canActivate: [authGuard]},
    {path: 'edit-menu/:id', component: EditmenuComponent,  canActivate: [authGuard]},
    {path: 'reservas-admin', component: ReservasadminComponent},
    {path: 'reservas-admin/:username', component: UserinfoAdminComponent},
    {path: "**", redirectTo: "",}


];
