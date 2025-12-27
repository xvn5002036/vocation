import { FIRE_MARSHALS } from './marshals/fire';
import { METAL_MARSHALS } from './marshals/metal';
import { WATER_MARSHALS } from './marshals/water';
import { EARTH_MARSHALS } from './marshals/earth';
import { WOOD_MARSHALS } from './marshals/wood';

export const MARSHAL_DATA_STATIC = {
  ...FIRE_MARSHALS,
  ...METAL_MARSHALS,
  ...WATER_MARSHALS,
  ...EARTH_MARSHALS,
  ...WOOD_MARSHALS
};
