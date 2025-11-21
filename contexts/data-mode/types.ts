export type DataMode = 'mock' | 'real';

export interface DataModeConfig {
  mode: DataMode;
}

export const defaultDataModeConfig: DataModeConfig = {
  mode: 'real',
};
