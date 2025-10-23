import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, DimensionValue } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { cor_primaria, cor_secundaria,typography } from '../../global';

interface DropdownProps<T> {
  items: T[];
  selectedValue: T | null;
  onSelect: (item: T) => void;
  placeholder?: string;
  buttonStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  textStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  width?: string | number;
  height?: string | number;
  labelExtractor?: (item: T) => string;
}

function Dropdown<T>({
  items,
  selectedValue,
  onSelect,
  placeholder = 'Selecionar',
  buttonStyle,
  itemStyle,
  textStyle,
  dropdownStyle,
  labelExtractor,
  width,
  height
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const getLabel = (item: T) => (labelExtractor ? labelExtractor(item) : String(item));

  return (
    <View style={[{  alignItems: 'center', position: 'relative',zIndex:10000 },{width: width as DimensionValue},[{height: height as DimensionValue}]]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => setOpen(!open)}>
        <Text style={[styles.buttonText, textStyle,typography.h4]}>
          {selectedValue ? getLabel(selectedValue) : placeholder}
        </Text>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {open && (
        <View style={[styles.dropdown, dropdownStyle]}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, itemStyle]}
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}>
              <Text style={[ styles.itemText, textStyle]}>{getLabel(item)}</Text>
              {selectedValue === item && <Icon name="check" size={20} color={cor_primaria} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: cor_primaria,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    flex:1,
    textAlign:'center',


  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignSelf: 'center',
    zIndex: 1000,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemText: {
    color: cor_secundaria,
  },
});

export default Dropdown;
