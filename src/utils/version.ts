// Single source of truth for the app version: package.json.
// (A named import lets the bundler keep only this one field.)
import { version } from '../../package.json';

export const APP_VERSION: string = version;
