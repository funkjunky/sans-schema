import chai from 'chai';
import { stub } from 'sinon';

import { MERGE_NORMALIZED_MODELS } from './mergeNormalizedModels';
import mergeModelReducer from './mergeModelReducer';
import * as mergeDataObj from './mergeData';

var assert = chai.assert;

describe('mergeModelReducer', () => {
  it('Should return old reference state if action type does is not our merge type', () => {
    const state = { a: 'hello' };

    assert.strictEqual(mergeModelReducer('a')(state, { type: 'not merge' }), state);
  });

  it('Should return old reference state if the action models do not contain the modelName key', () => {
    const state = { a: 'hello' };

    assert.strictEqual(mergeModelReducer('a')(state, { models: { b: 'not a' } }), state);
  });

  it('Should call mergeData if the action models do contain the modelName', () => {
    const mergeDataStub = stub(mergeDataObj, 'mergeData').returns();

    const state = { word: 'hello' };
    const action = { type: MERGE_NORMALIZED_MODELS, models: { a: { word: 'yo' } } };
    mergeModelReducer('a')(state, action)

    assert.isOk(mergeDataStub.calledWith(state, action.models.a));
  });
});
