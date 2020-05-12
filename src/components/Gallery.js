import React, {useMemo, useState, useCallback} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import ImageTile from './ImageTile';
import DetailsView from './DetailsView';

export default (Gallery = ({images = [], containerWidth, gap = 5}) => {
  const _images = images.slice().sort(() => Math.random() - 0.5);
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  const onBackPress = useCallback(() => {
    setDetailsLoaded(false);
    setShowDetails(null);
  }, []);

  const imageRows = useMemo(() => {
    const waiters = [];
    return _images.reduce(
      (a, c) => {
        const isLandscape = c.width > c.height * 1.7;
        if (waiters.length > 0 && !isLandscape) {
          a[waiters.shift()].push(c);
        } else {
          a.push([c]);
          if (!isLandscape) waiters.push(a.length - 1);
        }

        return a;
      },
      [[]],
    );
  }, [images.length]);

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={imageRows}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({item}) => (
          <ItemRenderer
            item={item}
            containerWidth={containerWidth}
            gap={gap}
            onPress={setShowDetails}
            detailsLoaded={detailsLoaded}
            detailsImageName={showDetails?.name}
          />
        )}
      />
      {showDetails !== null && (
        <DetailsView
          initialImage={showDetails}
          onLoad={setDetailsLoaded}
          onBackPress={onBackPress}
        />
      )}
    </>
  );
});

class ItemRenderer extends React.Component {
  state = fitInRow({
    rowImages: this.props.item,
    containerWidth: this.props.containerWidth,
    gap: this.props.gap,
  });

  itemNames = this.props.item.map(i => i.name);

  shouldComponentUpdate(nextProps) {
    return (
      (nextProps.detailsLoaded &&
        this.itemNames.includes(nextProps.detailsImageName)) ||
      (this.itemNames.includes(this.props.detailsImageName) &&
        !nextProps.detailsImageName)
    );
  }

  render() {
    const {widths, height} = this.state;
    const {gap, item, onPress, detailsLoaded, detailsImageName} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: gap,
          marginBottom: gap,
        }}>
        {widths.map((w, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item[index].name}
              onPress={e => {
                const {pageX, pageY, locationX, locationY} = e.nativeEvent;
                onPress({
                  ...item[index],
                  gridWidth: w,
                  gridHeight: height,
                  gridX: pageX - locationX,
                  gridY: pageY - locationY,
                  index,
                });
              }}>
              <ImageTile
                index={index}
                source={item[index].source}
                style={{
                  width: w,
                  height,
                  opacity:
                    detailsLoaded && detailsImageName === item[index].name
                      ? 0
                      : 1,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

function fitInRow({rowImages, containerWidth, gap = 10}) {
  const aspectRatios = rowImages.map(i => i.width / i.height);
  const totalOfAspectRations = aspectRatios.reduce((a, c) => a + c, 0);
  const totalWhiteSpace = (rowImages.length + 1) * gap;
  const availableWidth = containerWidth - totalWhiteSpace;
  const divideUnit = availableWidth / totalOfAspectRations;
  const widths = aspectRatios.map(a => a * divideUnit);
  return {widths, height: widths[0] / aspectRatios[0]};
}
