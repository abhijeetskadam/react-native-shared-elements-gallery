import React from 'react';
import {useWindowDimensions, Image} from 'react-native';
import images from '../photos';
import Gallery from './Gallery';

export default (App = () => {
  const {width} = useWindowDimensions();

  return (
    <Gallery
      images={images.map(i => ({...i, ...Image.resolveAssetSource(i.source)}))}
      containerWidth={width}
      gap={4}
    />
  );
});
