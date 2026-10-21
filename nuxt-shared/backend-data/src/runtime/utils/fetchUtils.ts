/**
 * Returns standard default fetch options for browser and server requests.
 */
export const getDefaultFetchOptions = (): Record<string, string> => {
    const options: Record<string, string> = {};

    if (typeof Request !== 'undefined' && Request.prototype.hasOwnProperty('mode')) {
        options.mode = 'cors';
    }

    if (typeof Request !== 'undefined' && Request.prototype.hasOwnProperty('credentials')) {
        options.credentials = 'include';
    }

    return options;
};
