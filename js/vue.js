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
                nombreTarjeta: "",
            },
            imagenesTarjetas: {
                Visa: "img/visa.png",
                Mastercard: "img/mastercard.png",
                AmericanExpress: "img/american.png",
            },
            paises: [],
            clases: ["Ejecutiva", "Economica", "Primera Clase"],
            aeropuertos: [],

            validaciones: {
                nombre: null,
                pasaporte: null,
                fechaNacimiento: null,
                nacionalidad: null,
                origen: null,
                destino: null,
                fechaSalida: null,
                fechaRegreso: null,
                tarjeta: false,
                fechaVencimiento: false,
                cvv: false,
                nombreTarjeta: false,
                numeroBoletos: false,
            },
            mensajesError: {
                nombre: "",
                pasaporte: "",
                fechaNacimiento: "",
                nacionalidad: "",
                origen: "",
                destino: "",
                fechaSalida: "",
                fechaRegreso:'',
                tarjeta: "Número de tarjeta inválido",
                fechaVencimiento: "",
                cvv: "",
                nombreTarjeta: "",
                numeroBoletos: "El número de boletos debe estar entre 1 y 10",
            },

        };
    },
    computed: {
        /* formularioValido() {
            return Object.values(this.validaciones).every(Boolean);
        }, */
    },
    mounted() {
        this.cargarPaises();
        this.cargarAeropuertos();
    },

    watch: {


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

        getClass(field) {
            return {
                'is-invalid': this.validaciones[field] === false,
                'is-valid': this.validaciones[field] === true,
            };
        },

        getClassFeedback(field) {
            return {
                'invalid-feedback': this.validaciones[field] === false,
                'valid-feedback': this.validaciones[field] === true,
            };
        },

        checkForm() {
            this.validateNombre();
            this.validatePasaporte();
            this.validateFechaNacimiento();
            this.validateCiudad();
            this.validateFechaSalida();
            this.validateFechaRegreso();
            this.validateTarjeta();
            this.validateFechaVencimiento();
            this.validateCVV();
            this.validateNombreTarjeta();
            this.validateNumeroBoletos();

        },

        validateNombre() {
            let regex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
            let nombre = this.pasajero.nombre.trim();

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

        validateNacionalidad() {
            if (this.pasajero.nacionalidad === "") {
                this.validaciones.nacionalidad = false;
                this.mensajesError.nacionalidad = "Debes seleccionar una nacionalidad.";
                return;
            }

            this.validaciones.nacionalidad = true;
        },
        validateOrigen() {
            if (this.vuelo.origen === "") {
                this.validaciones.origen = false;
                this.mensajesError.origen = "Debes seleccionar una ciudad de origen.";
                return;
            }
            
            this.validateCiudad('origen');
        
            this.validaciones.origen = true;
        },
        
        validateDestino() {
            if (this.vuelo.destino === "") {
                this.validaciones.destino = false;
                this.mensajesError.destino = "Debes seleccionar una ciudad de destino.";
                return;
            }

            this.validateCiudad('destino');
        
            this.validaciones.destino = true;
        },
        
        validateCiudad(field) {

            if (this.vuelo[field] === "") {
                this.validaciones[field] = false;
                this.mensajesError[field] = "Debes seleccionar una ciudad.";
                return;
            }

            if (this.vuelo.origen === this.vuelo.destino) {
                this.validaciones[field] = false;
                this.mensajesError[field] = "La ciudad de origen y destino deben ser diferentes.";
                return;
            }

            this.validaciones[field] = true;
        },

        validateFecha(field) {
            const fecha = new Date(this.vuelo[field]);
            const fechaActual = new Date();
        
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
        
            if (field === "fechaSalida" && this.vuelo.fechaRegreso) {
                const fechaRegreso = new Date(this.vuelo.fechaRegreso);
                fechaRegreso.setHours(0, 0, 0, 0);
        
                if (fechaRegreso <= fecha) {
                    this.validaciones.fechaRegreso = false;
                    this.mensajesError.fechaRegreso =
                        "La fecha de regreso debe ser posterior a la fecha de salida.";
                } else {
                    this.validaciones.fechaRegreso = true;
                    this.mensajesError.fechaRegreso = "¡Perfecto!";
                }
            }
        
            // Marca como válida la fecha actual
            this.validaciones[field] = true;
            this.mensajesError[field] = "¡Perfecto!";
        },
        

        /*
               Valida el número de boletos.
               
               Comprueba si el número de boletos ingresado está entre 1 y 10.
               
               Si el número de boletos está dentro del rango, establece el estado de validación
               en verdadero.
               
               Si el número de boletos está fuera del rango, establece el estado de validación
               en falso.
               
               Actualizaciones:
               - `this.validaciones.numeroBoletos`: Booleano que indica si el número de boletos es válido.
              */
        validateBoletos() {
            if (
                this.vuelo.numeroBoletos >= 1 &&
                this.vuelo.numeroBoletos <= 10
            ) {
                this.validaciones.numeroBoletos = true;
            } else {
                this.validaciones.numeroBoletos = false;
            }
        },

        /*
               Valida el número de tarjeta de crédito.
               
               Comprueba si el número de tarjeta de crédito es válido según las
               reglas de Visa, Mastercard y AmericanExpress.
               
               Si el número de tarjeta es válido, establece el estado de validación
               en verdadero y coloca el tipo de tarjeta en `this.pago.tipoTarjeta`.
               
               Si el número de tarjeta no es válido, establece el estado de validación
               en falso y coloca el mensaje de error en `this.mensajesError.tarjeta`.
               
               Actualizaciones:
               - `this.validaciones.tarjeta`: Booleano que indica si el número de
                 tarjeta es válido.
               - `this.mensajesError.tarjeta`: String con el mensaje de error
                 correspondiente.
               - `this.pago.tipoTarjeta`: String con el tipo de tarjeta
                 correspondiente.
              */
        validateTarjeta() {

            const numero = this.pago.numeroTarjeta.replace(/\s+/g, ''); // Elimina espacios
            const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/; // Visa: empieza con 4, 13 o 16 dígitos
            const mastercardRegex = /^5[1-5][0-9]{14}$/; // Mastercard: empieza con 51-55, 16 dígitos
            const amexRegex = /^3[47][0-9]{13}$/; // Amex: empieza con 34 o 37, 15 dígitos

            if (visaRegex.test(numero)) {
                this.pago.tipoTarjeta = 'Visa';
                this.validaciones.tarjeta = true;
                this.mensajesError.tarjeta = '';
            } else if (mastercardRegex.test(numero)) {
                this.pago.tipoTarjeta = 'Mastercard';
                this.validaciones.tarjeta = true;
                this.mensajesError.tarjeta = '';
            } else if (amexRegex.test(numero)) {
                this.pago.tipoTarjeta = 'AmericanExpress';
                this.validaciones.tarjeta = true;
                this.mensajesError.tarjeta = '';
            } else {
                this.pago.tipoTarjeta = '';
                this.validaciones.tarjeta = false;
                this.mensajesError.tarjeta = 'Número de tarjeta inválido';
            }
        },

        /*
               Valida la fecha de vencimiento de la tarjeta.
                
               Este método verifica si la fecha de vencimiento ingresada
               está en el formato válido 'MM/AA' y si la fecha de vencimiento
               es posterior a la fecha actual. Actualiza el estado de
               validación y mensajes de error correspondientes.
                
               Si el formato de fecha es incorrecto, establece un mensaje de
               error indicando el formato no válido.
               Si la fecha de vencimiento es anterior a la fecha actual,
               establece un mensaje de error indicando que la fecha de
               vencimiento debe estar en el futuro.
                
               Actualizaciones:
               - `this.validaciones.fechaVencimiento`: Booleano que indica
                  si la fecha de vencimiento es válida.
               - `this.mensajesError.fechaVencimiento`: String con el
                  mensaje de error correspondiente.
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
        validateNombreTarjeta() {
            this.validaciones.nombreTarjeta = /^[a-zA-Z\s]+$/.test(
                this.pago.nombreTarjeta
            );
            this.mensajesError.nombreTarjeta = this.validaciones.nombreTarjeta
                ? ""
                : "Nombre en la tarjeta inválido";
        },
    },
}).mount("#app");