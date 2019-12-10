import produce from 'immer';
import { MERGE_NORMALIZED_MODELS } from './mergeNormalizedModels';
export default (modelName => (state, action) => action.type === MERGE_NORMALIZED_MODELS && action.models[modelName] ? mergeData(state, action.models[modelName]) : state);
export const mergeData = (oldModels, newModels) => produce(oldModels, draftState => Object.values(newModels).forEach(newModel => oldModels[newModel.id] = oldModels[newModel.id] // if old model exists, then merge new model into old model
// TODO: make this recursive. (create an open source function for this if im successful)
? produce(oldModels[newModel.id], draftModel => {
  Object.entries(newModel).forEach(([key, value]) => draftModel[key] = value);
}) // else just assign the new model
: newModel));