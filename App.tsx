import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';

export default function App() {
  const [cost, setCost] = useState('')
  const [percent, setPercent] = useState('')
  const [resale, setResale] = useState('0')
  const [history, setHistory]:any = useState([])

  const costInput = (amount:string) => {
    setCost(amount)
  }

  const percentInput = (amount:string) => {
    setPercent(amount)
  }


  const calcResale = (c:string, p:string) => {
    if (cost.length >= 2 && percent.length >= 2){
      const a = Number(c)
      const b = 1-(Number(p)/100)
      const resale = (a/b).toFixed(2)
      setResale(resale)
      updateHistory(resale)
    }
  }

  const updateHistory = async (resale:any) => {
    const newEntry = {cost: cost, percent: percent, resale: resale}
    await AsyncStorage.setItem('history', JSON.stringify([...history,newEntry]))
    setHistory((state:any)=>{return[...state, newEntry]})
  }

  const grabPersistence = async () =>{
    const persistentData:any = await AsyncStorage.getItem('history')
    if (persistentData){
      setHistory(JSON.parse(persistentData))
    }
  }

  useEffect(()=>{calcResale(cost,percent)},[cost,percent])
  useEffect(()=>{grabPersistence()},[])

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.TextSign}>Product Cost  $</Text>
        <TextInput style={styles.TextInput} onChangeText={costInput} value={cost} keyboardType='numeric'/>
      </View>
      <View style={styles.row}>
        <Text style={styles.TextSign}>GP Percent  %</Text>
        <TextInput style={styles.TextInput} onChangeText={percentInput} value={percent} keyboardType='numeric'/>
      </View>
      <View style={styles.row}>
        <Text style={styles.total}>Resale Price: ${resale}</Text>
      </View>
      <View style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Cost</DataTable.Title>
              <DataTable.Title>Percent</DataTable.Title>
              <DataTable.Title numeric>Price</DataTable.Title>
            </DataTable.Header>

        <ScrollView>
            {history.reverse().map((item:any, index:any)=>{
              return (
                <DataTable.Row key={index}>
                  <DataTable.Cell>${item.cost}</DataTable.Cell>
                  <DataTable.Cell>{item.percent}%</DataTable.Cell>
                  <DataTable.Cell numeric>${item.resale}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </ScrollView>

          </DataTable>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#80b',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  tableContainer: {
    paddingTop: 0,
    paddingHorizontal: 0,
    width: 300,
    margin: 60,
    height: 400,
  },
  total: {
    marginRight: 50,
    fontSize: 30,
  },
  row: {
    flexDirection: 'row',
    margin: 10,
  },
  TextSign: {
    margin: 0,
    fontSize: 35,
  },
  TextInput: {
    height: 40,
    width: 100,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#70a'
  }
});
