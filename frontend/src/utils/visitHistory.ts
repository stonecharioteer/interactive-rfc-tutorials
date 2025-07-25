// Simple utility for tracking RFC visit history in localStorage

const VISIT_HISTORY_KEY = 'rfc-visit-history';

export interface VisitHistory {
  rfcNumber: number;
  visitedAt: string; // ISO timestamp
  visitCount: number;
}

export const visitHistoryUtils = {
  // Get all visited RFCs
  getVisitedRfcs(): VisitHistory[] {
    try {
      const stored = localStorage.getItem(VISIT_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading visit history:', error);
      return [];
    }
  },

  // Check if an RFC has been visited
  isRfcVisited(rfcNumber: number): boolean {
    const visited = this.getVisitedRfcs();
    return visited.some(visit => visit.rfcNumber === rfcNumber);
  },

  // Record a visit to an RFC
  recordVisit(rfcNumber: number): void {
    try {
      const visited = this.getVisitedRfcs();
      const existingIndex = visited.findIndex(visit => visit.rfcNumber === rfcNumber);
      
      if (existingIndex >= 0) {
        // Update existing visit
        visited[existingIndex].visitedAt = new Date().toISOString();
        visited[existingIndex].visitCount += 1;
      } else {
        // Add new visit
        visited.push({
          rfcNumber,
          visitedAt: new Date().toISOString(),
          visitCount: 1,
        });
      }

      localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(visited));
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  },

  // Get visit statistics
  getVisitStats() {
    const visited = this.getVisitedRfcs();
    return {
      totalVisited: visited.length,
      totalVisits: visited.reduce((sum, visit) => sum + visit.visitCount, 0),
      mostRecentVisit: visited.length > 0 
        ? visited.reduce((latest, visit) => 
            new Date(visit.visitedAt) > new Date(latest.visitedAt) ? visit : latest
          )
        : null,
    };
  },

  // Clear all visit history (for testing/reset)
  clearHistory(): void {
    localStorage.removeItem(VISIT_HISTORY_KEY);
  }
};