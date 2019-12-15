export const MERGE_NORMALIZED_MODELS = 'sans-schema/MERGE_NORMALIZED_MODELS';

const mergeNormalizedModels = models => ({
  type: MERGE_NORMALIZED_MODELS,
  models,
})

export default mergeNormalizedModels;
