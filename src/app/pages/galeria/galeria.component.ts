import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImageData {
  url: string;
  alt: string;
}

interface GallerySection {
  key: string;
  title: string;
  description: string;
  images: ImageData[];
}

@Component({
  selector: 'app-galeria',
  standalone: true, // Asegúrate de que sea standalone si tu proyecto lo requiere
  imports: [
    CommonModule,
    // FormsModule // Ya no es necesario
  ],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent implements OnInit {
  galleryData: GallerySection[] = []; // Lista de secciones de galería con imágenes
  showCarousel = false; // Controla la visibilidad del carrusel
  selectedSection: string | null = null; // Clave de la sección seleccionada para el carrusel
  currentImageIndex = 0; // Índice de la imagen actual en el carrusel

  // constructor(private authService: AuthService) {}
   constructor() {} // Constructor simple

  ngOnInit(): void {
    // Cargar los datos de la galería al inicializar el componente
    this.loadGalleryData();
    // Eliminamos loadSavedGalleryData() ya que no usaremos localStorage para la carga
  }

  // Carga los datos de la galería (imágenes hardcodeadas por ahora)
  loadGalleryData(): void {
    this.galleryData = [
      {
        key: 'gruas',
        title: 'Grúas',
        description: 'Descubre nuestra flota de grúas de alto rendimiento para todo tipo de proyectos.',
        images: [
          { url: '/assets/images/gruas/imagen1.jpg', alt: 'Imagen 1 Grúas' },
          { url: '/assets/images/gruas/imagen2.jpg', alt: 'Imagen 2 Grúas' },
          { url: '/assets/images/gruas/imagen3.jpg', alt: 'Imagen 3 Grúas' },
          { url: '/assets/images/gruas/imagen4.jpg', alt: 'Imagen 4 Grúas' },
          { url: '/assets/images/gruas/imagen5.jpg', alt: 'Imagen 5 Grúas' }
        ]
      },
      {
        key: 'servicios-industriales',
        title: 'Servicios Industriales',
        description: 'Amplia gama de servicios industriales especializados para optimizar tus operaciones.',
        images: [
          { url: '/assets/images/industriales/imagen1.jpg', alt: 'Imagen 1 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen2.jpg', alt: 'Imagen 2 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen3.jpg', alt: 'Imagen 3 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen4.jpg', alt: 'Imagen 4 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen5.jpg', alt: 'Imagen 5 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen6.jpg', alt: 'Imagen 6 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen7.jpg', alt: 'Imagen 7 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen8.jpg', alt: 'Imagen 8 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen9.jpg', alt: 'Imagen 9 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen10.jpg', alt: 'Imagen 10 Servicios Industriales' },
          { url: '/assets/images/industriales/imagen11.jpg', alt: 'Imagen 11 Servicios Industriales' }
        ]
      }
    ];
  }


  // Abre el carrusel en una sección y con una imagen específica
  openCarousel(sectionKey: string, index: number): void {
    this.selectedSection = sectionKey;
    this.currentImageIndex = index;
    this.showCarousel = true;
  }

  // Cierra el carrusel
  closeCarousel(): void {
    this.showCarousel = false;
    this.selectedSection = null;
    this.currentImageIndex = 0;
  }

  // Muestra la siguiente imagen en el carrusel
  nextImage(): void {
    if (!this.selectedSection) return;
    const section = this.galleryData.find(s => s.key === this.selectedSection);
    if (section && this.currentImageIndex < section.images.length - 1) {
      this.currentImageIndex++;
    } else if (section && this.currentImageIndex === section.images.length - 1) {
      this.currentImageIndex = 0; // Volver a la primera imagen al llegar al final
    }
  }

  // Muestra la imagen anterior en el carrusel
  prevImage(): void {
    if (!this.selectedSection) return;
    const section = this.galleryData.find(s => s.key === this.selectedSection);
    if (section && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else if (section && this.currentImageIndex === 0) {
      this.currentImageIndex = section.images.length - 1; // Ir a la última imagen al llegar al inicio
    }
  }

}
