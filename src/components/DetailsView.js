import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  BackHandler,
  Animated,
  useWindowDimensions,
  View,
} from 'react-native';

const duration = 250;

const DetailsView = ({onBackPress, initialImage, onLoad}) => {
  const [loaded, setLoaded] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const {width, height} = useWindowDimensions();
  const detailsHeight = (initialImage.height / initialImage.width) * width;
  const initialScale = initialImage.gridWidth / width;
  const initialX = (width - initialImage.gridWidth) / -2 + initialImage.gridX;
  const initialY = (height - initialImage.gridHeight) / -2 + initialImage.gridY;

  useEffect(() => {
    const backAction = () => {
      Animated.timing(progress, {
        toValue: 0,
        useNativeDriver: true,
        duration,
      }).start(onBackPress);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return backHandler.remove;
  }, []);

  useEffect(() => {
    if (loaded) {
      Animated.timing(progress, {
        toValue: 1,
        useNativeDriver: true,
        duration,
      }).start();
    }
  }, [loaded]);

  return (
    <>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {backgroundColor: 'black', opacity: progress},
        ]}
      />
      <View style={[styles.root, {height}]}>
        <Animated.Image
          onLoad={() => {
            setLoaded(true);
            onLoad(true);
          }}
          style={{
            width: width,
            height: detailsHeight,
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [initialX, 0],
                }),
              },
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [initialY, 0],
                }),
              },
              {
                scale: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [initialScale, 1],
                }),
              },
            ],
          }}
          source={initialImage.source}
        />
      </View>
    </>
  );
};

export default DetailsView;

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
