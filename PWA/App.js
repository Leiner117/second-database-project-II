import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';

export default function App() {
  const [cedula, setCedula] = useState('');
  const [codigo, setCodigo] = useState('');
  const [qrData, setQRData] = useState('');

  const handleCedulaChange = (text) => {
    setCedula(text);
  };

  const handleCodigoChange = (text) => {
    setCodigo(text);
  };

  const handleCreateQR = () => {
    if (cedula && codigo) {
      const data = `${cedula}/${codigo}`; // Separando la cédula y el código con "/"
      setQRData(data);
    } else {
      Alert.alert('Error', 'Por favor ingrese la cédula y el código');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su cédula"
        value={cedula}
        onChangeText={handleCedulaChange}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Ingrese el código"
        value={codigo}
        onChangeText={handleCodigoChange}
      />
      <Button
        title="Crear QR"
        onPress={handleCreateQR}
      />
      {qrData ? (
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={200}
          />
        </View>
      ) : null}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
