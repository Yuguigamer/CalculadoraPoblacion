import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function calculadorapoblacionfinita(): JSX.Element {
  // Estados para almacenar los valores ingresados por el usuario
  const [population, setPopulation] = useState('1000'); // Tamaño de población
  const [marginError, setMarginError] = useState('5'); // Valor inicial 5%
  const [confidenceLevel, setConfidenceLevel] = useState('1.96'); // Valor inicial Z para 95%
  const [sampleSize, setSampleSize] = useState<number | null>(null);
  const [formula, setFormula] = useState<string>('');
  const [formulaFraction, setFormulaFraction] = useState<string>('');
  const [substitution, setSubstitution] = useState<string>('');
  const [substitutionFraction, setSubstitutionFraction] = useState<string>('');

  // Función para calcular el tamaño de la muestra (población finita)
  const calcularMuestra = () => {
    const N = parseFloat(population); // Tamaño de la población
    const z = parseFloat(confidenceLevel); // Z para el nivel de confianza
    const p = 0.5; // Proporción estimada (usamos 0.5 para máxima variabilidad)
    const e = parseFloat(marginError)/100; // Margen de error

    if (isNaN(N) || isNaN(z) || isNaN(e) || e <= 0 || e >= 1 || N <= 0) {
        setSampleSize(null);
      return;
    }

    // Fórmula de tamaño de muestra para población finita
    const numerator = Math.pow(z,2) * p * (1-p);
        const denominator = Math.pow(e,2);
        const adjustment = 1 + ((Math.pow(z,2) * p * (1-p))/(Math.pow(e,2) * N));
        
        const n = (numerator/denominator) * (1/adjustment);
        setSampleSize(Math.ceil(n));

    setSampleSize(Math.ceil(n)); // Redondear al número entero superior

    // Fórmula lineal
    setFormula(`n = (Z² * p * (1-p)) / E² * (1 / (1 + (Z² * p * (1-p))/(E² * N)))`);
    setSubstitution(
        `n = (${z}² * ${p} * (1-${p})) / (${e})² * (1 / (1 + (${z}² * ${p} * (1-${p}))/(${e}² * ${N})))`
    );

    // Fórmula con fracciones
    setFormulaFraction(
        '       (Z² · p · (1 - p))                1\n' +
        'n = ────────────────────── · ────────────────────────────     \n' +
        '            E²                     (Z² · p · (1 - p))  \n' +
        '                               1 + ────────────────────  \n' +
        '                                         E² · N          \n'
    );
    
    setSubstitutionFraction(
        '       ' + `(${z}² · ${p} · (1 - ${p}))` + '                1\n' +
        'n = ───────────────────────────── · ────────────────────────────     \n' +
        '           ' + `(${e})²` + '                     ' + `(${z}² · ${p} · (1 - ${p}))` + '\n' +
        '                                   1 + ─────────────────────────  \n' +
        '                                             '   +   `(${e})² · ${N}` + '          \n'
    );
  };

  // Usamos useEffect para recalcular el tamaño de la muestra cada vez que cambie un campo
  useEffect(() => {
    calcularMuestra();
  }, [population, marginError, confidenceLevel]);

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Calculadora de Población de Muestra Finita</Text>

      

      {/* Entrada de tamaño de población */}
      <View style={estilos.inputContainer}>
        <Text style={estilos.label}>Tamaño de la Población (N)</Text>
        <TextInput
          style={estilos.input}
          keyboardType="numeric"
          value={population}
          onChangeText={setPopulation}
        />
      </View>

      {/* margen de Error */}
      <View style={estilos.inputContainer}>
        <Text style={estilos.label}>Margen de error</Text>
        <TextInput
          style={estilos.input}
          keyboardType="numeric"
          value={marginError}
          onChangeText={setMarginError}
        />
      </View>

      {/* Selector de nivel de confianza */}
      <View style={estilos.inputContainer}>
        <Text style={estilos.label}>Nivel de Confianza</Text>
        <View style={estilos.pickerContainer}>
          <Picker
            selectedValue={confidenceLevel}
            style={estilos.picker}
            onValueChange={(itemValue) => setConfidenceLevel(itemValue)}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="90% (Z = 1.645)" value="1.645" color="#fff" />
            <Picker.Item label="95% (Z = 1.96)" value="1.96" color="#fff" />
            <Picker.Item label="99% (Z = 2.576)" value="2.576" color="#fff" />
          </Picker>
        </View>
      </View>

      <View style={estilos.formulaOuterContainer}>
            <Text style={estilos.formulaTitle}>Fórmula aplicada:</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              <View style={estilos.formulaContainer}>
                <View style={estilos.formulaColumn}>
                    <View style={estilos.formulaLinear}>
                        <Text style={estilos.formula}>{formula}</Text>
                    </View>
                    <View style={estilos.formulaFraction}>
                        <View style={estilos.fractionCenter}>
                            <Text style={[estilos.formula, estilos.monospace]}>{formulaFraction}</Text>
                        </View>
                    </View>
                </View>
                            
                <Text style={estilos.formulaTitle}>Sustitución con valores:</Text>
                <View style={estilos.formulaColumn}>
                    <View style={estilos.formulaLinear}>
                        <Text style={estilos.formula}>{substitution}</Text>
                    </View>
                    <View style={estilos.formulaFraction}>
                        <View style={estilos.fractionCenter}>
                            <Text style={[estilos.formula, estilos.monospace]}>{substitutionFraction}</Text>
                        </View>
                    </View>
                </View>
              </View>
            </ScrollView>
        </View>

      {/* Resultado */}
      {sampleSize !== null && (
        <View style={estilos.resultadoContainer}>
          <Text style={estilos.resultadoTexto}>
            Tamaño de muestra calculado: {sampleSize}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1a1a1a', // Fondo oscuro
    flexGrow: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Texto en blanco
    textAlign: 'center',
    marginBottom: 20,
  },
  formulaOuterContainer: {
    width: '100%',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  formulaContainer: {
    minWidth: '100%',
    paddingHorizontal: 10,
  },
  formulaColumn: {
    width: '100%',
    marginBottom: 20,
  },
  formulaLinear: {
    marginBottom: 15,
  },
  formulaFraction: {
    alignItems: 'center',
  },
  fractionCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  formulaTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  formula: {
    color: '#fff',
    fontSize: 14,
  },
  monospace: {
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#4CAF50', // Borde verde para el input
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#333', // Fondo oscuro en el input
    color: '#fff', // Texto blanco en el input
    paddingLeft: 10,
  },
  pickerContainer: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#fff',
    backgroundColor: '#333',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 15,
    color: '#fff', // Etiqueta en blanco
    marginBottom: 8,
  },
  resultadoContainer: {
    marginTop: 20,
    backgroundColor: '#4CAF50', // Fondo verde para el resultado
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultadoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco para el resultado
  },
});