import React, {useEffect, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const bottomGap = Math.max(insets.bottom, 12);
  const barDrop = useRef(new Animated.Value(-14)).current;
  const activeDrop = useRef(new Animated.Value(-5)).current;

  useEffect(() => {
    Animated.spring(barDrop, {
      toValue: 0,
      friction: 8,
      tension: 55,
      useNativeDriver: true,
    }).start();
  }, [barDrop]);

  useEffect(() => {
    activeDrop.setValue(-5);
    Animated.spring(activeDrop, {
      toValue: 0,
      friction: 7,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [activeDrop, state.index]);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, {paddingBottom: bottomGap}]}>
      <Animated.View style={[styles.bar, {transform: [{translateY: barDrop}]}]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = options.tabBarIcon
            ? undefined
            : 'ellipse-outline';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? theme.colors.textWhite : theme.colors.grayDark;
          const icon =
            typeof options.tabBarIcon === 'function'
              ? options.tabBarIcon({
                  focused: isFocused,
                  color,
                  size: 22,
                })
              : (
                <Icon name={iconName as string} size={22} color={color} />
              );

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.item}
              activeOpacity={0.8}>
              <Animated.View
                style={[
                  styles.iconWrap,
                  isFocused && styles.iconWrapActive,
                  isFocused && {transform: [{translateY: activeDrop}]},
                ]}>
                {icon}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    height: 64,
    width: '90%',
    maxWidth: 420,
    borderRadius: 28,
    backgroundColor: theme.colors.background,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.18,
    shadowRadius: 12,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primary,
  },
});
