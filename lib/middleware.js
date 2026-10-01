import { parse } from 'cookie';

/**
 * Middleware to parse cookies from the request
 * This ensures req.cookies is always available
 */
export const applyCookieParser = async (req, res) => {
  // If cookies are already parsed, skip
  if (req.cookies) {
    return;
  }
  
  // Parse cookies from the Cookie header
  const cookieHeader = req.headers.cookie || '';
  req.cookies = parse(cookieHeader);
};
