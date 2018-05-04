import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { white, purple } from '../utils/colors'

export default function UdaciSteppers({ max, unit, step, value, onIncrement, onDecrement }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between' }]}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={onDecrement}
          style={[styles.iosBtn, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}>
          <FontAwesome name="minus"
            size={30} color={purple}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncrement}
          style={[styles.iosBtn, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}>
          <FontAwesome name="plus"
            size={30} color={purple}
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text>{value}</Text>
        <Text>{unit}</Text>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  iosBtn: {
    backgroundColor: white,
    borderColor: purple,
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    paddingLeft: 25,
    paddingRight: 25
  }
})
