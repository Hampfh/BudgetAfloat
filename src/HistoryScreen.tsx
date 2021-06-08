import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default function HistoryScreen() {

	const [history, setHistory] = useState<Array<{
		diff: number,
		date: Date
	}>>([])

	useEffect(() => {
		
		AsyncStorage.getItem("history", (err, value) => {
			if (value == null || err) {
				return
			}
			setHistory(JSON.parse(value))
		})
	}, [])

	return (
		<View style={{
			height: "100%",
			backgroundColor: "#fff",
			alignItems: "center"
		}}>
			<Text style={{
				fontSize: 40,
				textAlign: "center",
				marginBottom: 20
			}}>History</Text>
			<ScrollView style={{
				backgroundColor: "#f5f5f5",
				maxHeight: Dimensions.get("window").height - 200,
				width: "80%",
				borderRadius: 10,
				paddingVertical: 20
			}}>
				{history.map(current => 
					<View key={current.date.toString()} style={{
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}>
						<Text style={{
							textAlign: "center",
							color: current.diff < 0 ? "#B00020" : "#00C853",
							marginVertical: 10,
							marginRight: 20
						}}>
							{moment(current.date).format("YYYY MMMM")}
						</Text>
						<Text style={{
							textAlign: "center",
							color: current.diff < 0 ? "#B00020" : "#00C853",
							marginVertical: 10
						}}>
							{current.diff < 0 ? "" : "+"}{current.diff} kr
						</Text>
					</View>
				)}
			</ScrollView>
		</View>
	)
}
