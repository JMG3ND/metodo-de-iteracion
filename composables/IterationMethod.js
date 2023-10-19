export default class IterationMethod {
    constructor() {
        // Valores de la fuente por defecto
        this.coeficienteVoltaje = "5";
        this.unidadVoltaje = "V";
        this.unidadesV = ["mV", "V", "kV"];

        // Valores de la resistencia por defecto
        this.coeficienteResistencia = "1";
        this.unidadResistencia = "kΩ";
        this.unidadesR = ["Ω", "kΩ"];

        // Voltaje del diodo 
        this.voltajeDiodo = 0.7;

        //Corriente de saturación
        this.potenciaCorrienteSaturacion = -15;
        this.incluirIP = false;

        // Voltaje termico
        this.voltajeTermico = 0.026;

        // Factor de identidad
        this.factorIdentidad = 1;

        // Presición de la respuesta en cifras significativas
        this.presicionDeRespuesta = 4;

        // Corriente propuesto
        this.idi = 0.001;
        // Soluciones
        // this.id
        // this.vd
    }

    // Obtenemos el valor numérico de la propiedad fuente del circuito
    voltaje() {
        const v = parseFloat(this.coeficienteVoltaje);
        if (this.unidadVoltaje == "mV") return v / 1000;
        if (this.unidadVoltaje == "kV") return v * 1000;
        return v;
    }

    // Obtenemos el valor de la resistencia del circuito
    resistencia() {
        const r = parseFloat(this.coeficienteResistencia);
        if (this.unidadResistencia == "kΩ") return r * 1000;
        return r;
    }

    // Calculamos la corriente de saturación
    corrienteSaturacion() {
        return parseFloat(`1e${this.potenciaCorrienteSaturacion}`);
    }

    // Corriente 2 de la primera iteración
    corriente_2(id) {
        return (this.voltaje() - id) / this.resistencia();
    }

    // Corriente 1 de la primera iteración
    corriente_1() {
        return this.corrienteSaturacion() * Math.exp(this.voltajeDiodo / (this.factorIdentidad * this.voltajeTermico))
    }

    submit(corriente_1 = this.corriente_1(), voltaje_1 = this.voltajeDiodo) {
        // Calculamos la corriente 2
        const corriente_2 = this.corriente_2(voltaje_1);

        // Calculamos el voltaje 2
        const v2 = voltaje_1 + 2.3 * this.factorIdentidad * this.voltajeTermico * Math.log10(corriente_2 / corriente_1);

        //Comparamos los valores de voltaje
        if (Number(v2.toFixed(this.presicionDeRespuesta)) === Number(voltaje_1.toFixed(this.presicionDeRespuesta))) {
            this.vd = Number(v2.toFixed(this.presicionDeRespuesta));
            this.id = Number(corriente_1.toFixed(this.presicionDeRespuesta));
        } else this.submit(corriente_2, v2);
    }

    validate(state) {
        const errors = [];
        const { coeficienteVoltaje } = state;
        if (!coeficienteVoltaje || coeficienteVoltaje === "0")
            errors.push({ path: 'voltaje', message: 'Bro, sin voltaje no hay corriente' });

        const { coeficienteResistencia } = state;
        if (!coeficienteResistencia || coeficienteResistencia === "0")
            errors.push({ path: 'resistencia', message: 'Se quemó...' });

        const { voltajeTermico } = state;
        if (!voltajeTermico || voltajeTermico === "0")
            errors.push({ path: 'voltajeTermico', message: '¿Tas seguro?' });

        const { incluirIP, idi } = state;
        if (incluirIP && idi && idi === "0")
            errors.push({ path: 'corrienteS', message: 'Si la vas a incluir hazlo' });
        return errors;
    }
}