import React from "react";
import * as R from "ramda";
import moment from "moment";

import { StyleSheet, Text, View, ScrollView, Button } from "react-native";

import * as firebase from "firebase";
import ChartSegment from "./ChartSegment";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDC5OgXOXuivIZ86MWVuqg3Et8g4TNa9g",
  authDomain: "adamobile-proto.firebaseapp.com",
  databaseURL: "https://adamobile-proto.firebaseio.com",
  storageBucket: "adamobile-proto.appspot.com"
};

firebase.initializeApp(firebaseConfig);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null, scrollPosition: null };
  }

  componentDidMount() {
    firebase
      .database()
      .ref()
      .on("value", snapshot => {
        const data = snapshot.val();

        this.setState({
          data: data,
          scrollPosition: data.length - 2
        });
      });
  }

  formatData(data) {
    let difference = null;
    let lowestValue = null;

    const getExtremes = data => {
      let highestValue = null;
      let lowestValue = null;
      data.map(x => {
        if (highestValue === null || highestValue < x.fundingLevel) {
          highestValue = x.fundingLevel;
        }
        if (lowestValue === null || lowestValue > x.fundingLevel) {
          lowestValue = x.fundingLevel;
        }
      });
      return {
        difference: highestValue - lowestValue,
        lowestValue: lowestValue
      };
    };

    difference = getExtremes(data).difference;
    lowestValue = getExtremes(data).lowestValue;

    return (
      difference &&
      lowestValue &&
      data.map(x => ({
        ...x,
        chartPoint: (x.fundingLevel - lowestValue) / difference
      }))
    );
  }

  renderSegments(data) {
    const segments = [];
    for (var i = 1; i < data.length; i++) {
      segments.push(
        <ChartSegment
          firstPoint={data[i]}
          secondPoint={data[i + 1] ? data[i + 1] : data[i]}
          key={i}
        />
      );
    }
    return segments;
  }

  render() {
    let date = null;
    if (this.state.data) {
      date = new Date(
        Date.parse(this.state.data[this.state.scrollPosition].estimatedDate)
      );
    }

    return (
      this.state.data && (
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={{ color: "white" }}>ADA jLOGO</Text>
            </View>
            <View>
              <Text style={{ color: "white" }}>UK Pension Scheme</Text>
              <Text style={{ color: "white" }}>Gilts Flat</Text>
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.infoCard}>
              <Text style={styles.valueTitle}>ASSETS</Text>
              <Text style={styles.value}>
                {Math.round(
                  this.state.data[this.state.scrollPosition].assets / 1000000
                )}
                m
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.valueTitle}>LIABILITIES</Text>
              <Text style={styles.value}>
                {Math.round(
                  this.state.data[this.state.scrollPosition].liabilities /
                    1000000
                )}
                m
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.valueTitle}>REQUIRED RETURN</Text>
              <Text style={styles.value}>
                {(
                  this.state.data[this.state.scrollPosition].requiredReturn *
                  100
                ).toFixed(2)}
                %
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.valueTitle}>FUNDING LEVEL</Text>
              <Text style={styles.value}>
                {(
                  this.state.data[this.state.scrollPosition].fundingLevel * 100
                ).toFixed(2)}
                %
              </Text>
            </View>
          </View>
          <View style={styles.timelineContainer}>
            <ScrollView
              horizontal
              snapToInterval={50}
              snapToAlignment={"center"}
              decelerationRate={0}
              onScroll={event =>
                this.setState({
                  scrollPosition: getRandomInt(0, this.state.data.length)
                })
              }
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={false}
              directionalLockEnabled
              style={styles.scrollView}
            >
              {this.renderSegments(this.formatData(this.state.data))}
            </ScrollView>
          </View>
          <View style={styles.graphOverlay}>
            <Button
              onPress={() =>
                this.setState({
                  scrollPosition: this.state.data.length - 2
                })
              }
              title="H"
              color="#841584"
              accessibilityLabel="H"
            />
            <Text>{moment(date).format("Do MMM YYYY")}</Text>
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundImage: "linear-gradient(red, yellow)"
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
    width: "100%"
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
  },
  graphOverlay: {
    height: "10%",
    width: "70%",
    position: "absolute",
    opacity: 1,
    bottom: 0,
    left: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  valueTitle: {
    fontWeight: "100",
    fontSize: 10
  },
  value: {
    fontSize: 40
  },
  scrollView: {
    paddingTop: 5
  }
});
