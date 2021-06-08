import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Button } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

export default function MainScreen() {

	const [inputActive, setInputActive] = useState(false)
	const [isIncome, setIsIncome] = useState(false)
	const [inputField, setInputField] = useState("")
	const [month, setMonth] = useState<Array<{
		diff: number,
		date: Date
	}>>([])
	const [amount, setAmount] = useState(0)

	const textFieldRef = useRef<TextInput>()

	async function isNewMonth() {
		if (month.length <= 0) {
			return false
		}
		if (moment().month() !== moment(month[month.length - 1].date).month()) {
			const value = await AsyncStorage.getItem("history")
			const list = value == null ? [] : JSON.parse(value) as Array<{ diff: number, date: Date }>
				list.push({
					diff: amount,
					date: moment().add(-1, "month").toDate()
				})
			await AsyncStorage.setItem("history", JSON.stringify(list))
			return true
		}
		return false
	}

	useEffect(() => {
		AsyncStorage.getItem("amount").then(value => {
			if (value != null && !isNaN(value as unknown as number)) {
				setAmount(parseInt(value))
			}
		})
		AsyncStorage.getItem("month").then((value) => {
			if (value == null) {
				return
			}

			try {
				setMonth(JSON.parse(value))
			} catch {

			}

			isNewMonth().then(newMonth => {
				if (newMonth) {
					setAmount(0)
					setMonth([])
					AsyncStorage.removeItem("amount")
					AsyncStorage.removeItem("month")
				}
			})
		})
	}, [])

	function onIncomeClick() {
		setInputActive(true)
		setInputField("")
		setIsIncome(true)
	}

	function onOutcomeClick() {
		setInputActive(true)
		setInputField("")
		setIsIncome(false)
	}

	function onSubmit() {
		if (isNaN(inputField as unknown as number)) {
			setInputField("")
			return
		}

		const diff = parseInt(inputField) * (isIncome ? 1 : -1)

		const newAmount = amount + diff
		setAmount(newAmount)
		month.unshift({
			diff,
			date: moment().toDate()
		})
		setMonth(JSON.parse(JSON.stringify(month)))

		setInputField("")
		setInputActive(false)

		AsyncStorage.setItem("amount", newAmount.toString())
		AsyncStorage.setItem("month", JSON.stringify(month))
	}

	return (
		<View>
			<View style={{
				height: "100%",
				alignItems: "center",
				backgroundColor: "#fff"
			}}>
				<Text style={{
					fontSize: 40
				}}>
					This month
				</Text>
				<View>
					<Text style={{
						marginTop: 20,
						fontSize: 30,
						color: amount < 0 ? "#B00020" : "#00C853"
					}}>{`${amount < 0 ? "" : "+"}${amount} kr`}</Text>
				</View>
				<View style={{
					marginTop: 50,
					flexDirection: "row"
				}}>
					<View style={{
						marginHorizontal: 50
					}}>
						<Button title={"Income"} onPress={inputActive ? onSubmit : onIncomeClick} />
					</View>
					<View style={{
						marginHorizontal: 50
					}}>
						<Button title={"Outcome"} onPress={inputActive ? onSubmit : onOutcomeClick} />
					</View>
				</View>
				{inputActive && 
					<View style={{
						width: "50%",
						marginTop: 50
					}}>
						<Text style={{
							fontSize: 20,
							textAlign: "center",
							marginBottom: 10
						}}>Enter amount</Text>
						<TextInput ref={textFieldRef as React.MutableRefObject<any>} autoFocus={true} maxLength={10} keyboardType={'numeric'} style={{
							color: "#000",
							backgroundColor: "#eee"
						}} value={inputField} onChangeText={text => setInputField(text)} onSubmitEditing={onSubmit} />
					</View>
				}
				<View style={{
					width: "80%",
					marginTop: 50,
					alignItems: "center"
				}}>
					<Text style={{
						textAlign: "center",
						fontSize: 20,
						marginBottom: 10
					}}>Month history</Text>
					<ScrollView style={{
						backgroundColor: "#f5f5f5",
						maxHeight: 400,
						width: "80%",
						borderRadius: 10
					}}>
						{month.map((current, index) => <View key={index} style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center"
						}}>
							<Text style={{
								flex: 3,
								textAlign: "center",
								color: current.diff < 0 ? "#B00020" : "#00C853",
								marginVertical: 10
							}}>
								{current.diff < 0 ? "" : "+"}{current.diff} kr
							</Text>
							<Text style={{
								flex: 1,
								textAlign: "center",
								color: current.diff < 0 ? "#B00020" : "#00C853",
								marginVertical: 10,
								marginRight: 20
							}}>
								{moment(current.date).format("dddd HH:mm")}
							</Text>
						</View>)}
					</ScrollView>
				</View>
			</View>
		</View>
	)
}
