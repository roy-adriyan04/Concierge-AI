import { parse, addMinutes, startOfDay, format, isAfter, isBefore, isEqual } from 'date-fns';

/**
 * Parses strings like "Tue–Thu 2–5 PM" or "Mon, Wed, Fri 10 AM - 12 PM"
 * Returns an array of availability intervals for a given week reference.
 */
export class AvailabilityParser {
  static DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  static parseString(input) {
    const results = [];
    const lines = input.split(/[\n,;]+/).filter(l => l.trim());

    for (const line of lines) {
      const match = line.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:\s*[-–]\s*(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?\s+(.*)/i);
      if (!match) continue;

      const startDay = match[1];
      const endDay = match[2] || startDay;
      const timeStr = match[3];

      const daysInRange = this.getDaysBetween(startDay, endDay);
      const timeIntervals = this.parseTimeIntervals(timeStr);

      for (const day of daysInRange) {
        for (const interval of timeIntervals) {
          results.push({ day, ...interval });
        }
      }
    }
    return results;
  }

  static getDaysBetween(start, end) {
    const sIdx = this.DAYS.indexOf(start);
    const eIdx = this.DAYS.indexOf(end);
    if (sIdx === -1 || eIdx === -1) return [start];
    
    const range = [];
    for (let i = sIdx; i <= eIdx; i++) {
      range.push(this.DAYS[i]);
    }
    return range;
  }

  static parseTimeIntervals(timeStr) {
    // Matches "2-5 PM" or "10 AM - 12 PM"
    const intervals = [];
    const parts = timeStr.split(/and|\&/).map(p => p.trim());
    
    for (const part of parts) {
        const timeMatch = part.match(/(\d+(?::\d+)?)\s*(AM|PM)?\s*[-–]\s*(\d+(?::\d+)?)\s*(AM|PM)?/i);
        if (timeMatch) {
            let [, startVal, startSuf, endVal, endSuf] = timeMatch;
            
            // If only end has suffix, assume start has same (e.g. 2-5 PM -> 2 PM - 5 PM)
            if (!startSuf && endSuf) startSuf = endSuf;
            
            const start24 = this.to24h(startVal, startSuf);
            const end24 = this.to24h(endVal, endSuf);
            
            intervals.push({ start: start24, end: end24 });
        }
    }
    return intervals;
  }

  static to24h(val, suffix) {
    let [h, m] = val.split(':').map(Number);
    m = m || 0;
    suffix = suffix?.toUpperCase();

    if (suffix === 'PM' && h < 12) h += 12;
    if (suffix === 'AM' && h === 12) h = 0;
    
    return h + m / 60;
  }
}
