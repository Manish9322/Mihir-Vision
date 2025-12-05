
import UAParser from 'ua-parser-js';
import crypto from 'crypto';

export function getVisitorId(req) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const uaString = req.headers.get('user-agent') || '';
    
    const hash = crypto.createHash('sha256');
    hash.update(ip + uaString);
    
    return hash.digest('hex');
}

export function parseUserAgent(req) {
    const uaString = req.headers.get('user-agent') || '';
    const parser = new UAParser(uaString);
    const result = parser.getResult();

    return {
        os: result.os.name || 'Other',
        browser: result.browser.name || 'Other',
        deviceType: result.device.type || 'Desktop',
    };
}
