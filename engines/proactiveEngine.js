function getProactiveMessage(memory, emotion) {

  const hour = new Date().getHours()

  // Morning
  if (hour < 12) {
    return "Good morning ☀️ Did you sleep well?"
  }

  // Afternoon
  if (hour < 17) {
    return "Hey, how is your day going?"
  }

  // Evening
  if (hour < 22) {
    return "You’ve been quiet today. What’s on your mind?"
  }

  // Late night
  return "You should probably be sleeping 😅"
}

module.exports = { getProactiveMessage }
