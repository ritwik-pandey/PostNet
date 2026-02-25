const redisClient = require("./createClient");

const rateLimitPost = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const key = `post_limit:${userId}`;

    const result = await redisClient.set(key, "1", {
      EX: 60,   
      NX: true
    });

    if (result === null) {
      return res.status(429).json({
        message: "You can only post once per minute"
      });
    }

    next();

  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
};

module.exports = rateLimitPost;