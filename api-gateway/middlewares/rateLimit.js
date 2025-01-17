const requestCounts = {} // Đối tượng để lưu số lượng yêu cầu từ mỗi địa chỉ IP
const interval = 60 * 1000 // 1 phút (60 giây) tính bằng mili giây

// Đặt lại số lượng yêu cầu sau mỗi khoảng thời gian (1 phút)
setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0 // Đặt lại số lượng yêu cầu của mỗi IP về 0
  })
}, interval)

function rateLimitAndTimeout(route, rateLimit, timeout) {
  return (req, res, next) => {
    const ip = req.ip // Lấy địa chỉ IP của yêu cầu
    requestCounts[ip] = (requestCounts[ip] || 0) + 1 // Tăng số lượng yêu cầu của IP lên 1

    // Kiểm tra nếu số lượng yêu cầu vượt quá giới hạn
    if (requestCounts[ip] > rateLimit) {
      return res.status(429).json({
        code: 429,
        message: 'Rate limit exceeded.' // Trả về lỗi 429 nếu vượt quá giới hạn
      })
    }

    console.log(`Request to ${route} from IP: ${ip}`) // Ghi log thông tin yêu cầu

    // Đặt thời gian chờ cho yêu cầu
    req.setTimeout(timeout, () => {
      console.log(`Request to ${route} from IP: ${ip} timed out after ${timeout}ms`)
      res.status(504).json({
        code: 504,
        message: 'Gateway timeout.' // Trả về lỗi 504 nếu yêu cầu bị timeout
      })
      req.abort() // Hủy yêu cầu
    })

    // Ghi lại thời gian bắt đầu của yêu cầu
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`Request to ${route} from IP: ${ip} completed in ${duration}ms`)
    })

    next() // Chuyển tiếp yêu cầu đến middleware tiếp theo
  }
}

module.exports = rateLimitAndTimeout