import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  illustration: {
    height: '40%',
    resizeMode: 'contain',
    marginVertical: 30,
  },
  stepText: {
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around', // Espaça os botões
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#2E8B57', // Verde
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1, // Faz o botão ocupar espaço disponível
    marginRight: 10, // Espaçamento entre os botões
  },
  declineButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  acceptButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    flex: 1,
    marginLeft: 10,
  },
  acceptButtonText: {
    color: '#2E8B57', // Verde
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
