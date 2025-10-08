import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @Input() items: { image: string, buttonText: string, link: string} [] = [] //Recibe los items a mostrar, es reutilizable.
  // Recibe los items a mostrar, es reutilizable.
  @Input() carouselId: string = 'carouselExampleAutoplaying'; // ID único para el carrusel

  
}
