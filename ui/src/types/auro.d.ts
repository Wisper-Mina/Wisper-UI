interface SignedData {
  publicKey: string;
  data: string;
  signature: {
    field: string;
    scalar: string;
  };
}

interface ProviderError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

type SignedResponse = SignedData | ProviderError;

type SignMessageArgs = {
  message: string;
};

declare global {
  interface Window {
    mina: any;
  }
}

export type { SignedData, ProviderError, SignMessageArgs, SignedResponse };
