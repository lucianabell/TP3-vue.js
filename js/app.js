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
                tipoViaje: "1",
                origen: "",
                destino: "",
                fechaSalida: "",
                fechaRegreso: "",
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
            confirmacion: false,

        };
    },
    computed: {
        /* Verifica si el formulario es válido. */
        isFormValid() {
            this.validaciones.fechaRegreso = this.vuelo.tipoViaje === "2" ? this.validaciones.fechaRegreso : true;
            return (
                Object.values(this.validaciones)
                    .filter((value) => value !== null)
                    .every((value) => value === true)
            );
        },

        /* Calcula el precio total del vuelo en función de la clase seleccionada y el número de boletos. */
        precioTotal() {
            const preciosPorClase = {
                'Economica': 10000,
                'Ejecutiva': 40000,
                'Primera Clase': 100000,
            };

            const precioBase = preciosPorClase[this.vuelo.clase] || 0;
            if (this.validaciones.clase && this.validaciones.fechaSalida && this.validaciones.origen && this.validaciones.destino && this.validaciones.numeroBoletos) {

                if (this.vuelo.fechaRegreso && this.validaciones.fechaRegreso) {
                    return precioBase * this.vuelo.numeroBoletos * 2;
                }
                return precioBase * this.vuelo.numeroBoletos;
            }

            return 0;
        }
    },
    mounted() {
        this.cargarPaises();
        this.cargarAeropuertos();
    },

    methods: {
        submitForm(event) {
            event.preventDefault();
            //valida cada campo
            this.validateNombre('nombre');
            this.validatePasaporte();
            this.validateFechaNacimiento();
            this.validateNacionalidad();
            this.validateCiudad('origen');
            this.validateCiudad('destino');
            this.validateClase();
            this.validateTarjeta();
            this.validateFechaVencimiento();
            this.validateCVV();
            this.validateBoletos();
            this.validateNombre('titular');
            this.validateFechaVuelo('fechaSalida');
            if (this.vuelo.tipoViaje === "2") {
                this.validateFechaVuelo('fechaRegreso');
            }

            if (this.isFormValid) {
                //si no hay errores, muestra la confirmacion
                this.confirmacion = true;
            }
        },


        mostrarBtnModal() {
            // Verifica que todos los campos sean validos, si son validos muestra el btn ver resumen 
            this.validaciones.fechaRegreso = this.vuelo.tipoViaje === "2" ? this.validaciones.fechaRegreso : true;
            const resultado = Object.values(this.validaciones).every((value) => value === true);
            return resultado;
        },

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

        /* Coloca la clase is-invalid o is-valid en inputs o selects */
        getClass(field) {
            return {
                'is-invalid': this.validaciones[field] === false,
                'is-valid': this.validaciones[field] === true,
            };
        },

        /* Coloca la clase invalid-feedback para mostrar el mensaje de error y la 
        clase valid-feedback para mostrar el mensaje de éxito.
         */
        getClassFeedback(field) {
            return {
                'invalid-feedback': this.validaciones[field] === false,
                'valid-feedback': this.validaciones[field] === true,
            };
        },


        validateNombre(field) {
            let regex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;

            let nombre = field === 'nombre' ? this.pasajero[field].trim() : this.pago[field].trim();

            if (nombre === '') {
                this.validaciones[field] = false;
                this.mensajesError[field] = 'Campo obligatorio.';
                return;
            }

            if (!regex.test(nombre)) {
                this.validaciones[field] = false;
                this.mensajesError[field] = 'El nombre solo puede contener letras y espacios.';
                return;
            }

            if (nombre.length < 3) {
                this.validaciones[field] = false;
                this.mensajesError[field] = 'El nombre debe tener al menos 3 caracteres.';
                return;
            }

            this.mensajeExito(field, '');
        },

        validatePasaporte() {
            /*Valida el número de pasaporte del pasajero. El pasaporte debe tener 3 letras seguidas de 6 números.*/
            let pasaporte = this.pasajero.pasaporte;
            let regex = /^[a-zA-Z]{3}[0-9]{6}$/;

            if (pasaporte == '') {
                this.validaciones.pasaporte = false;
                this.mensajesError.pasaporte = 'Campo obligatorio.';
                return;
            }

            if (!regex.test(pasaporte)) {
                this.validaciones.pasaporte = false;
                this.mensajesError.pasaporte = 'El pasaporte debe tener 3 letras seguidas de 6 números.';
                return;
            }

            this.mensajeExito('pasaporte', '');
        },

        validateFechaNacimiento() {
            let regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            let fechaNacimiento = this.pasajero.fechaNacimiento.trim();

            if (fechaNacimiento === '') {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Campo obligatorio.';
                return;
            }

            if (!regexFecha.test(fechaNacimiento)) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Ingresa una fecha válida (dd/mm/aaaa).';
                return;
            }

            let partesFecha = fechaNacimiento.split('/');
            let dia = parseInt(partesFecha[0]);
            let mes = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript empiezan en 0
            let anio = parseInt(partesFecha[2]);

            let fecha = new Date(anio, mes, dia);

            // Validar si la fecha es válida
            if (fecha.getDate() !== dia || fecha.getMonth() !== mes || fecha.getFullYear() !== anio) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Fecha inválida. Revisa el día, mes y año.';
                return;
            }

            let fechaActual = new Date();
            let edad = fechaActual.getFullYear() - anio;


            if (fechaActual.getMonth() < mes || (fechaActual.getMonth() === mes && fechaActual.getDate() < dia)) {
                edad--;
            }

            if (edad < 18) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Debe ser mayor de 18 años.';
                return;
            }

            if (edad > 110) {
                this.validaciones.fechaNacimiento = false;
                this.mensajesError.fechaNacimiento = 'Ingresa una fecha válida.';
                return;
            }

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
            this.validaciones.fechaRegreso == this.vuelo.tipoViaje == "2" ? null : true;
            this.vuelo.fechaRegreso = '';
            this.mensajesError.fechaRegreso = "";

            if (this.vuelo.tipoViaje == "2") {
                this.validateFechaVuelo('fechaRegreso');
            }
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

            this.mensajeExito(field, '');
        },

        validateFechaVuelo(field) {
            // Expresión regular para validar el formato dd/mm/aaaa
            let regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            let fechaVuelo = this.vuelo[field].trim();

            if (fechaVuelo.length === 0) {
                this.validaciones[field] = false;
                this.mensajesError[field] = 'Campo obligatorio.';
                return;
            }

            if (!regexFecha.test(fechaVuelo)) {
                this.validaciones[field] = false;
                this.mensajesError[field] = 'Ingresa una fecha válida (dd/mm/aaaa).';
                return;
            }

            // Convertir la fecha de vuelo a un objeto Date
            let partesFecha = fechaVuelo.split('/');
            let dia = parseInt(partesFecha[0]);
            let mes = parseInt(partesFecha[1]);
            let anio = parseInt(partesFecha[2]);
            let fecha = new Date(anio, mes - 1, dia);
            fecha.setHours(0, 0, 0, 0); 


            if (fecha.getMonth() + 1 !== mes ) {
                this.validaciones[field] = false;
                this.mensajesError[field] = 'Fecha inválida. Revisa el día, mes y año.';
                return;
            }

            let fechaActual = new Date();
            fechaActual.setHours(0, 0, 0, 0);

            if (fecha < fechaActual) {
                this.validaciones[field] = false;
                this.mensajesError[field] = field === "fechaSalida"
                    ? "La fecha de salida debe ser igual o posterior a la fecha actual."
                    : "La fecha de regreso debe ser posterior a la fecha de salida.";
                return;
            }

            let fechaLimite = new Date(fechaActual.getFullYear() + 1, fechaActual.getMonth(), fechaActual.getDate());
            if (fecha > fechaLimite) {
                this.validaciones[field] = false;
                this.mensajesError[field] = `Solo puedes reservar vuelos hasta el ${fechaLimite.getDate()}/${fechaLimite.getMonth() + 1}/${fechaLimite.getFullYear()}.`;
                return;
            }

            if (field === "fechaRegreso" && this.vuelo.fechaSalida) {
                partesFecha = this.vuelo.fechaSalida.split('/');
                dia = parseInt(partesFecha[0]);
                mes = parseInt(partesFecha[1]);
                anio = parseInt(partesFecha[2]);
                let fechaSalida = new Date(anio, mes - 1, dia);
                fechaSalida.setHours(0, 0, 0, 0);  

                if (fecha <= fechaSalida) {
                    this.validaciones[field] = false;
                    this.mensajesError[field] = "La fecha de regreso debe ser posterior a la fecha de salida.";
                    return;
                }
            }

            if (field === "fechaSalida" && this.vuelo.fechaRegreso) {
                partesFecha = this.vuelo.fechaRegreso.split('/');
                dia = parseInt(partesFecha[0]);
                mes = parseInt(partesFecha[1]);
                anio = parseInt(partesFecha[2]);
                let fechaRegreso = new Date(anio, mes - 1, dia);
                fechaRegreso.setHours(0, 0, 0, 0); 

                if (fecha >= fechaRegreso) {
                    this.validaciones.fechaRegreso = false;
                    this.mensajesError.fechaRegreso = "La fecha de regreso debe ser posterior a la fecha de salida.";
                    this.mensajeExito(field, '¡Correcto!');

                    return;
                }else{
                    this.mensajeExito('fechaRegreso', '¡Correcto!');
                }
            }

            this.mensajeExito(field, '¡Correcto!');
        }
        ,
        validateClase() {
            if (this.vuelo.clase === "") {
                this.validaciones.clase = false;
                this.mensajesError.clase = "Debes seleccionar una clase.";
                return;
            }

            this.mensajeExito('clase', '');
            this.validateBoletos();
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
                return this.vuelo.numeroBoletos = 1;
            } else if (boletos > 1) {
                this.vuelo.numeroBoletos = boletos - 1;
            }

            this.validateBoletos();
        },

        validateTarjeta() {
            let numero = this.pago.numeroTarjeta;

            if (numero === '') {
                this.pago.tipoTarjeta = 'Card';
                this.validaciones.numeroTarjeta = false;
                this.mensajesError.numeroTarjeta = 'Campo obligatorio.';
                return;

            }

            if (numero.toString().length > 16) {
                this.pago.tipoTarjeta = 'Card';
                this.validaciones.numeroTarjeta = false;
                this.mensajesError.numeroTarjeta = 'Debe tener al menos 16 dígitos.';
                return;
            }

            const visaRegex = /^4\d{15}$/;  // Visa: 16 dígitos que comienzan con 4
            const masterCardRegex = /^5\d{15}$/;  // MasterCard: 16 dígitos que comienzan con 5
            const amexRegex = /^(34|37)\d{13}$/; // American Express: 15 dígitos que comienzan con 34 o 37

            if (visaRegex.test(numero)) {
                this.pago.tipoTarjeta = 'Visa';
                this.validaciones.numeroTarjeta = true;
                this.mensajesError.numeroTarjeta = '';
                this.validateCVV();
                return;
            } else if (masterCardRegex.test(numero)) {
                this.pago.tipoTarjeta = 'Mastercard';
                this.validaciones.numeroTarjeta = true;
                this.mensajesError.numeroTarjeta = '';
                this.validateCVV();
                return;
            } else if (amexRegex.test(numero)) {
                this.pago.tipoTarjeta = 'AmericanExpress';
                this.validaciones.numeroTarjeta = true;
                this.mensajesError.numeroTarjeta = '';
                this.validateCVV();
                return;
            } else {
                this.pago.tipoTarjeta = 'Card';
                this.validaciones.numeroTarjeta = false;
                this.mensajesError.numeroTarjeta = 'Ingresa un número de tarjeta válido (Visa, Mastercard o AmericanExpress)';
            }

        },

        validarNumero(event) {
            // previene la entrada si la tecla presionada no es un número
            if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
            }
        },

        keyPressFecha(event) {
            //permite solo numeros y /
            if (!/[0-9/]/.test(event.key)) {
                event.preventDefault();
            }
        },

        validateFechaVencimiento() {
            let fechaVencimiento = this.pago.fechaVencimiento;
            let regexFecha = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

            if (!regexFecha.test(fechaVencimiento)) {
                this.validaciones.fechaVencimiento = false;
                this.mensajesError.fechaVencimiento = "Ingrese una fecha valida (mm/aa)";
                return;
            }

            let partesFecha = fechaVencimiento.split('/');
            let mes = parseInt(partesFecha[0]);
            let anio = parseInt(partesFecha[1]);

            let fechaActual = new Date();
            let anioActual = fechaActual.getFullYear() % 100; // Últimos dos dígitos del año
            let mesActual = fechaActual.getMonth() + 1;

            if (anio < anioActual || (anio === anioActual && mes < mesActual || anio - anioActual > 10)
            ) {
                this.validaciones.fechaVencimiento = false;
                this.mensajesError.fechaVencimiento =
                    "Ingrese una fecha valida (mm/aa)";
                return;
            }

            this.mensajeExito('fechaVencimiento', '¡Correcto!');

        },
        /* El CVV debe tener entre 3 y 4 dígitos */
        validateCVV() {
            let cvv = this.pago.cvv;

            if ((this.pago.tipoTarjeta === 'Visa' || this.pago.tipoTarjeta === 'Mastercard') && !/^[0-9]{3}$/.test(cvv)) {
                this.validaciones.cvv = false;
                this.mensajesError.cvv = 'Debe tener 3 dígitos';
                return;
            } else if (this.pago.tipoTarjeta === 'AmericanExpress' && !/^[0-9]{4}$/.test(cvv)) {
                this.validaciones.cvv = false;
                this.mensajesError.cvv = 'Debe tener 4 dígitos';
                return;
            } else if ((this.pago.tipoTarjeta === 'Card' && !/^[0-9]{3,4}$/.test(cvv)) || (this.pago.tipoTarjeta === 'Card' && cvv === '')) {
                this.validaciones.cvv = false;
                this.mensajesError.cvv = 'Debe tener 3 o 4 dígitos';
                return;
            } else {
                this.validaciones.cvv = true;
                this.mensajesError.cvv = '';
            }


        },

        mensajeExito(field, text) {
            this.validaciones[field] = true;
            this.mensajesError[field] = text;
           /*  setTimeout(() => {
                this.mensajesError[field] = "";
            }, 5000); */
        }

    },
}).mount("#app");