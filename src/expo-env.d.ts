/// <reference types="expo" />

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.jpeg' {
  const value: any;
  export = value;
}

declare module '*.gif' {
  const value: any;
  export = value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// Environment variables
declare module '@env' {
  export const API_URL: string;
  export const API_KEY: string;
  export const ENVIRONMENT: string;
  export const DEBUG: boolean;
}