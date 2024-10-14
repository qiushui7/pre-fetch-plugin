export interface ReqObj {
  key: string;
  method: string;
  url: string;
  queryParams: Record<string, any>;
  cookieParams: Record<string, any>;
  staticParams: Record<string, any>;
}

export interface OptionType {
  pathList: string[];
  hashList: string[];
  reqs: ReqObj[];
}

export interface PreFetchPluginOptions {
  options: OptionType[];
}
