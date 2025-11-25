import { StyleSheet,Dimensions  } from "react-native";
const { width } = Dimensions.get('window');

export const cor_primaria = '#228932'
export const cor_secundaria = '#021757'
export const cor_terciaria = '#FFA629'
export const cor_backgroud = '#F8F8F8'
export const cinza = '#868686'
export const cor_vermelho = '#E00000'





export const FONT_FAMILY = {
   
    JOST_REGULAR: 'JOST_REGULAR',
    JOST_MEDIUM: 'JOST_MEDIUM',
    JOST_BOLD:'JOST_BOLD',
    JOST_SEMIBOLD:'JOST_SEMIBOLD'
};
const scale = width / 440;

// Objeto para padronizar os tamanhos de fonte.
export const FONT_SIZE = {
  XS: 12 * scale,
  SM: 14 * scale,
  MD: 16 * scale,
  LG: 20 * scale,
  XL: 24 * scale,
  XXL: 32 * scale,
};

// Seus estilos de texto padronizados
export const typography = StyleSheet.create({
    // Títulos
    h1: {
        fontFamily: FONT_FAMILY.JOST_BOLD,
        fontSize: FONT_SIZE.XXL,
    },
    h2: {
        fontFamily: FONT_FAMILY.JOST_BOLD,
        fontSize: FONT_SIZE.XL,
    },
    h3: {
        fontFamily: FONT_FAMILY.JOST_MEDIUM,
        fontSize: FONT_SIZE.LG,
    },
    h4:{
        fontFamily: FONT_FAMILY.JOST_SEMIBOLD,
        fontSize: FONT_SIZE.MD
    },


    detalhes:{
        fontFamily: FONT_FAMILY.JOST_MEDIUM,
        fontSize: FONT_SIZE.MD,
        color: cinza
        
    },

    button: {
    fontFamily: FONT_FAMILY.JOST_MEDIUM,
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
  },

  p:{
    fontFamily: FONT_FAMILY.JOST_REGULAR,
    fontSize: FONT_SIZE.SM,
  }
});