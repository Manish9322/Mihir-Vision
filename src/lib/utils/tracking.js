
import useragent from 'useragent';
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
    const agent = useragent.parse(uaString);

    const os = agent.os.family;
    const browser = agent.family;
    let deviceType = 'Other';

    if (agent.isDesktop) deviceType = 'Desktop';
    if (agent.isMobile) deviceType = 'Mobile';
    if (agent.isTablet) deviceType = 'Tablet';
    if (agent.isTv) deviceType = 'TV';

    return {
        os,
        browser,
        deviceType
    };
}
