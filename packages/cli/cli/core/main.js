const connected = (callback) => {
  callback(features);
}


module.exports = (context) => {
  const { assist, cwd, git, preferences, } = context
}

const shipper = [
  // Check Filesystem/Operating System
    // Get cwd + Node Environment
  // Get git
    // Resolve potential git issues
    // Sync with proper stage
  // Get package.json
    // Get needed dependencies, install if not available.
  // 
]