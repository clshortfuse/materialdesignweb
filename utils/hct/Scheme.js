/*
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

import CorePalette from './CorePalette.js';

/** Represents a Material color scheme, a mapping of color roles to colors. */
export default class Scheme {
  /**
   * @param {number} [primary]
   * @param {number} [onPrimary]
   * @param {number} [primaryContainer]
   * @param {number} [onPrimaryContainer]
   * @param {number} [secondary]
   * @param {number} [onSecondary]
   * @param {number} [secondaryContainer]
   * @param {number} [onSecondaryContainer]
   * @param {number} [tertiary]
   * @param {number} [onTertiary]
   * @param {number} [tertiaryContainer]
   * @param {number} [onTertiaryContainer]
   * @param {number} [error]
   * @param {number} [onError]
   * @param {number} [errorContainer]
   * @param {number} [onErrorContainer]
   * @param {number} [background]
   * @param {number} [onBackground]
   * @param {number} [surface]
   * @param {number} [onSurface]
   * @param {number} [surfaceVariant]
   * @param {number} [onSurfaceVariant]
   * @param {number} [outline]
   * @param {number} [outlineVariant]
   * @param {number} [shadow]
   * @param {number} [scrim]
   * @param {number} [inverseSurface]
   * @param {number} [inverseOnSurface]
   * @param {number} [inversePrimary]
   */
  constructor(
    primary,
    onPrimary,
    primaryContainer,
    onPrimaryContainer,
    secondary,
    onSecondary,
    secondaryContainer,
    onSecondaryContainer,
    tertiary,
    onTertiary,
    tertiaryContainer,
    onTertiaryContainer,
    error,
    onError,
    errorContainer,
    onErrorContainer,
    background,
    onBackground,
    surface,
    onSurface,
    surfaceVariant,
    onSurfaceVariant,
    outline,
    outlineVariant,
    shadow,
    scrim,
    inverseSurface,
    inverseOnSurface,
    inversePrimary,
  ) {
    this.primary = primary;
    this.onPrimary = onPrimary;
    this.primaryContainer = primaryContainer;
    this.onPrimaryContainer = onPrimaryContainer;
    this.secondary = secondary;
    this.onSecondary = onSecondary;
    this.secondaryContainer = secondaryContainer;
    this.onSecondaryContainer = onSecondaryContainer;
    this.tertiary = tertiary;
    this.onTertiary = onTertiary;
    this.tertiaryContainer = tertiaryContainer;
    this.onTertiaryContainer = onTertiaryContainer;
    this.error = error;
    this.onError = onError;
    this.errorContainer = errorContainer;
    this.onErrorContainer = onErrorContainer;
    this.background = background;
    this.onBackground = onBackground;
    this.surface = surface;
    this.onSurface = onSurface;
    this.surfaceVariant = surfaceVariant;
    this.onSurfaceVariant = onSurfaceVariant;
    this.outline = outline;
    this.outlineVariant = outlineVariant;
    this.shadow = shadow;
    this.scrim = scrim;
    this.inverseSurface = inverseSurface;
    this.inverseOnSurface = inverseOnSurface;
    this.inversePrimary = inversePrimary;
  }

  /**
   * @param {number} argb
   * @return {Scheme}
   */
  static light(argb) {
    return Scheme.#lightFromCorePalette(CorePalette.of(argb));
  }

  /**
   * @param {number} argb
   * @return {Scheme}
   */
  static dark(argb) {
    return Scheme.#darkFromCorePalette(CorePalette.of(argb));
  }

  /**
   * @param {number} argb
   * @return {Scheme}
   */
  static lightContent(argb) {
    return Scheme.#lightFromCorePalette(CorePalette.contentOf(argb));
  }

  /**
   * @param {number} argb
   * @return {Scheme}
   */
  static darkContent(argb) {
    return Scheme.#darkFromCorePalette(CorePalette.contentOf(argb));
  }

  /**
   * Light scheme from core palette
   * @param {CorePalette} core
   * @return {Scheme}
   */
  static #lightFromCorePalette(core) {
    return new Scheme()
      .withPrimary(core.a1.tone(40))
      .withOnPrimary(core.a1.tone(100))
      .withPrimaryContainer(core.a1.tone(90))
      .withOnPrimaryContainer(core.a1.tone(10))
      .withSecondary(core.a2.tone(40))
      .withOnSecondary(core.a2.tone(100))
      .withSecondaryContainer(core.a2.tone(90))
      .withOnSecondaryContainer(core.a2.tone(10))
      .withTertiary(core.a3.tone(40))
      .withOnTertiary(core.a3.tone(100))
      .withTertiaryContainer(core.a3.tone(90))
      .withOnTertiaryContainer(core.a3.tone(10))
      .withError(core.error.tone(40))
      .withOnError(core.error.tone(100))
      .withErrorContainer(core.error.tone(90))
      .withOnErrorContainer(core.error.tone(10))
      .withBackground(core.n1.tone(99))
      .withOnBackground(core.n1.tone(10))
      .withSurface(core.n1.tone(99))
      .withOnSurface(core.n1.tone(10))
      .withSurfaceVariant(core.n2.tone(90))
      .withOnSurfaceVariant(core.n2.tone(30))
      .withOutline(core.n2.tone(50))
      .withOutlineVariant(core.n2.tone(80))
      .withShadow(core.n1.tone(0))
      .withScrim(core.n1.tone(0))
      .withInverseSurface(core.n1.tone(20))
      .withInverseOnSurface(core.n1.tone(95))
      .withInversePrimary(core.a1.tone(80));
  }

  /**
   * Dark scheme from core palette
   * @param {CorePalette} core
   * @return {Scheme}
   */
  static #darkFromCorePalette(core) {
    return new Scheme()
      .withPrimary(core.a1.tone(80))
      .withOnPrimary(core.a1.tone(20))
      .withPrimaryContainer(core.a1.tone(30))
      .withOnPrimaryContainer(core.a1.tone(90))
      .withSecondary(core.a2.tone(80))
      .withOnSecondary(core.a2.tone(20))
      .withSecondaryContainer(core.a2.tone(30))
      .withOnSecondaryContainer(core.a2.tone(90))
      .withTertiary(core.a3.tone(80))
      .withOnTertiary(core.a3.tone(20))
      .withTertiaryContainer(core.a3.tone(30))
      .withOnTertiaryContainer(core.a3.tone(90))
      .withError(core.error.tone(80))
      .withOnError(core.error.tone(20))
      .withErrorContainer(core.error.tone(30))
      .withOnErrorContainer(core.error.tone(90))
      .withBackground(core.n1.tone(10))
      .withOnBackground(core.n1.tone(90))
      .withSurface(core.n1.tone(10))
      .withOnSurface(core.n1.tone(90))
      .withSurfaceVariant(core.n2.tone(30))
      .withOnSurfaceVariant(core.n2.tone(80))
      .withOutline(core.n2.tone(60))
      .withOutlineVariant(core.n2.tone(30))
      .withShadow(core.n1.tone(0))
      .withScrim(core.n1.tone(0))
      .withInverseSurface(core.n1.tone(90))
      .withInverseOnSurface(core.n1.tone(20))
      .withInversePrimary(core.a1.tone(40));
  }

  /**
   * @param {number} primary
   * @return {this}
   */
  withPrimary(primary) {
    this.primary = primary;
    return this;
  }

  /**
   * @param {number} onPrimary
   * @return {this}
   */
  withOnPrimary(onPrimary) {
    this.onPrimary = onPrimary;
    return this;
  }

  /**
   * @param {number} primaryContainer
   * @return {this}
   */
  withPrimaryContainer(primaryContainer) {
    this.primaryContainer = primaryContainer;
    return this;
  }

  /**
   * @param {number} onPrimaryContainer
   * @return {this}
   */
  withOnPrimaryContainer(onPrimaryContainer) {
    this.onPrimaryContainer = onPrimaryContainer;
    return this;
  }

  /**
   * @param {number} secondary
   * @return {this}
   */
  withSecondary(secondary) {
    this.secondary = secondary;
    return this;
  }

  /**
   * @param {number} onSecondary
   * @return {this}
   */
  withOnSecondary(onSecondary) {
    this.onSecondary = onSecondary;
    return this;
  }

  /**
   * @param {number} secondaryContainer
   * @return {this}
   */
  withSecondaryContainer(secondaryContainer) {
    this.secondaryContainer = secondaryContainer;
    return this;
  }

  /**
   * @param {number} onSecondaryContainer
   * @return {this}
   */
  withOnSecondaryContainer(onSecondaryContainer) {
    this.onSecondaryContainer = onSecondaryContainer;
    return this;
  }

  /**
   * @param {number} tertiary
   * @return {this}
   */
  withTertiary(tertiary) {
    this.tertiary = tertiary;
    return this;
  }

  /**
   * @param {number} onTertiary
   * @return {this}
   */
  withOnTertiary(onTertiary) {
    this.onTertiary = onTertiary;
    return this;
  }

  /**
   * @param {number} tertiaryContainer
   * @return {this}
   */
  withTertiaryContainer(tertiaryContainer) {
    this.tertiaryContainer = tertiaryContainer;
    return this;
  }

  /**
   * @param {number} onTertiaryContainer
   * @return {this}
   */
  withOnTertiaryContainer(onTertiaryContainer) {
    this.onTertiaryContainer = onTertiaryContainer;
    return this;
  }

  /**
   * @param {number} error
   * @return {this}
   */
  withError(error) {
    this.error = error;
    return this;
  }

  /**
   * @param {number} onError
   * @return {this}
   */
  withOnError(onError) {
    this.onError = onError;
    return this;
  }

  /**
   * @param {number} errorContainer
   * @return {this}
   */
  withErrorContainer(errorContainer) {
    this.errorContainer = errorContainer;
    return this;
  }

  /**
   * @param {number} onErrorContainer
   * @return {this}
   */
  withOnErrorContainer(onErrorContainer) {
    this.onErrorContainer = onErrorContainer;
    return this;
  }

  /**
   * @param {number} background
   * @return {this}
   */
  withBackground(background) {
    this.background = background;
    return this;
  }

  /**
   * @param {number} onBackground
   * @return {this}
   */
  withOnBackground(onBackground) {
    this.onBackground = onBackground;
    return this;
  }

  /**
   * @param {number} surface
   * @return {this}
   */
  withSurface(surface) {
    this.surface = surface;
    return this;
  }

  /**
   * @param {number} onSurface
   * @return {this}
   */
  withOnSurface(onSurface) {
    this.onSurface = onSurface;
    return this;
  }

  /**
   * @param {number} surfaceVariant
   * @return {this}
   */
  withSurfaceVariant(surfaceVariant) {
    this.surfaceVariant = surfaceVariant;
    return this;
  }

  /**
   * @param {number} onSurfaceVariant
   * @return {this}
   */
  withOnSurfaceVariant(onSurfaceVariant) {
    this.onSurfaceVariant = onSurfaceVariant;
    return this;
  }

  /**
   * @param {number} outline
   * @return {this}
   */
  withOutline(outline) {
    this.outline = outline;
    return this;
  }

  /**
   * @param {number} outlineVariant
   * @return {this}
   */
  withOutlineVariant(outlineVariant) {
    this.outlineVariant = outlineVariant;
    return this;
  }

  /**
   * @param {number} shadow
   * @return {this}
   */
  withShadow(shadow) {
    this.shadow = shadow;
    return this;
  }

  /**
   * @param {number} scrim
   * @return {this}
   */
  withScrim(scrim) {
    this.scrim = scrim;
    return this;
  }

  /**
   * @param {number} inverseSurface
   * @return {this}
   */
  withInverseSurface(inverseSurface) {
    this.inverseSurface = inverseSurface;
    return this;
  }

  /**
   * @param {number} inverseOnSurface
   * @return {this}
   */
  withInverseOnSurface(inverseOnSurface) {
    this.inverseOnSurface = inverseOnSurface;
    return this;
  }

  /**
   * @param {number} inversePrimary
   * @return {this}
   */
  withInversePrimary(inversePrimary) {
    this.inversePrimary = inversePrimary;
    return this;
  }

  /**
   * @param {any} object
    @return {boolean} */
  equals(object) {
    if (this === object) {
      return true;
    }
    if (!(object instanceof Scheme)) {
      return false;
    }

    /** @type {Scheme} */
    const scheme = object;

    if (this.primary !== scheme.primary) {
      return false;
    }
    if (this.onPrimary !== scheme.onPrimary) {
      return false;
    }
    if (this.primaryContainer !== scheme.primaryContainer) {
      return false;
    }
    if (this.onPrimaryContainer !== scheme.onPrimaryContainer) {
      return false;
    }
    if (this.secondary !== scheme.secondary) {
      return false;
    }
    if (this.onSecondary !== scheme.onSecondary) {
      return false;
    }
    if (this.secondaryContainer !== scheme.secondaryContainer) {
      return false;
    }
    if (this.onSecondaryContainer !== scheme.onSecondaryContainer) {
      return false;
    }
    if (this.tertiary !== scheme.tertiary) {
      return false;
    }
    if (this.onTertiary !== scheme.onTertiary) {
      return false;
    }
    if (this.tertiaryContainer !== scheme.tertiaryContainer) {
      return false;
    }
    if (this.onTertiaryContainer !== scheme.onTertiaryContainer) {
      return false;
    }
    if (this.error !== scheme.error) {
      return false;
    }
    if (this.onError !== scheme.onError) {
      return false;
    }
    if (this.errorContainer !== scheme.errorContainer) {
      return false;
    }
    if (this.onErrorContainer !== scheme.onErrorContainer) {
      return false;
    }
    if (this.background !== scheme.background) {
      return false;
    }
    if (this.onBackground !== scheme.onBackground) {
      return false;
    }
    if (this.surface !== scheme.surface) {
      return false;
    }
    if (this.onSurface !== scheme.onSurface) {
      return false;
    }
    if (this.surfaceVariant !== scheme.surfaceVariant) {
      return false;
    }
    if (this.onSurfaceVariant !== scheme.onSurfaceVariant) {
      return false;
    }
    if (this.outline !== scheme.outline) {
      return false;
    }
    if (this.outlineVariant !== scheme.outlineVariant) {
      return false;
    }
    if (this.shadow !== scheme.shadow) {
      return false;
    }
    if (this.scrim !== scheme.scrim) {
      return false;
    }
    if (this.inverseSurface !== scheme.inverseSurface) {
      return false;
    }
    if (this.inverseOnSurface !== scheme.inverseOnSurface) {
      return false;
    }
    if (this.inversePrimary !== scheme.inversePrimary) {
      return false;
    }

    return true;
  }
}
