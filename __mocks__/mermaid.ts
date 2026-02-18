export const initialize = jest.fn();
export const contentLoaded = jest.fn();
export const render = jest.fn().mockResolvedValue({ svg: '<svg></svg>', bindFunctions: jest.fn() });
export const parse = jest.fn().mockReturnValue({});
export const updateDiagrams = jest.fn();
export const getDiagramsFromText = jest.fn().mockReturnValue([]);
export const setParseOptions = jest.fn();
export const run = jest.fn();
export const diagramAPI = {
  render: jest.fn().mockResolvedValue({ svg: '<svg></svg>', bindFunctions: jest.fn() })
};

// 默认导出
export default {
  initialize,
  contentLoaded,
  render,
  parse,
  updateDiagrams,
  getDiagramsFromText,
  setParseOptions,
  diagramAPI,
  run
};
