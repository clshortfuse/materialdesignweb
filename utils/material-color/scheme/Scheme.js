/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import CorePalette from '../palettes/CorePalette.js';

/**
 * Represents a Material color scheme, a mapping of color roles to colors.
 */
export default class Scheme {
  /**
   * @param {number} argb  ARGB representation of a color.
   * @return {Scheme} Light Material color scheme, based on the color's hue.
   */
  static light(argb) {
    return Scheme.lightFromCorePalette(CorePalette.of(argb));
  }

  /**
   * @param {number} argb ARGB representation of a color.
   * @return {Scheme} Dark Material color scheme, based on the color's hue.
   */
  static dark(argb) {
    return Scheme.darkFromCorePalette(CorePalette.of(argb));
  }

  /**
   * @param {number} argb ARGB representation of a color.
   * @return {Scheme} Light Material content color scheme, based on the color's hue.
   */
  static lightContent(argb) {
    return Scheme.lightFromCorePalette(CorePalette.contentOf(argb));
  }

  /**
   * @param {number} argb ARGB representation of a color.
   * @return {Scheme} Dark Material content color scheme, based on the color's hue.
   */
  static darkContent(argb) {
    return Scheme.darkFromCorePalette(CorePalette.contentOf(argb));
  }

  /**
   * Light scheme from core palette
   * @param {CorePalette} core
   * @return {Scheme}
   */
  static lightFromCorePalette(core) {
    return new Scheme({
      primary: core.a1.tone(40),
      onPrimary: core.a1.tone(100),
      primaryContainer: core.a1.tone(90),
      onPrimaryContainer: core.a1.tone(10),
      secondary: core.a2.tone(40),
      onSecondary: core.a2.tone(100),
      secondaryContainer: core.a2.tone(90),
      onSecondaryContainer: core.a2.tone(10),
      tertiary: core.a3.tone(40),
      onTertiary: core.a3.tone(100),
      tertiaryContainer: core.a3.tone(90),
      onTertiaryContainer: core.a3.tone(10),
      error: core.error.tone(40),
      onError: core.error.tone(100),
      errorContainer: core.error.tone(90),
      onErrorContainer: core.error.tone(10),
      background: core.n1.tone(98),
      onBackground: core.n1.tone(10),
      surface: core.n1.tone(98),
      onSurface: core.n1.tone(10),
      surfaceDim: core.n1.tone(87),
      surfaceBright: core.n1.tone(98),
      surfaceContainerLowest: core.n1.tone(100),
      surfaceContainerLow: core.n1.tone(96),
      surfaceContainer: core.n1.tone(94),
      surfaceContainerHigh: core.n1.tone(92),
      surfaceContainerHighest: core.n1.tone(90),
      surfaceVariant: core.n2.tone(90),
      onSurfaceVariant: core.n2.tone(30),
      outline: core.n2.tone(50),
      outlineVariant: core.n2.tone(80),
      shadow: core.n1.tone(0),
      scrim: core.n1.tone(0),
      inverseSurface: core.n1.tone(20),
      inverseOnSurface: core.n1.tone(95),
      inversePrimary: core.a1.tone(80),
    });
  }

  /**
   * Dark scheme from core palette
   * @param {CorePalette} core
   * @return {Scheme}
   */
  static darkFromCorePalette(core) {
    return new Scheme({
      primary: core.a1.tone(80),
      onPrimary: core.a1.tone(20),
      primaryContainer: core.a1.tone(30),
      onPrimaryContainer: core.a1.tone(90),
      secondary: core.a2.tone(80),
      onSecondary: core.a2.tone(20),
      secondaryContainer: core.a2.tone(30),
      onSecondaryContainer: core.a2.tone(90),
      tertiary: core.a3.tone(80),
      onTertiary: core.a3.tone(20),
      tertiaryContainer: core.a3.tone(30),
      onTertiaryContainer: core.a3.tone(90),
      error: core.error.tone(80),
      onError: core.error.tone(20),
      errorContainer: core.error.tone(30),
      onErrorContainer: core.error.tone(90), // Fix Typo
      background: core.n1.tone(6),
      onBackground: core.n1.tone(90),
      surface: core.n1.tone(6),
      onSurface: core.n1.tone(90),
      surfaceDim: core.n1.tone(6),
      surfaceBright: core.n1.tone(24),
      surfaceContainerLowest: core.n1.tone(4),
      surfaceContainerLow: core.n1.tone(10),
      surfaceContainer: core.n1.tone(12),
      surfaceContainerHigh: core.n1.tone(17),
      surfaceContainerHighest: core.n1.tone(22),
      surfaceVariant: core.n2.tone(30),
      onSurfaceVariant: core.n2.tone(80),
      outline: core.n2.tone(60),
      outlineVariant: core.n2.tone(30),
      shadow: core.n1.tone(0),
      scrim: core.n1.tone(0),
      inverseSurface: core.n1.tone(90),
      inverseOnSurface: core.n1.tone(20),
      inversePrimary: core.a1.tone(40),
    });
  }

  /**
   * @param {Object} props
   * @param {number} props.primary
   * @param {number} props.onPrimary
   * @param {number} props.primaryContainer
   * @param {number} props.onPrimaryContainer
   * @param {number} props.secondary
   * @param {number} props.onSecondary
   * @param {number} props.secondaryContainer
   * @param {number} props.onSecondaryContainer
   * @param {number} props.tertiary
   * @param {number} props.onTertiary
   * @param {number} props.tertiaryContainer
   * @param {number} props.onTertiaryContainer
   * @param {number} props.error
   * @param {number} props.onError
   * @param {number} props.errorContainer
   * @param {number} props.onErrorContainer
   * @param {number} props.background
   * @param {number} props.onBackground
   * @param {number} props.surface
   * @param {number} props.onSurface
   * @param {number} props.surfaceDim
   * @param {number} props.surfaceBright
   * @param {number} props.surfaceContainerLowest
   * @param {number} props.surfaceContainerLow
   * @param {number} props.surfaceContainer
   * @param {number} props.surfaceContainerHigh
   * @param {number} props.surfaceContainerHighest
   * @param {number} props.surfaceVariant
   * @param {number} props.onSurfaceVariant
   * @param {number} props.outline
   * @param {number} props.outlineVariant
   * @param {number} props.shadow
   * @param {number} props.scrim
   * @param {number} props.inverseSurface
   * @param {number} props.inverseOnSurface
   * @param {number} props.inversePrimary
   */
  constructor(props) {
    this.props = props;
  }

  /** @return {number} */
  get primary() {
    return this.props.primary;
  }

  /** @return {number} */
  get onPrimary() {
    return this.props.onPrimary;
  }

  /** @return {number} */
  get primaryContainer() {
    return this.props.primaryContainer;
  }

  /** @return {number} */
  get onPrimaryContainer() {
    return this.props.onPrimaryContainer;
  }

  /** @return {number} */
  get secondary() {
    return this.props.secondary;
  }

  /** @return {number} */
  get onSecondary() {
    return this.props.onSecondary;
  }

  /** @return {number} */
  get secondaryContainer() {
    return this.props.secondaryContainer;
  }

  /** @return {number} */
  get onSecondaryContainer() {
    return this.props.onSecondaryContainer;
  }

  /** @return {number} */
  get tertiary() {
    return this.props.tertiary;
  }

  /** @return {number} */
  get onTertiary() {
    return this.props.onTertiary;
  }

  /** @return {number} */
  get tertiaryContainer() {
    return this.props.tertiaryContainer;
  }

  /** @return {number} */
  get onTertiaryContainer() {
    return this.props.onTertiaryContainer;
  }

  /** @return {number} */
  get error() {
    return this.props.error;
  }

  /** @return {number} */
  get onError() {
    return this.props.onError;
  }

  /** @return {number} */
  get errorContainer() {
    return this.props.errorContainer;
  }

  /** @return {number} */
  get onErrorContainer() {
    return this.props.onErrorContainer;
  }

  /** @return {number} */
  get background() {
    return this.props.background;
  }

  /** @return {number} */
  get onBackground() {
    return this.props.onBackground;
  }

  /** @return {number} */
  get surface() {
    return this.props.surface;
  }

  /** @return {number} */
  get onSurface() {
    return this.props.onSurface;
  }

  /** @return {number} */
  get surfaceDim() {
    return this.props.surfaceDim;
  }

  /** @return {number} */
  get surfaceBright() {
    return this.props.surfaceBright;
  }

  /** @return {number} */
  get surfaceContainerLowest() {
    return this.props.surfaceContainerLowest;
  }

  /** @return {number} */
  get surfaceContainerLow() {
    return this.props.surfaceContainerLow;
  }

  /** @return {number} */
  get surfaceContainer() {
    return this.props.surfaceContainer;
  }

  /** @return {number} */
  get surfaceContainerHigh() {
    return this.props.surfaceContainerHigh;
  }

  /** @return {number} */
  get surfaceContainerHighest() {
    return this.props.surfaceContainerHighest;
  }

  /** @return {number} */
  get surfaceVariant() {
    return this.props.surfaceVariant;
  }

  /** @return {number} */
  get onSurfaceVariant() {
    return this.props.onSurfaceVariant;
  }

  /** @return {number} */
  get outline() {
    return this.props.outline;
  }

  /** @return {number} */
  get outlineVariant() {
    return this.props.outlineVariant;
  }

  /** @return {number} */
  get shadow() {
    return this.props.shadow;
  }

  /** @return {number} */
  get scrim() {
    return this.props.scrim;
  }

  /** @return {number} */
  get inverseSurface() {
    return this.props.inverseSurface;
  }

  /** @return {number} */
  get inverseOnSurface() {
    return this.props.inverseOnSurface;
  }

  /** @return {number} */
  get inversePrimary() {
    return this.props.inversePrimary;
  }

  toJSON() {
    return {
      ...this.props,
    };
  }
}
