import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  secondaryLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 15,
  },
});