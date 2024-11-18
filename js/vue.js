const { createApp } = Vue;

createApp({
    data() {
        return {
            pasajero: {
                nombre: "",
                pasaporte: "",
                fechaNacimiento: "",
                nacionalidad: "",
            },
            vuelo: {
                tipoViaje: "",
                origen: "",
                destino: "",
                fechaSalida: "",
                fechaRegreso: null,
                clase: "",
                numeroBoletos: 1,
            },
            pago: {
                numeroTarjeta: '',
                tipoTarjeta: 'Card',
                fechaVencimiento: "",
                cvv: "",
                titular: "",
            },
            imagenesTarjetas: {
                Card: "https://img.icons8.com/ios/50/bank-card-front-side--v1.png",
                Visa: "img/visa.png",
                Mastercard: "img/mastercard.png",
                AmericanExpress: "img/american.png",
            },
            paises: [],
            clases: ["Ejecutiva", "Economica", "Primera Clase"],
            aeropuertos: [],
            mostrarModal: false,

            validaciones: {
                nombre: null,
                pasaporte: null,
                fechaNacimiento: null,
                nacionalidad: null,
                origen: null,
                destino: null,
                fechaSalida: null,
                fechaRegreso: null,
                numeroBoletos: null,
                clase: null,
                numeroTarjeta: null,
                fechaVencimiento: null,
                cvv: null,
                titular: null,
            },
            mensajeErrorGlobal: "Deshabilitado hasta que todos los campos estén completos y validados correctamente",
            mensajesError: {
                nombre: "",
                pasaporte: "",
                fechaNacimiento: "",
                nacionalidad: "",
                origen: "",
                destino: "",
                fechaSalida: "",
                fechaRegreso: '',
                numeroBoletos: "",
                clase: "",
                numeroTarjeta: "",
                fechaVencimiento: "",
                cvv: "",
                titular: "",
            },

        };
    },
    computed: {
        formularioValido() {
            /* console.log(this.validaciones); */
            // Si el viaje es "Solo ida", ignora fechaRegreso
            const validFechaRegreso = this.vuelo.tipoViaje === "2" ? this.validaciones.fechaRegreso : true;

            // Valida todos los campos y la fecha de regreso si aplica
            return (
                Object.values(this.validaciones).every((value) => value === true) &&
                validFechaRegreso
            );
        },

        /**
        Calcula el precio total del vuelo en función de la clase seleccionada y el número de billetes.
        El precio base está determinado por la clase de vuelo: 'Economica', 'Ejecutiva' o 'Primera Clase'.
        Si no se selecciona ninguna clase, el precio base por defecto es 0.
    
        @returns {number} El precio total calculado como el precio base multiplicado por la cantidad de boletos.
        */
        precioTotal() {
            const preciosPorClase = {
                'Economica': 10000,
                'Ejecutiva': 40000,
                'Primera Clase': 100000,
            };
            const precioBase = preciosPorClase[this.vuelo.clase] || 0;
            return precioBase * this.vuelo.numeroBoletos;
        }
    },
    mounted() {
        this.cargarPaises();
        this.cargarAeropuertos();
    },

    methods: {

        cargarPaises() {
            fetch("data/paises.json")
                .then((response) => response.json())
                .then((data) => {
                    this.paises = data;
                })
                .catch((error) => {
                    console.error("Error al cargar los datos", error);
                });
        },
        cargarAeropuertos() {
            fetch("data/aeropuertos.json")
                .then((response) => response.json())
                .then((data) => {
                    this.aeropuertos = data;
                })
                .catch((error) => {
                    console.error("Error al cargar los datos", error);
                });
        },

        /**
         * Devuelve un objeto con las clases CSS para el campo especificado en 
         * "field". El objeto tiene dos propiedades: "is-invalid" y "is-valid". La 
         * primera se utiliza cuando el campo no es válido y la segunda cuando es 
         * válido.
         * 
         * @param {string} field - El nombre del campo a validar.
         * @returns {object} Un objeto con las clases CSS para el campo.
         */
        getClass(field) {
            return {
                'is-invalid': this.validaciones[field] === false,
                'is-valid': this.validaciones[field] === true,
            };
        },

        /**
         * Devuelve un objeto con las clases CSS para el feedback del campo
         * especificado en "field". El objeto tiene dos propiedades:
         * "invalid-feedback" y "valid-feedback". La primera se utiliza cuando
         * el campo no es válido y la segunda cuando es válido.
         * 
         * @param {string} field - El nombre del campo a validar.
         * @returns {object} Un objeto con las clases CSS para el feedback del
         * campo.
         */
        getClassFeedback(field) {
            return {
                'invalid-feedback': this.validaciones[field] === false,
                'valid-feedback': this.validaciones[field] === true,
            };
        },
        /* 
                submitForm(event) {
        
                    event.preventDefault();
        
                    let fechaSalida = this.validateFecha('fechaSalida');
                    let fechaRegreso = this.vuelo.tipoViaje === '2' ? this.validateFecha('fechaRegreso') : true;
        
                    const esValido =
                        this.validateNombre() &&
                        this.validatePasaporte() &&
                        this.validateFechaNacimiento() &&
                        this.validateNacionalidad() &&
                        this.validateCiudad('origen') &&
                        this.validateCiudad('destino') &&
                        fechaSalida && fechaRegreso &&
                        this.validateTarjeta() &&
                        this.validateFechaVencimiento() &&
                        this.validateCVV() &&
                        this.validateNombreTarjeta() &&
                        this.validateNumeroBoletos();
        
                  
                },
         */

        validateNombre() {
            let regex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
            let nombre = this.pasajero.nombre.trim();

            if (nombre.length === 0) {
                this.validaciones.nombre = false;
                this.mensajesError.nombre = 'Campo obligatorio.';
                return;
            }

            if (!regex.test(nombre)) {
                this.validaciones.nombre = false;
                this.mensajesError.nombre = 'El nombre solo puede contener letras y espacios.';
                return;
            }

            if (nombre.length < 3) {
                this.validaciones.nombre = false;
                this.mensajesError.nombre = 'El nombre debe tener al menos 3 caracteres.';
                return;
            }

            this.mensajeExito('nombre', '¡Correcto!');
        },

        validatePasaporte() {
            /*Valida el número de pasaporte del pasajero. El pasaporte debe tener 3 letras seguidas de 6 números.*/
            let pasaporte = this.pasajero.pasaporte.trim();
            let regex = /^[a-zA-Z]{3}[0-9]{6}$/;

            if (!regex.test(pasaporte)) {
                this.validaciones.pasaporte = false;
                this.mensajesError.pasaporte = 'El pasaporte debe tener 3 letras seguidas de 6 números.';
                return;
            }

            this.mensajeExito('pasaporte', '¡Correcto!');
        },

        validateFechaNacimiento() {
            let regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            let fechaNacimiento = this.pasajero.fechaNacimiento.trim();

            if (fechaNacimiento.length === 0) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Campo obligatorio.';
                return;
            }

            if (!regexFecha.test(fechaNacimiento)) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Ingresa una fecha válida.';
                return;
            }

            let partesFecha = fechaNacimiento.split('/');
            let dia = parseInt(partesFecha[0]);
            let mes = parseInt(partesFecha[1]);
            let anio = parseInt(partesFecha[2]);


            if (anio < 1900) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Ingresa una fecha válida.';
                return;
            }

            let fechaActual = new Date();
            let fechaNacimientoObj = new Date(anio, mes - 1, dia);

            if (fechaNacimientoObj > fechaActual) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'La fecha de nacimiento no puede ser en el futuro.';
                return;
            }

            
            /* 
            let fechaNacimiento = new Date(this.pasajero.fechaNacimiento);
            let fechaActual = new Date();

            let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

            let mes = fechaActual.getMonth() - fechaNacimiento.getMonth();

            if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }

            if (isNaN(fechaNacimiento.getTime()) || edad > 110) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = "Ingresa una fecha válida.";
                return;
            }

            if (edad < 18) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = "Debes tener al menos 18 años.";
                return;
            } */

            this.mensajeExito('fechaNacimiento', '¡Correcto!');
        },

        validateNacionalidad() {

            if (this.pasajero.nacionalidad === "") {
                this.validaciones.nacionalidad = false;
                this.mensajesError.nacionalidad = "Debes seleccionar un pais.";
                return;
            }

            this.mensajeExito('nacionalidad', '');
        },


        /**
         * Maneja el cambio en el tipo de viaje (ida o ida y vuelta).
         *  Segun el tipo de viaje se establece el estado de validación y mensajes de error correspondientes para la fecha de regreso.
         */
        checkTipoViaje() {
            this.validaciones.fechaRegreso == this.vuelo.tipoViaje === "2" ? null : true;
            this.vuelo.fechaRegreso = null;
            this.mensajesError.fechaRegreso = "";
        },


        validateCiudad(field) {

            if (this.vuelo[field] === "") {
                this.validaciones[field] = false;
                this.mensajesError[field] = `Debes seleccionar una ciudad de ${field}.`;
                return;
            }

            if (this.vuelo.origen === this.vuelo.destino) {
                this.validaciones[field] = false;
                this.mensajesError[field] = "La ciudad de origen y destino deben ser diferentes.";
                return;
            }

            this.mensajeExito(field, '¡Correcto!');
        },


        validateFecha(field) {

            let fecha = new Date(this.vuelo[field]);

            if (isNaN(fecha.getTime())) {
                this.validaciones[field] = false;
                this.mensajesError[field] = "Ingresa una fecha válida.";
                return;
            }

            let fechaActual = new Date();
            let anoDespues = new Date();

            anoDespues.setFullYear(anoDespues.getFullYear() + 1);

            // Normaliza las horas para comparar solo las fechas
            fecha.setHours(0, 0, 0, 0);
            fechaActual.setHours(0, 0, 0, 0);

            if (fecha < fechaActual) {
                this.validaciones[field] = false;
                this.mensajesError[field] =
                    field === "fechaSalida"
                        ? "La fecha de salida debe ser igual o posterior a la fecha actual."
                        : "La fecha de regreso debe ser posterior a la fecha de salida.";
                return;
            }

            if (fecha > anoDespues) {
                this.validaciones[field] = false;
                this.mensajesError[field] = 'La fecha debe estar dentro de los próximos 12 meses.';
                return;
            }


            if (field === "fechaRegreso" && this.vuelo.fechaRegreso) {
                let fechaSalida = new Date(this.vuelo.fechaSalida);
                if (fecha < fechaSalida) {
                    this.validaciones.fechaRegreso = false;
                    this.mensajesError.fechaRegreso =
                        "La fecha de regreso debe ser posterior a la fecha de salida.";
                    return;
                }
            }

            this.mensajeExito(field, '¡Correcto!');
        },

        /**
       * Valida la clase seleccionada por el usuario.
       * Debe ser una clase diferente a "".
       */

        validateClase() {
            if (this.vuelo.clase === "") {
                this.validaciones.clase = false;
                this.mensajesError.clase = "Debes seleccionar una clase.";
                return;
            }

            this.mensajeExito('clase', '¡Correcto!');
        },

        /* Valida el numero de boletos ingresado por el usuario.
         Debe ser un número entre 1 y 10. */
        validateBoletos() {
            let boletos = parseInt(this.vuelo.numeroBoletos, 10);

            if (isNaN(boletos)) {
                this.validaciones.numeroBoletos = false;
                this.mensajesError.numeroBoletos = "Ingrese un número.";
                return;
            }

            if (boletos < 1 || boletos > 10) {
                this.validaciones.numeroBoletos = false;
                this.mensajesError.numeroBoletos = boletos > 10 ? "Máximo: 10 boletos" : "Minimo: 1 boleto";
                return;
            }

            this.validaciones.numeroBoletos = true;
            this.mensajesError.numeroBoletos = "";
        },

        incrementarBoletos() {
            let boletos = parseInt(this.vuelo.numeroBoletos, 10);

            if (isNaN(boletos)) {
                this.vuelo.numeroBoletos = 1;
            } else if (boletos < 10) {
                this.vuelo.numeroBoletos = boletos + 1;
            }

            this.validateBoletos();
        },

        decrementarBoletos() {
            let boletos = parseInt(this.vuelo.numeroBoletos, 10);

            if (isNaN(boletos)) {
                this.vuelo.numeroBoletos = 1;
            } else if (boletos > 1) {
                this.vuelo.numeroBoletos = boletos - 1;
            }

            this.validateBoletos();
        },

        validateTarjeta() {
            let numero = this.pago.numeroTarjeta;

            if (numero === "") {
                this.pago.tipoTarjeta = 'Card';
                this.validaciones.numeroTarjeta = false;
                this.mensajesError.numeroTarjeta = 'Debe tener 15 o 16 dígitos.';
                return;
            }

            const visaRegex = /^4\d{15}$/;  // Visa: 16 dígitos que comienzan con 4
            const masterCardRegex = /^5\d{15}$/;  // MasterCard: 16 dígitos que comienzan con 5
            const amexRegex = /^(34|37)\d{13}$/; // American Express: 15 dígitos que comienzan con 34 o 37

            
            if (visaRegex.test(numero)) {
                this.pago.tipoTarjeta = 'Visa';
                this.validaciones.numeroTarjeta = true;
                this.mensajesError.numeroTarjeta = '';
                return;
            } else if (masterCardRegex.test(numero)) {
                this.pago.tipoTarjeta = 'Mastercard';
                this.validaciones.numeroTarjeta = true;
                this.mensajesError.numeroTarjeta = '';
                return;
            } else if (amexRegex.test(numero)) {
                this.pago.tipoTarjeta = 'AmericanExpress';
                this.validaciones.numeroTarjeta = true;
                this.mensajesError.numeroTarjeta = '';
                return;
            } else {
                this.pago.tipoTarjeta = 'Card';
                this.validaciones.numeroTarjeta = false;
                this.mensajesError.numeroTarjeta = 'Formato de tarjeta inválido.';
            }
        },

        validarNumero(event) {
            // previene la entrada si la tecla presionada no es un número
            if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
            }
        },

        validarFecha(event) {
            //permite solo numeros y /
            if (!/[0-9/]/.test(event.key)) {
                event.preventDefault();
            }
        },

        /**
         * Valida la fecha de vencimiento de la tarjeta.
         *
         * Este método verifica si la fecha de vencimiento ingresada
         * está en el formato válido 'MM/AA' y si la fecha de vencimiento
         * es posterior a la fecha actual. Actualiza el estado de
         * validación y mensajes de error correspondientes.
         *
         * Si el formato de fecha es incorrecto, establece un mensaje de
         * error indicando el formato no válido.
         * Si la fecha de vencimiento es anterior a la fecha actual,
         * establece un mensaje de error indicando que la fecha de
         * vencimiento debe estar en el futuro.
         *
         * Actualizaciones:
         * - `this.validaciones.fechaVencimiento`: Booleano que indica
         *    si la fecha de vencimiento es válida.
         * - `this.mensajesError.fechaVencimiento`: String con el
         *    mensaje de error correspondiente.
         */
        validateFechaVencimiento() {
            const fechaVencimiento = this.pago.fechaVencimiento;
            const regexFecha = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

            if (!regexFecha.test(fechaVencimiento)) {
                this.validaciones.fechaVencimiento = false;
                this.mensajesError.fechaVencimiento = "Formato inválido (MM/AA)";
                return;
            }

            const [_, mes, año] = fechaVencimiento.match(regexFecha);
            const fechaActual = new Date();
            const añoActual = fechaActual.getFullYear() % 100; // Últimos dos dígitos del año
            const mesActual = fechaActual.getMonth() + 1; // Enero es 0

            if (
                parseInt(año) > añoActual ||
                (parseInt(año) === añoActual && parseInt(mes) >= mesActual)
            ) {
                this.validaciones.fechaVencimiento = true;
                this.mensajesError.fechaVencimiento = "";
            } else {
                this.validaciones.fechaVencimiento = false;
                this.mensajesError.fechaVencimiento =
                    "La fecha de vencimiento debe estar en el futuro";
            }
        },

        /*
               Valida el número de verificación de la tarjeta (CVV).
               El CVV debe tener entre 3 y 4 dígitos.
               
               Actualizaciones:
               - `this.validaciones.cvv`: Booleano que indica si el CVV es válido.
               - `this.mensajesError.cvv`: String con el mensaje de error
                 correspondiente.
               */
        validateCVV() {
            // falta tarjeta maerican 4 digitos las demas 3
            this.validaciones.cvv = /^[0-9]{3,4}$/.test(this.pago.cvv);
            this.mensajesError.cvv = this.validaciones.cvv
                ? ""
                : "CVV inválido";
        },

        /*
               Valida el nombre en la tarjeta.
               
               Este método verifica si el nombre en la tarjeta ingresado
               contiene solo letras y espacios. Actualiza el estado de
               validación y mensajes de error correspondientes.
               
               Si el nombre en la tarjeta es inválido, establece un mensaje
               de error indicando que el nombre en la tarjeta es inválido.
               
               Actualizaciones:
               - `this.validaciones.nombreTarjeta`: Booleano que indica si
                  el nombre en la tarjeta es válido.
               - `this.mensajesError.nombreTarjeta`: String con el mensaje
                 de error correspondiente.
               */
        validateTitular() {

            ///ver
            this.validaciones.titular = /^[a-zA-Z\s]+$/.test(
                this.pago.titular
            );
            this.mensajesError.titular = this.validaciones.nombreTarjeta
                ? ""
                : "Nombre en la tarjeta inválido";
        },

        abrirModal() {
            this.mostrarModal = true;
        },
        cerrarModal() {
            this.mostrarModal = false;
        },

        mensajeExito(field, text) {
            this.validaciones[field] = true;
            this.mensajesError[field] = text;
            setTimeout(() => {
                this.mensajesError[field] = "";
            }, 5000);
        }

    },
}).mount("#app");