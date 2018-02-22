import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View, StyleSheet, Animated, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

class CustomLinearGradient extends Component {
    render() {
        const { locationStart, colorShimmer, widthShimmer } = this.props;

        return (
            <LinearGradient
                colors={colorShimmer}
                style={{ flex: 1 }}
                start={{ x: -1, y: 0.5 }}
                end={{ x: 2, y: 0.5 }}
                locations={[locationStart + widthShimmer, locationStart + 0.5 + widthShimmer / 2, locationStart + 1]}
            />
        );
    }
}

CustomLinearGradient.propTypes = {
    locationStart: PropTypes.any,
    colorShimmer: PropTypes.array,
    widthShimmer: PropTypes.number,
};

Animated.LinearGradient = Animated.createAnimatedComponent(CustomLinearGradient);

class ShimmerPlaceHolder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            beginShimmerPosition: new Animated.Value(-1)
        };
		
		this._animationInstance = Animated.loop(Animated.timing(this.state.beginShimmerPosition, {
			toValue: 1,
			duration: this.props.duration,
			// useNativeDriver: true,
			// easing: Easing.linear,
			// delay: -400
		}));
    }

    componentDidMount() {
        if (this.props.autoRun) {
			this._animationInstance.start()
        }
    }

    render() {
        const { width, reverse, height, colorShimmer, style, widthShimmer, children, visible, backgroundColorBehindBorder, hasBorder } = this.props;
        let beginPostioner = -0.7;
        let endPosition = 0.7;

        if (reverse) {
            beginPostioner = 0.7;
            endPosition = -0.7;
        }

        const newValue = this.state.beginShimmerPosition.interpolate({
            inputRange: [-1, 1],
            outputRange: [beginPostioner, endPosition],
        });

		let androidSpecificView = null;

		if (((style && style.borderRadius) || hasBorder) && Platform.OS === 'android') {
			const androidDynamicStyle = {
				borderRadius: width / 2 + 40 / 2,
				borderColor: backgroundColorBehindBorder,
			};

			androidSpecificView = <View style={[styles.androidSpecificView, androidDynamicStyle]} />;
		}

		const innerView = visible ? (
			children
		) : (
			<View style={{ flex: 1 }}>
				<Animated.LinearGradient
					locationStart={newValue}
					colorShimmer={colorShimmer}
					widthShimmer={widthShimmer}
				/>
				<View style={{ width: 0, height: 0 }}>
					{this.props.children}
				</View>
				{androidSpecificView}
			</View>
		);

        return (
			<View style={!visible ? [{ height, width }, styles.container, style] : []}>
				{innerView}
			</View>
        );
    }
}

ShimmerPlaceHolder.defaultProps = {
    width: 200,
    height: 15,
    widthShimmer: 0.7,
    duration: 1000,
    colorShimmer: ['#ebebeb', '#c5c5c5', '#ebebeb'],
    reverse: false,
    autoRun: false,
    visible: false,
    backgroundColorBehindBorder: 'white',
    hasBorder: false,
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden'
    },
	androidSpecificView: {
		position: 'absolute',
		top: -40,
		bottom: -40,
		right: -40,
		left: -40,
		borderWidth: 40,
	}
});

ShimmerPlaceHolder.propTypes = {
    width: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    height: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    widthShimmer: PropTypes.number,
    duration: PropTypes.number,
    colorShimmer: PropTypes.array,
    reverse: PropTypes.bool,
    autoRun: PropTypes.bool,
    visible: PropTypes.bool,
    children: PropTypes.any,
    style: PropTypes.any,
    backgroundColorBehindBorder: PropTypes.string,
    hasBorder: PropTypes.bool,
};

export default ShimmerPlaceHolder;
