/*
Component to render multiple items as a grid of squares.
The maximum size of squares still fitting on the screen is calculated.
The remaining space to the top, bottom and sides is filled out with a padding.
Verical Scrolling can be enabled by setting rows={0}

example usage for a 2x2 grid of squares:
 <SquareGrid
      rows={2}
      columns={2}
      items={[
        <Text>Text</Text>,
        <View>View</View>,
        <Image />,
        <Text>Text</Text>
      ]}
    />
*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, ScrollView } from "react-native";

// container styles
const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 1,
  },
  content: {
    flex: 1,
    position: "relative",
    // borderColor: "black",
    // borderWidth: 1,
  },
  stretch: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    // backgroundColor: "darkgrey",
  },
  scrollContainer: {
    flex: 1,
  },
});

export default class SquareGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };

    this._handleLayout = handleLayout.bind(this);
  }

  render() {
    let props = this.props;
    let state = this.state;

    let width = state.width - 2;
    let height = state.height - 2;

    let items = props.items;

    let rows = props.rows || 0;
    let columns = props.columns || 0;
    let stretch = props.stretch || false;
    let itemMargin = props.itemMargin || 0;

    if (!rows && !columns) {
      console.error("Must specify number of rows or columns");
      return <View />;
    } else if (!columns) {
      console.error("Must specify number of columns");
      return <View />;
    }

    let marginHorizontal = 0;
    let marginVertical = 0;
    let size;

    // if 0 rows are passed, full width vertical scrolling is used
    let isScrolling = !rows;
    if (isScrolling) {
      size = Math.floor(width / columns);
    } else {
      size = Math.min(width / columns, height / rows);
      marginHorizontal = Math.floor((width - size * columns) / 2);
      marginVertical = Math.floor((height - size * rows) / 2);
      size = Math.floor(size);
    }

    let itemStyle = {
      width: size,
      height: size,
    };

    // for the non-scrolling SquareGrid a padding
    let containerStyle = {
      paddingHorizontal: stretch ? 0 : marginHorizontal,
      paddingVertical: marginVertical,
    };

    // if stretch prop is set true, add a margin to the left and right so the items are aligned stretched
    if (stretch) {
      itemStyle.marginHorizontal = marginHorizontal / columns;
    }

    if (itemMargin !== 0) {
      itemStyle.padding = itemMargin;
    }

    // display a maximum of rows*columns items or infinite for scrolling
    let maxItems = isScrolling ? Infinity : rows * columns;

    // items to render
    let toRender = items.slice(0, maxItems);
    let renderedItems = toRender.map(function (item, index) {
      return (
        <View key={index}>
          <View style={itemStyle}>{renderItem(item, index)}</View>
        </View>
      );
    });

    // scrolling SquareGrid
    if (isScrolling) {
      return (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.gridContainer} onLayout={this._handleLayout}>
            {renderedItems}
          </View>
        </ScrollView>
      );
    }

    // non scrolling SquareGrid
    return (
      <View
        style={[styles.gridContainer, containerStyle]}
        onLayout={this._handleLayout}
      >
        {renderedItems}
      </View>
    );
  }
}

// creates the rendered item and centers it
function renderItem(item) {
  return (
    <View style={[styles.item]}>
      <View style={styles.content}>
        <View style={styles.stretch}>{item}</View>
      </View>
    </View>
  );
}

SquareGrid.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  stretch: PropTypes.bool,
  itemMargin: PropTypes.number,
};

function handleLayout(event) {
  let nativeEvent = event.nativeEvent;
  let layout = nativeEvent.layout;
  let width = layout.width;
  let height = layout.height;

  this.setState({
    width: width,
    height: height,
  });
}
