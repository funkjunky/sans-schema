export const MERGE_NORMALIZED_MODELS = 'sans-schema/MERGE_NORMALIZED_MODELS';
export default mergeNormalizedModels = models => ({
  type: MERGE_NORMALIZED_MODELS,
  models
});