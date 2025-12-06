import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router"; // 🚩 Importación necesaria

// Define los tipos posibles para 'tipo'
type TipoElemento = "Button" | "List" | "Normal";

// Interfaz para los subcampos
interface Subfield {
  code: string; // Ej: "a", "b", "c"
  description: string; // Ej: "Título propiamente dicho", "Mención de responsabilidad"
}

// Interfaz para cada objeto
interface RuleNorm {
  matTooltip: string;
  label: string;
  number: string;
  tipo: TipoElemento;
  iconButton?: string;
  // Opcional: Para una descripción completa de MARC 21
  indicators?: string[]; // Ej: ["Posición 1: No se define un Indicador", "Posición 2: Número de caracteres omitidos"]
  subfields?: Subfield[];
  isCustom?: boolean; // Nueva propiedad
}

// Intefaz para Tipos de documentos
interface TipoDocumento {
  value: string;
  viewValue: string;
  rules: string[];
}

// Interfaz mejorada para la cubierta
interface CoverData {
  file: File | any; // 'any' permite que sea File o nuestro mock object
  previewUrl: string | null;
}

@Component({
  selector: "app-catalogacion-cmp",
  // styles: [],
  templateUrl: "catalogacion.component.html",
})
export class CatalogacionComponent implements OnInit, AfterViewInit {
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];

  // Tipos de documentos
  typesDocs: TipoDocumento[] = [
    {
      value: "00",
      viewValue: "Libro/Monografía",
      rules: [
        "001",
        "003",
        "005",
        "008",
        "020",
        "100",
        "245",
        "250",
        "264",
        "300",
        "490",
        "500",
        "520",
        "650",
        "700",
        "940",
        "941",
      ],
    },
    {
      value: "01",
      viewValue: "Partitura impresa",
      rules: [
        "001",
        "003",
        "005",
        "008",
        "048",
        "100",
        "245",
        "254",
        "264",
        "300",
        "500",
        "650",
        "700",
      ],
    },
    {
      value: "02",
      viewValue: "Mapa/Atlas",
      rules: [
        "001",
        "003",
        "005",
        "008",
        "034",
        "255",
        "245",
        "264",
        "300",
        "500",
        "651",
        "700",
      ],
    },
    {
      value: "03",
      viewValue: "Video/Película",
      rules: [
        "001",
        "003",
        "005",
        "007",
        "008",
        "245",
        "264",
        "300",
        "538",
        "650",
        "700",
        "710",
      ],
    },
    {
      value: "04",
      viewValue: "Audiolibro",
      rules: [
        "001",
        "003",
        "005",
        "007",
        "008",
        "245",
        "264",
        "300",
        "538",
        "650",
        "700",
      ],
    },
    {
      value: "05",
      viewValue: "Música grabada",
      rules: [
        "001",
        "003",
        "005",
        "007",
        "008",
        "028",
        "245",
        "264",
        "300",
        "538",
        "650",
        "700",
      ],
    },
    {
      value: "07",
      viewValue: "Fotografía/Imagen",
      rules: [
        "001",
        "003",
        "005",
        "007",
        "008",
        "245",
        "264",
        "300",
        "500",
        "650",
        "700",
      ],
    },
    {
      value: "08",
      viewValue: "Recurso digital",
      rules: [
        "001",
        "003",
        "005",
        "006",
        "007",
        "008",
        "245",
        "264",
        "300",
        "538",
        "650",
        "856",
      ],
    },
    {
      value: "09",
      viewValue: "Kit educativo",
      rules: [
        "001",
        "003",
        "005",
        "007",
        "008",
        "245",
        "264",
        "300",
        "500",
        "650",
        "700",
        "710",
      ],
    },
    {
      value: "10",
      viewValue: "Objeto 3D",
      rules: [
        "001",
        "003",
        "005",
        "007",
        "008",
        "245",
        "264",
        "300",
        "500",
        "650",
        "700",
      ],
    },
    {
      value: "11",
      viewValue: "Manuscrito",
      rules: [
        "001",
        "003",
        "005",
        "007",
        "008",
        "245",
        "264",
        "300",
        "500",
        "541",
        "650",
        "700",
      ],
    },
    {
      value: "12",
      viewValue: "Gaceta oficial",
      rules: [
        "001",
        "003",
        "005",
        "008",
        "020",
        "100",
        "245",
        "250",
        "264",
        "300",
        "490",
        "500",
        "520",
        "650",
        "700",
        "942",
      ],
    },
    {
      value: "13",
      viewValue: "Material audiovisual",
      rules: [
        "001",
        "003",
        "005",
        "006",
        "007",
        "008",
        "245",
        "264",
        "300",
        "538",
        "650",
        "856",
        "940",
      ],
    },
  ];

  // Parte de las reglas MARC 21
  rulesMARC: RuleNorm[] = [
    {
      matTooltip: "Identificador único del registro dentro del sistema.",
      number: "001",
      label: "Número de Control",
      tipo: "Normal",
    },
    {
      matTooltip: "Código que identifica la agencia que creó el registro.",
      number: "003",
      label: "Código de Agencia",
      tipo: "Normal",
    },
    {
      matTooltip: "Fecha y hora de la última transacción del registro.",
      number: "005",
      label: "Fecha de Última Transacción",
      tipo: "Normal",
    },
    {
      matTooltip:
        "Información codificada sobre características especiales del material.",
      number: "006",
      label: "Campos Adicionales de Material",
      tipo: "Normal",
    },
    {
      matTooltip: "Información codificada sobre la forma física del material.",
      number: "007",
      label: "Campo de Física Fija",
      tipo: "Normal",
    },
    {
      matTooltip: "Información codificada de 40 caracteres sobre el registro.",
      number: "008",
      label: "Información Codificada",
      tipo: "Normal",
    },
    {
      matTooltip: "Número de control de la Biblioteca del Congreso (LC).",
      number: "010",
      label: "Número de Control LC",
      tipo: "Normal",
    },
    {
      matTooltip: "Número Estándar Internacional para Libros.",
      number: "020",
      label: "ISBN",
      tipo: "Button",
      iconButton: "search",
    },
    {
      matTooltip: "Número Estándar Internacional para Publicaciones Seriadas.",
      number: "022",
      label: "ISSN",
      tipo: "Normal",
    },
    {
      matTooltip: "Otros números normalizados (DOI, UPC, etc.).",
      number: "024",
      label: "Otros Números Normalizados",
      tipo: "Normal",
    },
    {
      matTooltip: "Número de editorial o disco.",
      number: "028",
      label: "Número de Editorial",
      tipo: "Normal",
    },
    {
      matTooltip: "Coordenadas matemáticas del mapa.",
      number: "034",
      label: "Coordenadas Cartográficas",
      tipo: "Normal",
    },
    {
      matTooltip: "Código de idioma del contenido.",
      number: "041",
      label: "Código de Idioma",
      tipo: "Normal",
    },
    {
      matTooltip: "Código de área geográfica.",
      number: "043",
      label: "Código Geográfico",
      tipo: "Normal",
    },
    {
      matTooltip: "Número de instrumentos o voces.",
      number: "048",
      label: "Número de Instrumentos",
      tipo: "Normal",
    },
    {
      matTooltip: "Número de clasificación de la Biblioteca del Congreso.",
      number: "050",
      label: "Clasificación LC",
      tipo: "Normal",
    },
    {
      matTooltip:
        "Número de clasificación de la Biblioteca Nacional de Medicina.",
      number: "060",
      label: "Clasificación NLM",
      tipo: "Normal",
    },
    {
      matTooltip: "Número de clasificación Decimal Dewey.",
      number: "082",
      label: "Clasificación Dewey",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada principal - Nombre personal.",
      number: "100",
      label: "Autor Personal",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada principal - Nombre corporativo.",
      number: "110",
      label: "Autor Corporativo",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada principal - Nombre de reunión/conferencia.",
      number: "111",
      label: "Autor Reunión",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada principal - Título uniforme.",
      number: "130",
      label: "Título Uniforme",
      tipo: "Normal",
    },
    {
      matTooltip: "Título principal del recurso.",
      number: "245",
      label: "Título",
      tipo: "Normal",
    },
    {
      matTooltip: "Mención de edición.",
      number: "250",
      label: "Edición",
      tipo: "Normal",
    },
    {
      matTooltip: "Presentación musical (clave, duración, etc.).",
      number: "254",
      label: "Presentación Musical",
      tipo: "Normal",
    },
    {
      matTooltip: "Información de distribución.",
      number: "262",
      label: "Distribución",
      tipo: "Normal",
    },
    {
      matTooltip: "Lugar, editor y fecha de publicación.",
      number: "264",
      label: "Publicación",
      tipo: "Normal",
    },
    {
      matTooltip: "Descripción física (páginas, ilustraciones, dimensiones).",
      number: "300",
      label: "Descripción Física",
      tipo: "Normal",
    },
    {
      matTooltip: "Información sobre series.",
      number: "490",
      label: "Series",
      tipo: "Normal",
    },
    {
      matTooltip: "Notas generales sobre el recurso.",
      number: "500",
      label: "Notas Generales",
      tipo: "Normal",
    },
    {
      matTooltip: "Notas sobre bibliografía.",
      number: "504",
      label: "Notas de Bibliografía",
      tipo: "Normal",
    },
    {
      matTooltip: "Notas sobre el contenido.",
      number: "505",
      label: "Notas de Contenido",
      tipo: "Normal",
    },
    {
      matTooltip: "Notas sobre restricciones de acceso.",
      number: "506",
      label: "Notas de Restricciones",
      tipo: "Normal",
    },
    {
      matTooltip: "Información sobre el elenco y producción.",
      number: "511",
      label: "Notas de Participantes",
      tipo: "Normal",
    },
    {
      matTooltip: "Resumen del contenido.",
      number: "520",
      label: "Resumen",
      tipo: "Normal",
    },
    {
      matTooltip: "Notas sobre audiencia.",
      number: "521",
      label: "Notas de Audiencia",
      tipo: "Normal",
    },
    {
      matTooltip: "Tipo de archivo y características.",
      number: "516",
      label: "Tipo de Archivo",
      tipo: "Normal",
    },
    {
      matTooltip: "Calidad y características de los datos.",
      number: "522",
      label: "Calidad de Datos",
      tipo: "Normal",
    },
    {
      matTooltip: "Información sobre procedencia y adquisición.",
      number: "541",
      label: "Notas de Adquisición",
      tipo: "Normal",
    },
    {
      matTooltip: "Información sobre la historia del manuscrito.",
      number: "561",
      label: "Notas de Propiedad",
      tipo: "Normal",
    },
    {
      matTooltip: "Notas sobre idioma.",
      number: "546",
      label: "Notas de Idioma",
      tipo: "Normal",
    },
    {
      matTooltip: "Notas sobre formato.",
      number: "538",
      label: "Notas de Sistema",
      tipo: "Normal",
    },
    {
      matTooltip: "Premios y reconocimientos.",
      number: "586",
      label: "Notas de Premios",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Nombre personal.",
      number: "600",
      label: "Materia Personal",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Nombre corporativo.",
      number: "610",
      label: "Materia Corporativo",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Nombre de reunión.",
      number: "611",
      label: "Materia Reunión",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Título uniforme.",
      number: "630",
      label: "Materia Título Uniforme",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Período cronológico.",
      number: "648",
      label: "Materia Cronológica",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Término temático.",
      number: "650",
      label: "Materia Temática",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Nombre geográfico.",
      number: "651",
      label: "Materia Geográfica",
      tipo: "Normal",
    },
    {
      matTooltip: "Materia - Forma/genre.",
      number: "655",
      label: "Materia Género/Forma",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada secundaria - Nombre personal.",
      number: "700",
      label: "Coautor Personal",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada secundaria - Nombre corporativo.",
      number: "710",
      label: "Coautor Corporativo",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada secundaria - Nombre de reunión.",
      number: "711",
      label: "Coautor Reunión",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada secundaria - Título uniforme.",
      number: "730",
      label: "Título Relacionado",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada secundaria - Título uniforme relacionado.",
      number: "740",
      label: "Título Adicional",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada de serie - Nombre personal.",
      number: "800",
      label: "Serie Personal",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada de serie - Nombre corporativo.",
      number: "810",
      label: "Serie Corporativo",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada de serie - Nombre de reunión.",
      number: "811",
      label: "Serie Reunión",
      tipo: "Normal",
    },
    {
      matTooltip: "Entrada de serie - Título uniforme.",
      number: "830",
      label: "Serie Uniforme",
      tipo: "Normal",
    },
    {
      matTooltip: "Información de acceso electrónico.",
      number: "856",
      label: "Acceso Electrónico",
      tipo: "Normal",
    },
    {
      matTooltip: "Número de la cota.",
      number: "940",
      label: "Cota",
      tipo: "Normal",
      isCustom: true, // Marca como regla personalizada
    },
    {
      matTooltip: "Persona o entidad que donó el material.",
      number: "941",
      label: "Donado por",
      tipo: "Normal",
      isCustom: true, // Marca como regla personalizada
    },
    {
      matTooltip: "Número de identificación específica de la Gaceta Oficial.",
      number: "942",
      label: "Número de Gaceta",
      tipo: "Normal",
      isCustom: true, // Marca como regla personalizada
    },
    {
      matTooltip:
        "Contiene los datos de volumen, número, y el rango de páginas del artículo para su rápida ubicación.",
      number: "943",
      label: "Localización del Artículo",
      tipo: "Normal",
      isCustom: true, // Marca como regla personalizada
    },
  ];

  covers: {
    portada: CoverData;
    lomo: CoverData;
    contraportada: CoverData;
  } = {
    portada: { file: null, previewUrl: null },
    lomo: { file: null, previewUrl: null },
    contraportada: { file: null, previewUrl: null },
  };

  // 1. Lista de tipos de documento que deben mostrar la carga de Portada, Lomo y Contraportada
  readonly COVER_REQUIRED_TYPES: string[] = ["00", "01", "02", "11"];
  // 2. Nueva propiedad para controlar la visibilidad en el HTML
  public showCoverInputs: boolean = false;

  // Nueva propiedad para el modo y los datos MARC (para vincular el formulario)
  public isEditMode: boolean = false;
  public marcData: { [key: string]: string } = {}; // Almacena los datos del registro

  // Referencias a los elementos input
  @ViewChild("portadaInput") portadaInput: ElementRef;
  @ViewChild("lomoInput") lomoInput: ElementRef;
  @ViewChild("contraportadaInput") contraportadaInput: ElementRef;

  docSelectInput: TipoDocumento | null = null;
  filteredRules: RuleNorm[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadDataForEditMode();
    // Si no es modo edición, inicializar para creación
    if (!this.isEditMode && !this.docSelectInput) {
      const defaultDocType = "00";
      // 🚩 CORRECCIÓN PARA MODO CREACIÓN:
      const defaultDoc = this.typesDocs.find((d) => d.value === defaultDocType);
      if (defaultDoc) {
        this.docSelectInput = defaultDoc;
        this.filterRules(defaultDocType); // O this.filterRules(defaultDoc.value);
      } else {
        console.error("Tipo de documento predeterminado no encontrado.");
      }
    }
  }

  ngAfterViewInit() {}

  /**
   * Función requerida por mat-select para comparar dos objetos TipoDocumento.
   * Esto asegura que el valor precargado (docSelectInput) coincida con un valor de la lista.
   */
  public compareTipoDocumento(
    o1: TipoDocumento | null,
    o2: TipoDocumento | null
  ): boolean {
    // Si uno de los valores es null/undefined, devuelve false
    if (!o1 || !o2) {
      return false;
    }
    // Compara solo por la propiedad 'value' (el código MARC: "00", "01", etc.)
    return o1.value === o2.value;
  }

  loadDataForEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const itemId = params.get("id");
      if (itemId) {
        this.isEditMode = true;
        const result = this.fakeAPICall(itemId);
        if (result) {
          const { docType, marcData, coversData } = result;
          // 🚩 PASO CLAVE PARA CORREGIR EL ERROR:
          // Buscar el objeto completo de TipoDocumento.
          const selectedDoc = this.typesDocs.find((d) => d.value === docType);
          if (selectedDoc) {
            // 1. Asignar el objeto completo (TipoDocumento) al input
            this.docSelectInput = selectedDoc;
            // 2. Cargar las reglas (filterRules sigue esperando el string value)
            this.filterRules(docType);
            // 3. Cargar datos MARC
            this.marcData = marcData;
            // 4. Precargar imágenes
            this.loadExistingCovers(coversData);
          } else {
            console.error(
              `Tipo de documento ${docType} no encontrado en la lista.`
            );
            this.isEditMode = false;
          }
        } else {
          // ... (lógica de no encontrado)
        }
      } else {
        // ... (lógica de modo creación)
      }
    });
  }

  private fakeAPICall(id: string): any {
    // --- Data del Libro de Prueba (ID: 123) ---
    if (id === "123") {
      const TEST_BOOK_DATA = {
        "001": "123",
        "003": "IAEPE",
        "005": "20251204163000.0", // Fecha y hora de última transacción (Falso)
        "008": "251204s2024____ve_|||||000|0|spa|d", // Información codificada
        "020": "978-980-00-1234-5", // ISBN
        "100": "^a Pérez, Juan ^e autor", // Autor Principal
        "245":
          "^a El Proceso Electoral Moderno: ^b Fundamentos y Desafíos. ^c por Juan Pérez y Ana Rodríguez.", // Título
        "246": "^a Proceso Electoral Moderno", // Título variante (si lo necesitas)
        "264": "^a Caracas : ^b Editorial IAEPE, ^c 2024.", // Publicación
        "300": "^a 450 p. : ^b il. ; ^c 24 cm.", // Descripción Física
        "520":
          "^a Este libro analiza las transformaciones en los sistemas electorales contemporáneos...", // Resumen
        "650": "^a Derecho Electoral", // Materia
        "700": "^a Rodríguez, Ana ^e coautor", // Entrada Secundaria
        "940": "DERECHO 342.7 P374e", // Cota de Ubicación (Campo local)
        "941": "Donado por el CNE - Lote 2024/05", // Fuente de Adquisición (Campo local)
      };
      const TEST_COVERS_DATA = {
        portadaUrl:
          "../assets/img/La divina comedia/cover.jfif", // URL de Portada
        lomoUrl:
          "../assets/img/La divina comedia/lomo.jfif", // URL de Lomo
        contraportadaUrl: null, // Sin Contraportada
      };

      return {
        docType: "00", // Código de 'Libro/Monografía'
        marcData: TEST_BOOK_DATA,
        coversData: TEST_COVERS_DATA,
      };
    }

    // Si se pasa cualquier otro ID, simula que no se encontró en la API.
    return null;
  }

  filterRules(selectedDoc): void {
    for (let i = 0; i < this.typesDocs.length; i++) {
      const typedoc = this.typesDocs[i];
      if (typedoc.value == selectedDoc) {
        this.filteredRules = [];
        typedoc.rules.forEach((rulesTypeDoc) => {
          this.rulesMARC.forEach((ruleMARC21) => {
            if (rulesTypeDoc == ruleMARC21.number) {
              this.filteredRules.push(ruleMARC21);
            }
          });
        });

        // 🚩 LÓGICA AGREGADA: Controlar la visibilidad de los inputs de imagen
        // Verifica si el tipo de documento seleccionado está en la lista de tipos que requieren cubiertas
        this.showCoverInputs = this.COVER_REQUIRED_TYPES.includes(selectedDoc);
        // Una vez que se encuentra el tipo, se puede salir del bucle
        return;
      }
    }
    // Si no se encuentra o no hay imagen seleccionadaa, oculta los inputs
    this.showCoverInputs = false;
  }

  // Funcionts for imagens ---------------------------------------------------
  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFile(input.files[0], type);
    }
  }
  onDrop(event: DragEvent, type: string): void {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length) {
      this.handleFile(event.dataTransfer.files[0], type);
    }
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  handleFile(file: File, type: string): void {
    // Validar tipo de archivo
    if (!file.type.match("image.*")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 5MB");
      return;
    }

    // Leer el archivo y crear la vista previa
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.covers[type].file = file;
      this.covers[type].previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  removeImage(type: string): void {
    this.covers[type].file = null;
    this.covers[type].previewUrl = null;
  }
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
  openFileSelector(type: string): void {
    switch (type) {
      case "portada":
        this.portadaInput.nativeElement.click();
        break;
      case "lomo":
        this.lomoInput.nativeElement.click();
        break;
      case "contraportada":
        this.contraportadaInput.nativeElement.click();
        break;
    }
  }

  /** 
   * Verificar si todas las imágenes están seleccionadas
  */
  allImagesSelected(): boolean {
    return (
      this.covers.portada.file &&
      this.covers.lomo.file &&
      this.covers.contraportada.file
    );
  }
  uploadImages(): void {
    // Aquí implementarías la lógica para subir las imágenes al servidor
    console.log("Subiendo imágenes:", this.covers);
    alert("Imágenes listas para subir. Revisa la consola para ver los datos.");
  }

  /**
   * Función pública para cargar las URLs existentes.
   * DEBES llamar a esta función cuando el componente cargue en modo edición.
   */
  public loadExistingCovers(data: {
    portadaUrl: string | null;
    lomoUrl: string | null;
    contraportadaUrl: string | null;
  }): void {
    this.preloadImage("portada", data.portadaUrl);
    this.preloadImage("lomo", data.lomoUrl);
    this.preloadImage("contraportada", data.contraportadaUrl);
  }

  private preloadImage(type: string, url: string | null): void {
    if (!url) return;
    // PASO CLAVE: Creamos un objeto que imita a un File, pero con un flag isMock
    // Esto evita errores al acceder a .name y .size en el HTML, y permite
    // que la lógica de subida sepa que no debe subir esta imagen de nuevo.
    const mockFile = {
      name: `Imagen Existente (${type})`,
      size: 1, // Tamaño mínimo (1 Byte) para que formatFileSize funcione
      isMock: true,
    };

    this.covers[type] = {
      file: mockFile,
      previewUrl: url, // La URL es la que se mostrará
    };
  }

  /**
   * Verifica si se ha seleccionado una imagen nueva (no pre-cargada)
   * para saber si debe habilitar el botón de subida.
   */
  canUploadNewImages(): boolean {
    // La condición es que el archivo exista Y que NO sea un archivo mock.
    const isNewFile = (cover: CoverData) =>
      cover.file && !(cover.file as any).isMock;

    // Retorna true solo si hay un archivo nuevo en portada, lomo, O contraportada.
    // Asumiendo que solo subes cuando *todas* están listas, si cambias la lógica
    // a "solo subir las nuevas", ajusta el `&&` a `||`.
    return (
      isNewFile(this.covers.portada) ||
      isNewFile(this.covers.lomo) ||
      isNewFile(this.covers.contraportada)
    );
  }
}
