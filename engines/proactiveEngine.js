function getContextAwareProactive(memory = [], emotion = "neutral") {
  const hour = new Date().getHours();

  // pick last memory if exists
  const last = memory.length ? memory[memory.length - 1] : null;

  // time-based fallback
  let timePrompt;
  if (hour < 12) timePrompt = "Good morning ☀️";
  else if (hour < 17) timePrompt = "Hey, hope your day is going well.";
  else if (hour < 22) timePrompt = "How’s your evening going?";
  else timePrompt = "You’re up late. Everything okay?";

  // emotion-aware
  if (emotion === "sad" || emotion === "nervous") {
    return "You seemed a bit stressed earlier. Want to talk about it?";
  }

  if (emotion === "happy") {
    return "You sounded pretty happy earlier. What made your day good?";
  }

  // memory-aware
  if (last) {
    return `Earlier you mentioned "${last}". How did that turn out?`;
  }

  return timePrompt;
}

module.exports = { getContextAwareProactive };
