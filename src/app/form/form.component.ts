import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  paises: string[] = [];
  provincias: string[] = [];
  registros: any[] = []; // Lista de registros para la tabla
  displayedColumns: string[] = [
    'nombre',
    'apellido',
    'telefono',
    'email',
    'pais',
    'provincia',
  ];

  nuevoRegistro = {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    pais: '',
    provincia: '',
  };

  isMobile = false;

  ngOnInit() {
    this.cargarPaises();
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 900; // Si es menor de 600px, usa tarjetas en vez de tabla
  }

  async cargarPaises() {
    try {
      const response = await fetch(
        'https://countriesnow.space/api/v0.1/countries/flag/unicode'
      );
      const data = await response.json();

      // Ordenar los países alfabéticamente
      this.paises = data.data
        .map((pais: any) => pais.name)
        .sort((a: string, b: string) => a.localeCompare(b));
    } catch (error) {
      console.error('Error al cargar países:', error);
    }
  }

  async cargarProvincias() {
    if (!this.nuevoRegistro.pais) return;

    try {
      const response = await fetch(
        'https://countriesnow.space/api/v0.1/countries/states',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: this.nuevoRegistro.pais }),
        }
      );
      const data = await response.json();
      this.provincias = data.data.states.map(
        (provincia: any) => provincia.name
      );
    } catch (error) {
      console.error('Error al cargar provincias:', error);
    }
  }

  agregarRegistro() {
    // Verificar si los campos obligatorios están llenos
    if (
      !this.nuevoRegistro.nombre ||
      !this.nuevoRegistro.apellido ||
      !this.nuevoRegistro.email
    ) {
      alert('Por favor, complete los campos obligatorios.');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.nuevoRegistro.email)) {
      alert('El formato del email no es válido.');
      return;
    }

    // Agregar registro a la tabla
    this.registros = [...this.registros, { ...this.nuevoRegistro }];

    // Limpiar formulario después de añadir
    this.nuevoRegistro = {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      pais: '',
      provincia: '',
    };
  }
}
