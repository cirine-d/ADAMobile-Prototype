import React from "react";
import * as R from "ramda";
import moment from "moment";
import AnimateNumber from "react-native-animate-number";
import { LinearGradient, Font } from "expo";
import { Ionicons } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image
} from "react-native";

import * as firebase from "firebase";
import ChartSegment from "./ChartSegment";
import StaticTooltip from "./StaticTooltip";

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

    Font.loadAsync({
      "roboto-thin": require("./assets/fonts/Roboto-Thin.ttf")
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
          <LinearGradient colors={["#253746", "#2f3957", "#fbdce7"]}>
            <View style={styles.header}>
              <View>
                <Image source={require("./assets/ADA_logo.png")} />
              </View>
              <View style={{ marginLeft: "3%" }}>
                <Text style={{ color: "white" }}>UK Pension Scheme</Text>
                <Text style={{ color: "#fbdce7" }}>Gilts Flat</Text>
              </View>
            </View>
            <View style={styles.body}>
              <View style={styles.infoCard}>
                <Text style={styles.valueTitle}>ASSETS</Text>
                <Text style={styles.value}>
                  <AnimateNumber
                    countBy={100}
                    interval={40}
                    value={Math.round(
                      this.state.data[this.state.scrollPosition].assets /
                        1000000
                    )}
                  />
                  m
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.valueTitle}>LIABILITIES</Text>
                <Text style={styles.value}>
                  <AnimateNumber
                    countBy={100}
                    interval={40}
                    value={Math.round(
                      this.state.data[this.state.scrollPosition].liabilities /
                        1000000
                    )}
                  />
                  m
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.valueTitle}>REQUIRED RETURN</Text>
                <Text style={styles.value}>
                  <AnimateNumber
                    countBy={0.5}
                    interval={40}
                    timing="easeIn"
                    value={(
                      this.state.data[this.state.scrollPosition]
                        .requiredReturn * 100
                    ).toFixed(1)}
                  />
                  %
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.valueTitle}>FUNDING LEVEL</Text>
                <Text style={styles.fundingLevelValue}>
                  <AnimateNumber
                    countBy={0.5}
                    interval={40}
                    value={(
                      this.state.data[this.state.scrollPosition].fundingLevel *
                      100
                    ).toFixed(1)}
                  />
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
              <Ionicons
                onPress={() =>
                  this.setState({
                    scrollPosition: this.state.data.length - 2
                  })
                }
                name="md-time"
                size={35}
                color="#253746"
                style={{ paddingRight: "5%" }}
              />
              <Text style={styles.dateOverlay}>
                {moment(date).format("Do MMM YYYY")}
              </Text>
            </View>
            <View style={styles.staticTooltip}>
              <StaticTooltip />
            </View>
          </LinearGradient>
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
    paddingLeft: "5%",
    paddingTop: "8%",
    height: "15%",
    width: "100%",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  body: {
    height: "45%",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: "2%"
  },
  infoCard: {
    height: "45%",
    width: "47%",
    marginTop: "2%",
    alignItems: "flex-start",
    justifyContent: "center",
    // elevation: 1,
    borderColor: "white",
    paddingLeft: "2%"
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
    color: "#fbdce7",
    fontSize: 10
  },
  value: {
    fontFamily: "roboto-thin",
    fontSize: 50,
    color: "white",
    fontWeight: "100"
  },
  fundingLevelValue: {
    fontFamily: "roboto-thin",
    fontSize: 50,
    color: "#ea1864",
    fontWeight: "100"
  },
  dateOverlay: {
    fontFamily: "roboto-thin",
    fontSize: 40,
    color: "#253746",
    fontWeight: "100"
  },
  scrollView: {
    paddingTop: 5
  },
  staticTooltip: {
    height: "40%",
    width: "100%",
    position: "absolute",
    opacity: 1,
    bottom: 60,
    justifyContent: "flex-start",
    alignItems: "center"
  }
});
