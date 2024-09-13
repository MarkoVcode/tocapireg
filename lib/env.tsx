
import pack from '../package.json';

export const VERSION = pack.version;
export const AWS_BRANCH = process.env.AWS_BRANCH;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCOUNT = process.env.AWS_ACCOUNT;
export const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
export const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
export const AWS_TABLE = process.env.AWS_TABLE;
export const AWS_INDEX = process.env.AWS_INDEX;