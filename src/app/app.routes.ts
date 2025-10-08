import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { CartComponent } from './features/cart/components/cart/cart.component';
//import { LoginComponent } from './features/auth/login/components/login/login.component';
import {ProductDetailComponent} from '../app/features/products/components/product-detail/product-detail.component';
import { CallbackComponent } from './features/callback/callback.component';
import { PreguntasFrecuentesComponent } from './features/preguntas/components/preguntas-frecuentes/preguntas-frecuentes.component';
import { EconomiaCircComponent } from './features/economia-circ/components/economia-circ/economia-circ.component';
import { NosotrosComponent } from './features/nosotros/components/nosotros/nosotros.component';

export const routes: Routes = [
 { path: '', component: HomeComponent }, // Ruta por defecto (Home)
  {path: 'callback', component:  CallbackComponent},
  {path: 'preguntas-frecuentes', component: PreguntasFrecuentesComponent},
  {path: 'economia-circular', component: EconomiaCircComponent},
  {path: 'nosotros', component: NosotrosComponent},

  //{ path: 'login', component: LoginComponent }, // Ruta de login,
  { path: 'cart', component: CartComponent }, // Ruta del carrito
  { path: 'salir', component: HomeComponent }, // Ruta del carrito
  { path: 'productdetail/:id', component: ProductDetailComponent }, //ruta para detalle de producto
  { path: '**', redirectTo: '' }, // Ruta comodín para manejar rutas no encontradas
  { path: '**', redirectTo: '/', pathMatch: 'full' } // Manejo de rutas no encontradas
];


