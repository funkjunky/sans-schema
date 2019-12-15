import { MERGE_NORMALIZED_MODELS } from './mergeNormalizedModels';
import { mergeData } from './mergeData';

export default modelName => (state, action) =>
  action.type === MERGE_NORMALIZED_MODELS && action.models[modelName]
  ? mergeData(state, action.models[modelName])
  : state;
