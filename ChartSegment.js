import React from "react";
import { View } from "react-native";
import { Svg } from "expo";
const { Line, Polygon } = Svg;

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
            <Polygon
              points={`0,${250 *
                (1 - this.props.firstPoint.chartPoint)} 0,310 50,310 50,${250 *
                (1 - this.props.secondPoint.chartPoint)}`}
              fill="pink"
              stroke="red"
              strokeWidth="0"
            />
            <Line
              x1="0"
              y1={250 * (1 - this.props.firstPoint.chartPoint)}
              x2="50"
              y2={250 * (1 - this.props.secondPoint.chartPoint)}
              stroke="red"
              strokeWidth="3"
            />
          </Svg>
        </View>
      )
    );
  }
}
