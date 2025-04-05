const express = require('express');
const router = express.Router();

router.get('/debug', async (req, res) => {
  try {
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      mongodbState: mongoose.connection.readyState,
      vercelRegion: process.env.VERCEL_REGION,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      envVars: {
        hasMongoUri: !!process.env.SECRET_URI,
        hasFrontendUrl: !!process.env.FRONTEND_URL,
        // Add other env vars checks (without exposing values)
      }
    };
    res.json(debugInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;