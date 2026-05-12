import { Button, Linking } from 'react-native';

export default function App() {
  const abrirMapa = async () => {
    const url = 'https://www.google.com/maps?q=-28.6775,-49.3697';

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log('Não foi possível abrir o mapa');
    }
  };

  return (
    <Button title="Abrir Google Maps" onPress={abrirMapa} />
  );
}