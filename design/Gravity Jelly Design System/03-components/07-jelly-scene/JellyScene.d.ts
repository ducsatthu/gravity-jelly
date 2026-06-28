import * as React from 'react';

/**
 * The decorative garden stage below the board: jelly dish/plate, grassy
 * ground, mushrooms, plants, a swaying flower and resident jelly characters.
 * Fills its positioned parent.
 */
export interface JellySceneProps {
  /** Render the catching dish/plate (default true). */
  showDish?: boolean;
  /** Render the resident jelly characters (default true). */
  showCast?: boolean;
  /** Paint a soft band background behind the scene (default true). */
  band?: boolean;
  style?: React.CSSProperties;
}

export function JellyScene(props: JellySceneProps): JSX.Element;
