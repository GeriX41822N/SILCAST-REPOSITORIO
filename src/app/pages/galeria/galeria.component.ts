import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

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
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
  imports: [CommonModule] // Agrega CommonModule al array de imports
})
export class GaleriaComponent implements OnInit {
  galleryData: GallerySection[] = [];
  showCarousel = false;
  selectedSection: string | null = null;
  currentImageIndex = 0;

  ngOnInit(): void {
    this.loadGalleryData();
    this.loadSavedGalleryData(); // Intentar cargar datos guardados
  }

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

  loadSavedGalleryData(): void {
    const savedData = localStorage.getItem('galleryData');
    if (savedData) {
      this.galleryData = JSON.parse(savedData);
    }
  }

  saveGalleryData(): void {
    localStorage.setItem('galleryData', JSON.stringify(this.galleryData));
  }

  openCarousel(sectionKey: string, index: number): void {
    this.selectedSection = sectionKey;
    this.currentImageIndex = index;
    this.showCarousel = true;
  }

  closeCarousel(): void {
    this.showCarousel = false;
    this.selectedSection = null;
    this.currentImageIndex = 0;
  }

  nextImage(): void {
    if (!this.selectedSection) return;
    const section = this.galleryData.find(s => s.key === this.selectedSection);
    if (section && this.currentImageIndex < section.images.length - 1) {
      this.currentImageIndex++;
    } else if (section && this.currentImageIndex === section.images.length - 1) {
      this.currentImageIndex = 0; // Volver a la primera imagen
    }
  }

  prevImage(): void {
    if (!this.selectedSection) return;
    const section = this.galleryData.find(s => s.key === this.selectedSection);
    if (section && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else if (section && this.currentImageIndex === 0) {
      this.currentImageIndex = section.images.length - 1; // Ir a la última imagen
    }
  }

  uploadImages(event: any, sectionKey: string): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const sectionIndex = this.galleryData.findIndex(s => s.key === sectionKey);
      if (sectionIndex !== -1) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const imageUrl = `/assets/images/${sectionKey}/${file.name}`;
          this.galleryData[sectionIndex].images.push({ url: imageUrl, alt: file.name });
        }
        this.saveGalleryData(); // Guardar los datos actualizados en localStorage
        console.log('Imágenes agregadas:', this.galleryData);
      }
    }
  }
}
