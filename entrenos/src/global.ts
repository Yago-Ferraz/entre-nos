import { StyleSheet } from "react-native";


export const cor_primaria = '#228932'
export const cor_secundaria = '#021757'
export const cor_terciaria = '#FFA629'
export const cor_backgroud = '#F8F8F8'
export const cinza = '#868686'





export const FONT_FAMILY = {
   
    JOST_REGULAR: 'JOST_REGULAR',
    JOST_MEDIUM: 'JOST_MEDIUM',
    JOST_BOLD:'JOST_BOLD',
    JOST_SEMIBOLD:'JOST_SEMIBOLD'
};

// Objeto para padronizar os tamanhos de fonte.
export const FONT_SIZE = {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 20,
    XL: 24,
    XXL: 32,
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
});