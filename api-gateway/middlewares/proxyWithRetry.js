// function retryMiddleware(options = {}) {
//   const {
//     retries = 3,
//     retryDelay = 250,
//     shouldRetry
//   } = options;

//   return async (req, res, next) => {
//     let attempt = 0;
//     let lastError;
//     let sent = false;

//     // Patch res methods to detect if response has been sent
//     const markSent = () => { sent = true; };
//     const origEnd = res.end;
//     const origSend = res.send;
//     const origJson = res.json;

//     res.end = function (...args) {
//       markSent();
//       return origEnd.apply(res, args);
//     };
//     res.send = function (...args) {
//       markSent();
//       return origSend.apply(res, args);
//     };
//     res.json = function (...args) {
//       markSent();
//       return origJson.apply(res, args);
//     };

//     while (attempt < retries && !sent) {
//       try {
//         await new Promise((resolve, reject) => {
//           next((err) => {
//             if (err) reject(err);
//             else resolve();
//           });
//         });

//         if (sent) break;
//         // Đã thành công, không bị lỗi
//         return;
//       } catch (err) {
//         lastError = err;
//         if (typeof shouldRetry === 'function' && !shouldRetry(err, req, res)) break;

//         if (!err.status || err.status >= 500) {
//           attempt++;
//           if (attempt < retries) await new Promise(r => setTimeout(r, retryDelay));
//         } else {
//           break; // 4xx hoặc lỗi không retry
//         }
//       }
//     }

//     // Khôi phục các hàm gốc
//     res.end = origEnd;
//     res.send = origSend;
//     res.json = origJson;

//     if (!sent) {
//       if (lastError) {
//         res.status(lastError.status || 500).json({
//           code: lastError.status || 500,
//           message: lastError.message || 'Internal Server Error (after retries)'
//         });
//       } else {
//         res.status(500).json({
//           code: 500,
//           message: 'Unknown failure (retry middleware)'
//         });
//       }
//     }
//   };
// }

// module.exports = retryMiddleware;
const { createProxyMiddleware } = require('http-proxy-middleware');

function proxyWithRetry(options) {
  const { retries = 3, retryDelay = 250, ...proxyOptions } = options;

  return (req, res, next) => {
    let attempt = 0;

    function proxyRequest() {
      attempt++;
      const proxy = createProxyMiddleware({
        ...proxyOptions,
        onError(err, req, res) {
          if (attempt < retries) {
            setTimeout(proxyRequest, retryDelay);
          } else {
            res.status(502).json({ code: 502, message: 'Bad Gateway (after retries)' });
          }
        }
      });
      proxy(req, res, next);
    }

    proxyRequest();
  };
}

module.exports = proxyWithRetry;