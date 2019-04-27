import React from "react";
import { StyleSheet, Text, View } from "react-native";

import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDC5OgXOXuivIZ86MWVuqg3Et8g4TNa9g",
  authDomain: "adamobile-proto.firebaseapp.com",
  databaseURL: "https://adamobile-proto.firebaseio.com",
  storageBucket: "adamobile-proto.appspot.com"
};

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    firebase
      .database()
      .ref()
      .on("value", snapshot => {
        const data = snapshot.val();

        this.setState({ data: data });
      });
  }

  render() {
    return (
      this.state.data && (
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={{ color: "white" }}>ADA LOGO</Text>
            </View>
            <View>
              <Text style={{ color: "white" }}>UK Pension Scheme</Text>
              <Text style={{ color: "white" }}>Gilts Flat</Text>
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.infoCard}>
              <Text>ASSETS</Text>
              <Text>{this.state.data[1].assets}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text>LIABILITIES</Text>
              <Text>{this.state.data[1].liabilities}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text>REQUIRED RETURN 3</Text>
              <Text>{this.state.data[1].requiredReturn}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text>FUNDING LEVEL</Text>
              <Text>{this.state.data[1].fundingLevel}</Text>
            </View>
          </View>
          <View style={styles.timelineContainer}>
            <View style={styles.timeline}>
            </View>
            <View style={styles.timelineNav}>
              <Text style={{ color: "white" }}>Timeline Nav</Text>
            </View>
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  header: {
    height: "15%",
    width: "100%",
    backgroundColor: "navy",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row"
  },
  body: {
    height: "45%",
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  infoCard: {
    height: "50%",
    width: "50%",
    alignItems: "center",
    justifyContent: "center"
  },
  timelineContainer: {
    height: "40%",
    width: "100%",
    backgroundColor: "grey"
  },
  timeline: {
    height: "85%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  timelineNav: {
    height: "15%",
    width: "100%",
    backgroundColor: "navy",
    alignItems: "center",
    justifyContent: "center"
  }
});
