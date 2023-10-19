<template>
	<div class="screen">
		<UForm class="form" :state="state" :validate="validate" @submit="submit">
			<UFormGroup v-slot="{ error }" required label="Voltaje" description="Voltaje que alimenta el circuito en V"
				name="voltaje">
				<div class="form__input">
					<IconsVoltaje />
					<UInput v-model="state.voltaje.valor" type="number" step="0.1"
						:trailing-icon="error && 'i-heroicons-exclamation-triangle-20-solid'" />
					<USelect v-model="state.voltaje.unidad" :options="unidadesV" />
				</div>
			</UFormGroup>
			<UFormGroup v-slot="{ error }" required label="Resistencia" description="Valor de la resistencia en Ω"
				name="resistencia">
				<div class="form__input">
					<IconsResistencia />
					<UInput v-model="state.resistencia.valor" type="number" step="0.1"
						:trailing-icon="error && 'i-heroicons-exclamation-triangle-20-solid'" />
					<USelect v-model="state.resistencia.unidad" :options="unidadesR" />
				</div>
			</UFormGroup>
			<UFormGroup label="Corriente de saturación" description="Valor de la corriente de saturación en A"
				name="corrienteS">
				<UCheckbox v-model="state.corrienteDeSaturacion.incluirIS" name="incluir"
					label="Incluir corriente de saturación" />
				<div class="form__input">
					<IconsCorriente />
					<UInput style="width: 4rem;" :disabled="!state.corrienteDeSaturacion.incluirIS"
						v-model="state.corrienteDeSaturacion.coeficiente" type="number" step="0.1" />
					<span>x10^</span>
					<UInput style="width: 4rem;" :disabled="!state.corrienteDeSaturacion.incluirIS"
						v-model="state.corrienteDeSaturacion.potencia" type="number" />
				</div>
			</UFormGroup>
			<UFormGroup required label="Material del diodo" description="Definen el material del diodo" name="material">
				<div class="form__input">
					<IconsVoltaje />
					<div class="from__raidoButtons">
						<URadio name="silicio" value='0.7' label="Silicio" v-model="state.material" />
						<URadio name="germanio" value='0.3' label="Germanio" v-model="state.material" />
					</div>
					<UContainer>{{ state.material }} V</UContainer>
				</div>
			</UFormGroup>
			<UFormGroup required label="Presición de la repuesta" description="Define cantidad de cifras significativas"
				name="presicion">
				<div class="form__presicion-container">
					<URange :min=0 :max=8 v-model="state.presicion" />
					<span>{{ state.presicion }}</span>
				</div>
			</UFormGroup>
			<div class="form__button-container">
				<UButton type="submit" icon="i-heroicons-pencil-square">Procesar</UButton>
			</div>
		</UForm>
		<div>{{ iterador }}</div>
	</div>
</template>

<script setup>
// Estado de los datos del formulario
const state = ref({
	voltaje: {
		valor: undefined,
		unidad: "V"
	},
	resistencia: {
		valor: undefined,
		unidad: "Ω"
	},
	corrienteDeSaturacion: {
		coeficiente: 1,
		potencia: 1,
		incluirIS: false
	},
	material: 0.7,
	presicion: 2
})

// Función que se ejecuta para validar que los datos ingresados en el formulario sean correctos
const validate = (state) => {
	const { voltaje, resistencia, corrienteDeSaturacion } = state;
	const errors = [];
	if (!voltaje.valor || voltaje.valor == 0) errors.push({ path: 'voltaje', message: 'Bro, sin voltaje no hay corriente' });
	if (!resistencia.valor || resistencia.valor == 0) errors.push({ path: 'resistencia', message: 'Se quemó...' });

	// Control de validación para los datos de la corriente de saturación
	const { coeficiente, potencia, incluirIS } = corrienteDeSaturacion;
	if ((!coeficiente || coeficiente == 0 || !potencia) && incluirIS)
		errors.push({ path: 'corrienteS', message: 'Para que lo activas pue' });

	return errors
}

// Función que se ejecuta al hacer procesar los datos del formulario
function submit(event) {
	const { corrienteDeSaturacion, material, presicion, resistencia, voltaje } = event.data;
	iterador.value.corrienteDeSaturacion = corrienteDeSaturacion.valor;
	iterador.value.voltajeDiodo = material;
	iterador.value.presicionDeRespuesta = presicion;
	iterador.value.resistencia = resistencia.valor;
	iterador.value.voltajeDelCircuito = voltaje.valor;
	iterador.value.iteracion();
}

// Unidades para el formulario
const unidadesV = ["mV", "V", "kV"];
const unidadesR = ["Ω", "kΩ"];

// Variables reactivas para mostrar la información
const iterador = ref(new IterationMethod());
</script>

<style lang="scss">
.screen {
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: center;
	align-items: center;
	gap: 1rem;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1rem;

	&__input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	&__button-container {
		text-align: end;
	}

	&__presicion-container {
		display: flex;
		align-items: center;

		& span {
			width: 50%;
			text-align: center;
		}
	}
}
</style>