declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.txt" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  export default value;
}

declare module "*.json" {
  const value: any;
  export default value;
}
