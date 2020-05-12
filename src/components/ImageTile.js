import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';

const ImageTile = ({style, index, ...restProps}) => {
  const translateX = useRef(
    new Animated.Value(style.width * (index % 2 ? 1 : -1)),
  ).current;

  useEffect(
    Animated.spring(translateX, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start,
    [],
  );

  return (
    <Animated.Image
      {...restProps}
      style={[style, {transform: [{translateX}]}]}
    />
  );
};

export default ImageTile;
