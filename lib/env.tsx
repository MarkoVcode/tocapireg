
import pack from '../package.json';

export const VERSION = pack.version;
export const AWS_BRANCH = process.env.AWS_BRANCH;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ENDPOINT = process.env.AWS_ENDPOINT;

export const isProduction = () => {
    return AWS_BRANCH === 'main';
}

export const isDevelopment = () => {
    return AWS_BRANCH === 'develop';
}

export const getTableName = () => {
    if (isProduction()) {
        return 'tocModelsRegistry';
    }
    return 'tocModelsRegistry-development';
}