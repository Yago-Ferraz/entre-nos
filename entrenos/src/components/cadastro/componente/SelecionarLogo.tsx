import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, 
    Image, TouchableOpacity, Alert, ScrollView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StepProps } from '../../../types/cadastro/cadastro';
import { 
    typography, cinza, cor_primaria, 
    FONT_SIZE, cor_backgroud 
} from '../../../global';
import Buttongeneric from '../../../components/buttons/buttongeneric';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Propriedades para este componente
interface SelecionarLogoProps extends StepProps {
    // onNext será usado para "salvar" a logo e voltar para LogoLoja (ou avançar)
    // onDecline será usado para "voltar" para LogoLoja sem salvar
}

export const SelecionarLogo: React.FC<SelecionarLogoProps> = ({
    formData,
    setFormData,
    onDecline, // Usado como "Voltar" para a tela de LogoLoja
    onNext, // Usado como "Avançar" ou "Salvar"
}) => {
    // O formData.logo (assumindo que você vai adicionar 'logo: string' ao seu FormDataCadastroLojaType)
    const [selectedLogoUri, setSelectedLogoUri] = useState<string>(formData.logo || '');

    useEffect(() => {
        // Atualiza o formData quando a logo é selecionada
        setFormData({ ...formData, logo: selectedLogoUri });
    }, [selectedLogoUri]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsMultipleSelection: false, // APENAS UMA SELEÇÃO para logo
            quality: 1, // Qualidade alta para logo
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedLogoUri(result.assets[0].uri);
        }
    };

    const handleRemoveLogo = () => {
        setSelectedLogoUri(''); // Limpa a logo selecionada
    };

    // Função para avançar (salvar a logo e ir para o próximo passo)
    const handleSaveLogo = () => {
        if (selectedLogoUri) {
            onNext(); // Passa para o próximo passo no CadastroEmpresa
        } else {
            Alert.alert("Selecione uma logo", "Por favor, escolha uma imagem para a logo antes de avançar.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[typography.h1, styles.titulo]}>
                Selecione a Logo da sua Loja
            </Text>
            <Text style={[typography.detalhes, styles.detalhesTexto]}>
                Escolha uma imagem da sua galeria para ser a logo principal.
            </Text>

            {/* Área de Visualização da Logo */}
            <TouchableOpacity onPress={pickImage} style={styles.logoSelectionArea}>
                {selectedLogoUri ? (
                    <Image source={{ uri: selectedLogoUri }} style={styles.selectedLogo} />
                ) : (
                    <View style={styles.placeholderLogo}>
                        <Text style={styles.placeholderText}>Toque para selecionar a logo</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Botão para remover (se houver logo) */}
            {selectedLogoUri ? (
                <TouchableOpacity onPress={handleRemoveLogo} style={styles.removeLogoButton}>
                    <Text style={styles.removeLogoText}>Remover Logo</Text>
                </TouchableOpacity>
            ) : null}


            <Text style={[typography.detalhes, styles.textoPasso]}>
                Passo 4 de 7 - Selecionar Logo
            </Text>

            <View style={styles.botaoContainer}>
                <Buttongeneric
                    title="Voltar"
                    invertido
                    width="45%"
                    onPress={onDecline} // Volta para a tela de LogoLoja
                />
                <Buttongeneric
                    title="Salvar Logo"
                    width="45%"
                    onPress={handleSaveLogo}
                    disabled={!selectedLogoUri} // Desabilita se não houver logo
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: screenHeight * 0.01,
        flex: 1,
    },
    titulo: {
        textAlign: 'center',
        marginBottom: 10,
        maxWidth: '90%',
    },
    detalhesTexto: {
        textAlign: 'center',
        marginBottom: 30,
        maxWidth: '90%',
    },
    logoSelectionArea: {
        width: screenWidth * 0.6,
        height: screenWidth * 0.6,
        borderRadius: (screenWidth * 0.6) / 2, // Para ser circular
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: cinza,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Importante para a imagem respeitar o borderRadius
        marginBottom: 20,
    },
    placeholderLogo: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    placeholderText: {
        ...typography.h4,
        color: cinza,
        textAlign: 'center',
    },
    selectedLogo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Para preencher o círculo
    },
    removeLogoButton: {
        backgroundColor: '#FF6347', // Cor de remover (vermelho tomate)
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 20,
    },
    removeLogoText: {
        color: '#FFF',
        ...typography.button,
        fontSize: FONT_SIZE.SM,
    },
    textoPasso: {
        color: cinza,
        marginBottom: 20,
        marginTop: 15,
    },
    botaoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});

export default SelecionarLogo;