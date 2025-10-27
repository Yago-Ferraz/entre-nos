import React, { useState, useEffect } from 'react';
import { 
    View, Text, Image, 
    StyleSheet, Dimensions, 
    TouchableOpacity, TextInput,
    Alert
} from 'react-native';
// Certifique-se de importar o tipo correto
import { StepProps, FormDataCadastroLojaType } from '../../types/cadastro/cadastro'; 
import { typography, cinza, cor_primaria, FONT_SIZE, cor_backgroud } from '../../global';
import Buttongeneric from '../../components/buttons/buttongeneric';
import { Ionicons } from '@expo/vector-icons'; 
import { useVoiceRecognition } from '../inputs/microfone'; // Seu caminho está correto

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type ActiveTab = 'escrever' | 'sugestao';

export const DescricaoLoja: React.FC<StepProps> = ({ formData, setFormData, onNext, onDecline }) => {

  const [activeTab, setActiveTab] = useState<ActiveTab>('escrever');

  const {
    isRecording,
    error: speechError,
    results,
    startRecording,
    stopRecording
  } = useVoiceRecognition();

  
  // --- ⬇️ CORREÇÃO DO ERRO DE TIPO ⬇️ ---
  // Este efeito "assiste" aos 'results' do hook.
  useEffect(() => {
    if (results && results.length > 0) {
      const transcribedText = results[0]; 
      
      // Criamos o NOVO objeto formData completo e passamos para setFormData
      const updatedFormData: FormDataCadastroLojaType = {
        ...formData, // Pega todos os valores atuais do formData
        descricao: (formData.descricao || '') + ' ' + transcribedText // Atualiza apenas a descrição
      };
      setFormData(updatedFormData); // Passa o objeto atualizado
    }
    // Agora, o efeito depende de 'results' e 'formData' (para ter o valor atual)
    // e 'setFormData' (para chamar a função)
  }, [results, formData, setFormData]); 
  // --- ⬆️ FIM DA CORREÇÃO ⬆️ ---

  
  const toggleRecording = () => {
    console.log('toggleRecording. Is recording?', isRecording); 
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleDescricaoChange = (text: string) => {
    // Esta chamada já estava correta, pois passa o objeto
    setFormData({ ...formData, descricao: text }); 
  };
  
  const handleSugestao = () => {
    setActiveTab('sugestao');
    if (isRecording) stopRecording(); 
    Alert.alert("Sugestão da Clara", "Esta funcionalidade será implementada em breve!");
  };

  const handleEscrever = () => {
    setActiveTab('escrever');
  };

  const textoPasso = "Passo 5 de 6"; 

  return (
    <View style={styles.container}>

      
      <Text style={[typography.h1, styles.titulo]}>
        Vamos fazer uma super descrição!
      </Text>
      <Text style={[typography.detalhes, styles.subtitulo]}>
        Conte um pouco sobre o que você vende, seu diferencial, sua história...
      </Text>
      <Image
        source={require('../../../assets/images/Rectangle 324.png')} 
        style={styles.ilustracao}
      />
      <Text style={[typography.detalhes, styles.textoPasso]}>
        {textoPasso}
      </Text>

      <View style={styles.tabContainer}>
        <Buttongeneric
          title="Escreva aqui"
          onPress={handleEscrever}
          width={'48%'}
          invertido={activeTab !== 'escrever'}
        />
        <Buttongeneric
          title="Sugestão da clara"
          onPress={handleSugestao}
          width={'48%'}
          invertido={activeTab !== 'sugestao'}
        />
      </View>

      <View style={styles.inputAreaContainer}>
        {activeTab === 'escrever' ? (
          <>
            <View style={styles.inputHeader}>
              <Ionicons name="volume-medium-outline" size={24} color={cor_primaria} />
              <Text style={styles.inputTitle}>Escreva sua descrição</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Descrição:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Insira aqui ou use o microfone..."
                multiline={true}
                numberOfLines={4}
                value={formData.descricao}
                onChangeText={handleDescricaoChange}
                textAlignVertical="top" 
              />
              <TouchableOpacity style={styles.micIcon} onPress={toggleRecording}>
                <Ionicons 
                  name={isRecording ? "mic-off-outline" : "mic-outline"} 
                  size={24} 
                  color={isRecording ? '#E53935' : cinza} 
                />
              </TouchableOpacity>
            </View>
            {speechError ? <Text style={styles.errorText}>{speechError}</Text> : null}
          </>
        ) : (
          <View style={styles.sugestaoContainer}>
            <Text style={typography.detalhes}>Em breve: Sugestões da Clara!</Text>
          </View>
        )}
      </View>

      {/* ... (Todo o JSX inferior é o mesmo: Navegação) ... */}
      <View style={styles.navigationContainer}>
        <Buttongeneric
          title="Voltar"
          invertido
          width="45%"
          onPress={onDecline} 
        />
        <Buttongeneric
          title="Avançar"
          width="45%"
          onPress={onNext} 
          disabled={!formData.descricao || formData.descricao.length < 10} 
        />
      </View>
    </View>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.01,
  },
  arrowButton: {
    position: 'absolute', 
    top: 5, 
    left: 5, 
    padding: 10,
    zIndex: 1,
  },
  arrowText: {
    fontSize: 24,
    color: cinza,
    fontWeight: 'bold',
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 40, 
    maxWidth: '90%',
  },
  subtitulo: {
    textAlign: 'center',
    marginBottom: 15,
    maxWidth: '80%',
  },
  ilustracao: {
    width: screenWidth * 0.35,
    height: screenWidth * 0.35,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  textoPasso: {
    color: cinza,
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  inputAreaContainer: {
    width: '100%',
    backgroundColor: '#F9F9F9', 
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputTitle: {
    ...typography.h3,
    color: cor_primaria,
    marginLeft: 8,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: cor_primaria, 
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    height: 120, 
  },
  inputLabel: {
    ...typography.detalhes,
    color: cinza,
    fontSize: FONT_SIZE.SM,
  },
  textInput: {
    flex: 1,
    fontFamily: 'JOST_REGULAR', 
    fontSize: FONT_SIZE.MD,
    paddingTop: 5,
  },
  micIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  sugestaoContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    ...typography.detalhes,
    color: '#E53935',
    fontSize: FONT_SIZE.SM,
    marginTop: 8,
    textAlign: 'center'
  }
});

export default DescricaoLoja;

