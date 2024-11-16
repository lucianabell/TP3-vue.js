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
                tipoTarjeta: null,
                fechaVencimiento: "",
                cvv: "",
                titular: "",
            },
            imagenesTarjetas: {
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
            console.log(this.validaciones);
            // Si el viaje es "Solo ida", no validamos fechaRegreso
            const validFechaRegreso = this.vuelo.tipoViaje === "2" ? this.validaciones.fechaRegreso : true;

            // Verifica si todos los campos son válidos
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
            this.validaciones.nombre = true;
            this.mensajesError.nombre = '¡Perfecto!';

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

            this.validaciones.pasaporte = true;
            this.mensajesError.pasaporte = '¡Perfecto!';
        },

        validateFechaNacimiento() {
            /*
                     Valida la fecha de nacimiento del pasajero.
                     
                     Este método verifica si la fecha de nacimiento ingresada está en el formato válido 'dd/mm/aaaa'
                     y si el pasajero tiene al menos 18 años. Actualiza el estado de validación.
                     y mensajes de error correspondientes.
                     
                     Si el formato de fecha es incorrecto, establece un mensaje de error indicando el formato no válido.
                     Si el pasajero es menor de 18 años, establece un mensaje de error indicando que el
                     el pasajero debe tener al menos 18 años.
                     
                     Actualizaciones:
                     - `this.validaciones.fechaNacimiento`: Booleano que indica si la fecha de nacimiento es válida.
                     - `this.mensajesError.fechaNacimiento`: Mensaje de error por fecha de nacimiento no válida.
                     */
            /*
                                 const fechaNacimiento = this.pasajero.fechaNacimiento;
                                 const regexFecha = /^(\d{2})\/(\d{2})\/(\d{4})$/;
             
                                 if (!regexFecha.test(fechaNacimiento)) {
                                     this.validaciones.fechaNacimiento = false;
                                     this.mensajesError.fechaNacimiento = 'Formato de fecha inválido (dd/mm/yyyy)';
                                     return;
                                 }
             
                                 const [_, dia, mes, año] = fechaNacimiento.match(regexFecha);
                                 const fechaNacimientoDate = new Date(`${año}-${mes}-${dia}`);
                                 const fechaActual = new Date();
             
                                 // Calcula la diferencia de años
                                 let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
                                 const mesDiferencia = fechaActual.getMonth() - fechaNacimientoDate.getMonth();
             
                                 // Ajusta la edad si el cumpleaños no ha ocurrido en el año actual
                                 if (mesDiferencia < 0 || (mesDiferencia === 0 && fechaActual.getDate() < fechaNacimientoDate.getDate())) {
                                     edad--;
                                 }
             
                                 // Valida si tiene al menos 18 años
                                 if (edad >= 18) {
                                     this.validaciones.fechaNacimiento = true;
                                     this.mensajesError.fechaNacimiento = '';
                                 } else {
                                     this.validaciones.fechaNacimiento = false;
                                     this.mensajesError.fechaNacimiento = 'Debes tener al menos 18 años';
                                 }*/

            const fechaNacimiento = new Date(this.pasajero.fechaNacimiento);
            const fechaActual = new Date();
            const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
            const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
            if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }

            if (edad > 110 || edad < 0) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = "Fecha inválida.";
                return;
            }
            if (edad < 18) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = "Debes tener al menos 18 años.";
                return;
            }

            this.validaciones.fechaNacimiento = true;
            this.mensajesError.fechaNacimiento = "¡Perfecto!";

        },

        /**
         * Valida la nacionalidad del pasajero.
         * 
         * Si la nacionalidad no ha sido seleccionada, establece un mensaje de error
         * y actualiza el estado de validación.
         * 
         */
        validateNacionalidad() {
            if (this.pasajero.nacionalidad === "") {
                this.validaciones.nacionalidad = false;
                this.mensajesError.nacionalidad = "Debes seleccionar una nacionalidad.";
                return;
            }

            this.validaciones.nacionalidad = true;
            this.mensajesError.nacionalidad = "";
        },

        /**
         * Valida la ciudad de origen o destino del vuelo.
         * 
         * Verifica si la ciudad de origen o destino ha sido seleccionada y si
         * la ciudad de origen es diferente a la ciudad de destino.
         * 
         * @param {string} field - Campo a validar, puede ser "origen" o "destino".
         */
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

            this.validaciones[field] = true;
            this.mensajesError[field] = "";
        },


        /**
         * Valida la fecha de salida o regreso del vuelo.
         * 
         * Verifica si la fecha de salida o regreso es posterior a la fecha actual
         * y si la fecha de regreso es posterior a la fecha de salida.
         * 
         * @param {string} field - Campo a validar, puede ser "fechaSalida" o "fechaRegreso".
         */
        validateFecha(field) {
            const fecha = new Date(this.vuelo[field]);
            const fechaActual = new Date();

            // Normaliza las horas para comparar solo las fechas
            fecha.setHours(0, 0, 0, 0);
            fechaActual.setHours(0, 0, 0, 0);

            if (field === "fechaRegreso" && this.vuelo.tipoViaje === "1") {
                // Si es viaje de ida, no es necesario validar fechaRegreso
                this.validaciones.fechaRegreso = true;
                this.mensajesError.fechaRegreso = "";
                return;
            }

            if (fecha < fechaActual) {
                this.validaciones[field] = false;
                this.mensajesError[field] =
                    field === "fechaSalida"
                        ? "La fecha de salida debe ser igual o posterior a la fecha actual."
                        : "La fecha de regreso debe ser posterior a la fecha de salida.";
                return;
            }

            if (field === "fechaRegreso" && this.vuelo.fechaRegreso) {
                const fechaSalida = new Date(this.vuelo.fechaSalida);
                if (fecha < fechaSalida) {
                    this.validaciones.fechaRegreso = false;
                    this.mensajesError.fechaRegreso =
                        "La fecha de regreso debe ser posterior a la fecha de salida.";
                    return;
                }
            }

            this.validaciones[field] = true;
            this.mensajesError[field] = "¡Perfecto!";
        },



        /**
         * Valida el número de boletos ingresado por el usuario.
         * Debe ser un número entre 1 y 10.
         * 
         * @returns {void}
         */
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

        /**
         * Decrementa el número de boletos ingresado por el usuario.
         * Si el valor actual es NaN o es mayor que 1, decrementa el valor en 1.
         * Si el valor actual es mayor que 10, muestra el mensaje de error "Máximo: 10 boletos".
         * 
         * @returns {void}
         */
        incrementarBoletos() {
            let boletos = parseInt(this.vuelo.numeroBoletos, 10);

            if (isNaN(boletos)) {
                this.vuelo.numeroBoletos = 1;
            } else if (boletos < 10) {
                this.vuelo.numeroBoletos = boletos + 1;
            }

            this.validateBoletos(); // Valida después del cambio
        },

        decrementarBoletos() {
            let boletos = parseInt(this.vuelo.numeroBoletos, 10);

            if (isNaN(boletos)) {
                this.vuelo.numeroBoletos = 1;
            } else if (boletos > 1) {
                this.vuelo.numeroBoletos = boletos - 1;
            }

            this.validateBoletos(); // Valida después del cambio
        },

        /**
         * Valida la clase seleccionada por el usuario.
         * Debe ser una clase diferente a "".
         * 
         * @returns {void}
         */
        validateClase() {
            if (this.vuelo.clase === "") {
                this.validaciones.clase = false;
                this.mensajesError.clase = "Debes seleccionar una clase.";
                return;
            }
            this.validaciones.clase = true;
            this.mensajesError.clase = "";
        },


        /**
         * Valida el número de tarjeta de crédito ingresado por el usuario.
         * 
         * Este método verifica el formato del número de tarjeta y determina su tipo
         * (Visa, MasterCard, American Express) basándose en expresiones regulares.
         * 
         * Actualiza el estado de validación y mensajes de error correspondientes.
         * 
         * Si el número de tarjeta es vacío, se establece un mensaje de error indicando
         * que debe tener 15 o 16 dígitos. Si el formato es incorrecto, se establece un
         * mensaje de error indicando que el formato de la tarjeta es inválido.
         * 
         * Actualizaciones:
         * - `this.pago.tipoTarjeta`: String que representa el tipo de tarjeta (Visa, MasterCard, AmericanExpress).
         * - `this.validaciones.numeroTarjeta`: Booleano que indica si el número de tarjeta es válido.
         * - `this.mensajesError.numeroTarjeta`: String con el mensaje de error correspondiente.
         */
        validateTarjeta() {
            const numero = this.pago.numeroTarjeta;

            if (numero === "") {
                this.pago.tipoTarjeta = '';
                this.validaciones.numeroTarjeta = false;
                this.mensajesError.numeroTarjeta = 'Debe tener 15 o 16 dígitos.';
                return;
            }


            // Expresiones regulares para las tarjetas
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
                this.pago.tipoTarjeta = '';
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
    },
}).mount("#app");