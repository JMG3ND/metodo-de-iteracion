<template>
	<div class="screen">
		<UForm class="form" :state="state" :validate="state.validate" @submit="submit">
			<header style="text-align: center;">
				<h1>MÉTODO DE ITERACIÓN</h1>
				<h1>PARA RESOLVER CIRCUITOS CON DIODOS</h1>
			</header>
			<UFormGroup v-slot="{ error }" required label="Voltaje"
				:description="`Fuente de voltaje en ${state.unidadVoltaje}`" name="voltaje">
				<div class="form__input">
					<IconsVoltaje />
					<UInput v-model="state.coeficienteVoltaje" type="number" step="0.1"
						:trailing-icon="error && 'i-heroicons-exclamation-triangle-20-solid'" />
					<USelect v-model="state.unidadVoltaje" :options="state.unidadesV" />
				</div>
			</UFormGroup>
			<UFormGroup v-slot="{ error }" required label="Resistencia"
				:description="`Valor de la resistencia en ${state.unidadResistencia}`" name="resistencia">
				<div class="form__input">
					<IconsResistencia />
					<UInput v-model="state.coeficienteResistencia" type="number" step="0.1"
						:trailing-icon="error && 'i-heroicons-exclamation-triangle-20-solid'" />
					<USelect v-model="state.unidadResistencia" :options="state.unidadesR" />
				</div>
			</UFormGroup>
			<div style="text-align: center;">
				<UButton @click="showConfigDiode = true">
					<IconsConfDiode />Configurar Diodo
				</UButton>
			</div>
			<UFormGroup required label="Presición de la repuesta" description="Define cantidad de cifras significativas"
				name="presicion">
				<div class="form__presicion-container">
					<URange :min=0 :max=8 v-model="state.presicionDeRespuesta" />
					<span>{{ state.presicionDeRespuesta }}</span>
				</div>
			</UFormGroup>
			<div class="form__button-container">
				<UButton type="submit" icon="i-heroicons-pencil-square">Procesar</UButton>
			</div>
			<UModal class="form__modal" v-model="showConfigDiode">
				<div class="form__modal-container">
					<UFormGroup label="Material del diodo" description="Definen el material del diodo">
						<div class="form__input">
							<IconsVoltaje />
							<div class="from__raidoButtons">
								<URadio name="silicio" value='0.7' label="Silicio" v-model="state.voltajeDiodo" />
								<URadio name="germanio" value='0.3' label="Germanio" v-model="state.voltajeDiodo" />
							</div>
							<UContainer>{{ state.voltajeDiodo }} V</UContainer>
						</div>
					</UFormGroup>
					<UFormGroup label="Corriente de saturación" description="Valor de la corriente de saturación en A"
						name="corrienteS">
						<div style="margin-bottom: 1rem;" class="form__input">
							<IconsCorriente />
							<URange :disabled="state.incluirIP" :min=-15 :max=-12 :step=0.1
								v-model="state.potenciaCorrienteSaturacion" />
							<div class="corrienteS">10<div class="corrienteS__potencia">
									{{ state.potenciaCorrienteSaturacion }}</div>
							</div>
						</div>
						<UCheckbox v-model="state.incluirIP" name="incluir" label="Incluir corriente propuesta" />
						<div class="form__input">
							<IconsCorriente />
							<UInput :disabled="!state.incluirIP" v-model="state.idi" type="number" step="0.001" />
						</div>
					</UFormGroup>
					<UFormGroup label="Factor de idealidad" description="Indica que tan ideal es el diodo">
						<div class="form__input">
							<IconsNIdealidad />
							<URange :min=1 :max=2 :step=0.01 v-model="state.factorIdentidad" />
							<div style="width: 3rem;">{{ state.factorIdentidad }}</div>
						</div>
					</UFormGroup>
					<UFormGroup v-slot="{ error }" required label="Voltaje Termico" description="Voltaje térmico del diodo"
						name="voltajeTermico">
						<div class="form__input">
							<IconsVoltaje />
							<UInput v-model="state.voltajeTermico" type="number" step="0.0001"
								:trailing-icon="error && 'i-heroicons-exclamation-triangle-20-solid'" />
						</div>
					</UFormGroup>
				</div>
			</UModal>
			<div>
				<span style="display: flex;">
					<IconsVoltaje /> = {{ state.vd ? state.vd : "?" }}
				</span>
				<span style="display: flex;">
					<IconsCorriente /> = {{ state.id ? state.id : "?" }}
				</span>
			</div>
		</UForm>
	</div>
</template>

<script setup>
const state = ref(new IterationMethod());

// Método de iteración para calcular el voltaje y la corriente de trabajo del diodo
function submit(state) {
	const { incluirIP, idi } = state.data;
	if (incluirIP) state.data.submit(idi);
	else state.data.submit();
}

const showConfigDiode = ref(false);
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

	&__modal {
		padding: 2rem 0;
		width: fit-content;
	}

	&__modal-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		margin: 0 auto;
	}
}

.corrienteS {
	position: relative;
	width: 3rem;

	&__potencia {
		font-size: small;
		position: absolute;
		width: 3rem;
		top: -0.5rem;
		right: -2rem;
	}
}
</style>