 const requestCounts = {};
 const interval = 60 * 1000; // 1 minute
 // Reset requestCounts sau moi interval (phut)
 setInterval(() => {
   Object.keys(requestCounts).forEach((ip) => {
     requestCounts[ip] = 0;
   });
 }, interval);

 function rateLimitAndTimeout(route, rateLimit, timeout) {
   return (req, res, next) => {
     const ip = req.ip;
     requestCounts[ip] = (requestCounts[ip] || 0) + 1;

     if (requestCounts[ip] > rateLimit) {
       return res.status(429).json({
         code: 429,
         message: 'Rate limit exceeded.'
       });
     }

     req.setTimeout(timeout, () => {
       res.status(504).json({
         code: 504,
         message: 'Gateway timeout.'
       });
       req.abort();
     });
     next();
   };
 }

 module.exports = rateLimitAndTimeout;