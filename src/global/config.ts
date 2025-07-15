interface Config {
  feeMarginPercentage: {
    maxFee: number;
    bounds: {
      l1_gas: {
        max_amount: string;
        max_price_per_unit: string;
      };
      l2_gas: {
        max_amount: string;
        max_price_per_unit: string;
      };
    };
  };
}

const defaultConfig: Config = {
  feeMarginPercentage: {
    maxFee: 50,
    bounds: {
      l1_gas: {
        max_amount: '0',
        max_price_per_unit: '0',
      },
      l2_gas: {
        max_amount: '0',
        max_price_per_unit: '0',
      },
    },
  },
};

class ConfigManager {
  private config: Config = defaultConfig;

  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  set<K extends keyof Config>(key: K, value: Config[K]): void {
    this.config[key] = value;
  }
}

export const config = new ConfigManager(); 
