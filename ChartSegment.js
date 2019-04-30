import React from "react";
import { View } from "react-native";
import { Svg, Defs, Stop } from "expo";
const { Line, Polygon, LinearGradient, Ellipse } = Svg;

export default class ChartSegment extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {};
  //   }

  render() {
    return (
      this.props.firstPoint &&
      this.props.secondPoint && (
        <View>
          <Svg height="310" width="50">
            {/* <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="170" y2="0">
                <Stop offset="0" stopColor="rgb(255,255,0)" stopOpacity="0" />
                <Stop offset="1" stopColor="red" stopOpacity="1" />
              </LinearGradient>
            </Defs> */}
            <Line
              x1="0"
              y1={250 * (1 - this.props.firstPoint.chartPoint) + 5}
              x2="50"
              y2={250 * (1 - this.props.secondPoint.chartPoint) + 5}
              stroke="#c1c1c1"
              strokeWidth="3"
            />
            <Polygon
              points={`0,${250 *
                (1 - this.props.firstPoint.chartPoint)} 0,310 50,310 50,${250 *
                (1 - this.props.secondPoint.chartPoint)}`}
              fillOpacity="0"
              stroke="#fbdce7"
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1={250 * (1 - this.props.firstPoint.chartPoint)}
              x2="50"
              y2={250 * (1 - this.props.secondPoint.chartPoint)}
              stroke="#fbdce7"
              strokeWidth="3"
            />
          </Svg>
        </View>
      )
    );
  }
}
