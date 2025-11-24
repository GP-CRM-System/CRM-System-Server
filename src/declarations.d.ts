declare module "rate-limit-mongo";
declare module "passport-google-oauth20";
declare module "helmet" {
  import { RequestHandler } from "express";
  type HelmetOptions = Record<string, unknown>;
  function helmet(options?: HelmetOptions): RequestHandler;
  export default helmet;
}
