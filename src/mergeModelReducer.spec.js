import chai from 'chai';

import mergeModelReducer, { mergeData } from './mergeModelReducer';

describe('mergeData', () => {
  it('should leave values that dont match any keys with the same reference', () => {
  });

  it('should update the value of an old model with the correct value and a new reference', () => {
  });

  // TODO: test recursive merge, once it's made
});

describe('mergeModelReducer', () => {
  it('Should return old reference state if action type does is not our merge type', () => {
  });

  it('Should return old reference state if the action models do not contain the modelName key', () => {
  });

  it('Should call mergeData if the action models do contain the modelName', () => {
  });
});
