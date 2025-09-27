import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    minHeight: 48,
  },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 18, color: '#333' },
  skipButton: { padding: 8 },
  skipButtonText: { fontSize: 16, color: '#888' },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  paginationText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});