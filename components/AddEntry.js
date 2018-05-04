import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import { white, purple } from '../utils/colors'
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((curState) => {
      const count = curState[metric] + step;
      return {
        ...curState,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState((curState) => {
      const count = curState[metric] - step;
      return {
        ...curState,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }))

    this.props.dispatch(addEntry({
      [key]: entry
    }));

    // Navigate to home

    submitEntry({key, entry});

    // clear local modification
  }

  reset = () => {
    const key = timeToString();

    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }));

    // Navigate to home

    removeEntry(key);
  }

  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name="ios-happy-outline"
            size={100}
          />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={{flex:1}}>
        <DateHeader date={(new Date()).toLocaleDateString()}/>
        <Text>{JSON.stringify(this.state)}</Text>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest }  = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={{flexDirection: 'row'}}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  }
})

function mapStateToProps (state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry);
