export class SchedulerEngine {
  /**
   * Finds overlaps between candidate and all interviewers.
   * @param {Array} candidateAvailability 
   * @param {Array} interviewerAvailabilities Array of availability arrays
   */
  static findCommonSlots(candidateAvail, interviewersAvail, durationMinutes = 60) {
    const slots = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    for (const day of days) {
      const candDay = candidateAvail.filter(a => a.day === day);
      if (candDay.length === 0) continue;

      // Group interviewer availability by day
      const intDay = interviewersAvail.map(ia => ia.filter(a => a.day === day));

      // Find intersection of ALL participants for a "Golden Slot"
      // Simplification: Check every 30min block
      for (let hour = 8; hour <= 20; hour += 0.5) {
        const endHour = hour + durationMinutes / 60;
        
        const isCandAvailable = candDay.some(a => hour >= a.start && endHour <= a.end);
        if (!isCandAvailable) continue;

        const availableInterviewerIndices = [];
        intDay.forEach((avail, idx) => {
          if (avail.some(a => hour >= a.start && endHour <= a.end)) {
            availableInterviewerIndices.push(idx);
          }
        });

        if (availableInterviewerIndices.length > 0) {
            slots.push({
                day,
                start: hour,
                end: endHour,
                participants: availableInterviewerIndices.length,
                totalParticipants: interviewersAvail.length,
                isFullPanel: availableInterviewerIndices.length === interviewersAvail.length,
                interviewerIndices: availableInterviewerIndices
            });
        }
      }
    }

    // Post-process to merge consecutive slots and rank them
    return this.rankSlots(this.mergeSlots(slots));
  }

  static mergeSlots(slots) {
    if (slots.length === 0) return [];
    
    // Simple dedupe and merge for now
    const unique = [];
    slots.forEach(s => {
        const existing = unique.find(u => u.day === s.day && u.start === s.start && u.end === s.end);
        if (!existing) unique.push(s);
    });
    return unique;
  }

  static rankSlots(slots) {
    return slots
      .map(slot => {
        let score = (slot.participants / slot.totalParticipants) * 100;
        
        // Boost for Golden Slots (Full Panel)
        if (slot.isFullPanel) score += 20;

        // Heuristic: Prefer 10 AM - 12 PM or 2 PM - 4 PM
        if (slot.start >= 10 && slot.end <= 12) score += 10;
        if (slot.start >= 14 && slot.end <= 16) score += 10;

        // Penalty for late evening or early morning
        if (slot.start < 9) score -= 15;
        if (slot.end > 18) score -= 15;

        return { ...slot, score: Math.min(100, Math.max(0, score)) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Return top 5
  }

  static getReasoning(slot) {
    if (slot.isFullPanel) {
      return "This slot aligns perfectly with the entire panel's schedule. Zero conflicts detected among all participants.";
    }
    if (slot.participants >= slot.totalParticipants - 1) {
      return `Solid coverage with ${slot.participants} of ${slot.totalParticipants} interviewers. High likelihood of minimal rescheduling.`;
    }
    return "Viable window but requires minor adjustments from some panel members.";
  }
}
