export default class IterationMethod {
    constructor() {
        // Corriente propuesta por el problema 
        this.corrientePropuesta = 0.001;
        // Voltaje del diodo 
        this.voltajeDiodo = 0.7;
        // Resistencia en el circuito
        this.resistencia = 1000;
        // Factor de identidad
        this.factorIdentidad = 1;
        // Voltaje termico
        this.voltajeTermico = 0.026;
        // Fuente de voltaje del circuito
        this.voltajeDelCircuito = 5;
        // Presición de la respuesta en cifras significativas
        this.presicionDeRespuesta = 4;
        // Corriente de saturación
        this.corrienteDeSaturacion = Math.pow(10, -15);
        // Voltaje respuesta
        this.voltaje = 0;
        // Corriente respuesta
        this.corriente = 0;
    }

    // Método de iteración para calcular el voltaje y la corriente de trabajo del diodo
    iteracion(voltaje_1 = this.voltajeDiodo, corriente_1 = this.corrientePropuesta) {
        // Calculamos la corriente 2
        const corriente_2 = (this.voltajeDelCircuito - voltaje_1) / this.resistencia;

        // Calculamos el voltaje 2
        const voltaje_2 = voltaje_1 + this.factorIdentidad * this.voltajeTermico * Math.log10(corriente_2 / corriente_1);

        // Comprobamos si los valores son iguales
        if (voltaje_1.toFixed(this.presicionDeRespuesta) != voltaje_2.toFixed(this.presicionDeRespuesta))
            // Llamamos otra iteración con los nuevos valores de voltaje y corriente calculados
            this.iteracion(voltaje_2, corriente_2);
        else {
            // Retornamos un respuesta a las variables reactivas para reflejarlas en pantalla
            this.voltaje = Number(voltaje_2.toFixed(this.presicionDeRespuesta));
            this.corriente = Number(corriente_2.toFixed(this.presicionDeRespuesta));
        }
    }
}