import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss']
})
export class PreguntasFrecuentesComponent {
  searchTerm: string = '';
  selectedCategory: string = 'todas';

  condiciones = [
    {
      pregunta: '¿Están las Salas de Ventas de todo Chile?',
      respuesta: 'Sí, se encuentran publicadas las joyas y objetos varios de todas las sucursales de la Dirección General de Crédito Prendario (DICREP).',
      categoria: 'productos',
      abierto: false
    },
    {
      pregunta: '¿Debo acudir personalmente o puedo mandar a un representante?',
      respuesta: 'Existe la opción de designar un representante para que acuda a evaluar la joya o el objeto.',
      categoria: 'compras',
      abierto: false
    },
    {
      pregunta: '¿Puedo comprar en línea?',
      respuesta: 'En una primera etapa no está disponible esta opción, próximamente se implementará la opción de realizar la compra online.',
      categoria: 'compras',
      abierto: false
    },
    {
      pregunta: '¿Cuánto dura la reserva?',
      respuesta: 'La duración de la reserva se extiende hasta el final de la hora de atención de público del día hábil siguiente a la realización de ésta.',
      categoria: 'reservas',
      abierto: false
    },
    {
      pregunta: '¿Puedo anular la reserva?',
      respuesta: 'Sí, existe la opción de anular la reserva en la página web de la venta Online.',
      categoria: 'reservas',
      abierto: false
    },
    {
      pregunta: '¿Todos los productos de la sala de ventas son usados?',
      respuesta: 'Sí, todos los productos son usados y han sido revisados por técnicos especializados. La descripción completa de los ítems refleja la evaluación de los técnicos.',
      categoria: 'productos',
      abierto: false
    },
    {
      pregunta: '¿Es posible tomar una reserva por un plazo distinto?',
      respuesta: 'No, la página solo permite reservar por un día hábil, pero eso no limita para acudir a la Sala de Ventas de manera presencial.',
      categoria: 'reservas',
      abierto: false
    },
    {
      pregunta: '¿Necesito reservar para acudir a una Sala de Ventas?',
      respuesta: 'No, puede acudir a la Sala de Ventas de manera presencial en cualquier fecha que desee, ya que reservar no es un requisito.',
      categoria: 'reservas',
      abierto: false
    },
    {
      pregunta: '¿Debo llevar impreso el código?',
      respuesta: 'No, puede mostrar en la pantalla de su celular el código al encargado cuando acuda a la sucursal.',
      categoria: 'reservas',
      abierto: false
    },
    {
      pregunta: '¿Qué significa que un objeto esté reservado en la web?',
      respuesta: 'Significa que otro usuario ya ha reservado el objeto. Le invitamos a seguir atento y visitar nuevamente la página para constatar si el ítem que le interesa queda nuevamente disponible.',
      categoria: 'reservas',
      abierto: false
    },
    {
      pregunta: '¿Estoy obligado a comprar si reservo?',
      respuesta: 'No, la reserva solo asegura que cuando visite la sucursal el objeto no habrá sido vendido previamente, dándole la oportunidad de evaluar su compra.',
      categoria: 'reservas',
      abierto: false
    }
  ];

  filteredCondiciones = [...this.condiciones];

  toggleQuestion(index: number): void {
    // Cerrar todas las demás preguntas
    this.filteredCondiciones.forEach((item, i) => {
      if (i !== index) {
        item.abierto = false;
      }
    });
    
    // Toggle la pregunta seleccionada
    this.filteredCondiciones[index].abierto = !this.filteredCondiciones[index].abierto;
  }

  filterQuestions(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    this.filteredCondiciones = this.condiciones.filter(item => {
      const matchSearch = !term || 
        item.pregunta.toLowerCase().includes(term) || 
        item.respuesta.toLowerCase().includes(term);
      
      const matchCategory = this.selectedCategory === 'todas' || 
        item.categoria === this.selectedCategory;
      
      return matchSearch && matchCategory;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterQuestions();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'todas';
    this.filteredCondiciones = [...this.condiciones];
  }
}