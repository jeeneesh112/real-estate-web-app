import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// ============================================
// 📊 TYPE DEFINITIONS
// ============================================

export type EventType =
  | 'PROJECT_VIEW'
  | 'TOWER_VIEW'
  | 'FLAT_VIEW'
  | 'VIRTUAL_TOUR_START'
  | 'VIRTUAL_TOUR_END'
  | 'APPOINTMENT_BOOKED'
  | 'RENT_INTEREST'
  | 'BUY_INTEREST';

export type FlatType = '1BHK' | '2BHK' | '3BHK' | '4BHK';
export type IntentType = 'RENT' | 'BUY' | 'BOTH';

export interface AnalyticsEvent {
  id: number;
  eventType: EventType;
  
  clientId: number;
  projectId?: string;
  projectName?: string;
  towerId?: string;
  towerName?: string;
  flatId?: string;
  
  flatType?: FlatType;
  intentType?: IntentType;
  
  userId: number;
  userName: string;
  userEmail?: string;
  userCity?: string;
  
  durationSeconds?: number;
  appointmentDate?: string;
  notes?: string;
  
  timestamp: string;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  loading: boolean;
  error: string | null;
}

// ============================================
// 🗄️ LARGE REALISTIC MOCK DATA
// ============================================

const MOCK_EVENTS: AnalyticsEvent[] = [
  // ========== PROJECT VIEWS ==========
  { id: 1, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 'proj-ahm-001', projectName: 'Riverfront Heights', userId: 1001, userName: 'Rahul Patel', userCity: 'Ahmedabad', timestamp: '2025-12-15T09:00:00Z' },
  { id: 2, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 'proj-ahm-002', projectName: 'Shantigram Residency', userId: 1002, userName: 'Priya Shah', userCity: 'Ahmedabad', timestamp: '2025-12-15T09:10:00Z' },
  { id: 3, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 'proj-gnd-001', projectName: 'Capital Greens', userId: 1003, userName: 'Amit Mehta', userCity: 'Gandhinagar', timestamp: '2025-12-15T09:20:00Z' },

  // ========== FLAT VIEWS ==========
  { id: 10, eventType: 'FLAT_VIEW', clientId: 101, projectId: 'proj-ahm-001', towerId: 'A', flatId: 'A-101', flatType: '3BHK', userId: 1001, userName: 'Rahul Patel', userCity: 'Ahmedabad', timestamp: '2025-12-15T09:05:00Z' },
  { id: 11, eventType: 'FLAT_VIEW', clientId: 101, projectId: 'proj-gnd-001', towerId: 'B', flatId: 'B-201', flatType: '2BHK', userId: 1003, userName: 'Amit Mehta', userCity: 'Gandhinagar', timestamp: '2025-12-15T09:25:00Z' },

  // ========== BUY INTEREST ==========
  { id: 20, eventType: 'BUY_INTEREST', clientId: 101, projectId: 'proj-ahm-001', towerId: 'A', flatId: 'A-101', flatType: '3BHK', intentType: 'BUY', userId: 1001, userName: 'Rahul Patel', userCity: 'Ahmedabad', timestamp: '2025-12-15T09:10:00Z' },

  // ========== RENT INTEREST ==========
  { id: 21, eventType: 'RENT_INTEREST', clientId: 101, projectId: 'proj-gnd-001', towerId: 'B', flatId: 'B-201', flatType: '2BHK', intentType: 'RENT', userId: 1003, userName: 'Amit Mehta', userCity: 'Gandhinagar', timestamp: '2025-12-15T09:30:00Z' },

  // ========== VIRTUAL TOUR ==========
  { id: 30, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 'proj-ahm-001', towerId: 'A', flatId: 'A-101', flatType: '3BHK', userId: 1001, userName: 'Rahul Patel', userCity: 'Ahmedabad', timestamp: '2025-12-15T09:12:00Z' },
  { id: 31, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 'proj-ahm-001', towerId: 'A', flatId: 'A-101', flatType: '3BHK', userId: 1001, userName: 'Rahul Patel', userCity: 'Ahmedabad', durationSeconds: 420, timestamp: '2025-12-15T09:19:00Z' },

  // ========== APPOINTMENT ==========
  { 
    id: 40, 
    eventType: 'APPOINTMENT_BOOKED', 
    clientId: 101, 
    projectId: 'proj-ahm-001', 
    projectName: 'Riverfront Heights',
    towerId: 'A', 
    flatId: 'A-101', 
    flatType: '3BHK', 
    userId: 1001, 
    userName: 'Rahul Patel', 
    userCity: 'Ahmedabad', 
    appointmentDate: '2025-12-22T10:00:00Z',
    notes: 'Interested in river-facing unit',
    timestamp: '2025-12-15T09:25:00Z' 
  },
];


// ============================================
// 📦 INITIAL STATE
// ============================================

const initialState: AnalyticsState = {
  events: MOCK_EVENTS,
  loading: false,
  error: null,
};

// ============================================
// 🔧 SLICE & REDUCERS
// ============================================

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<AnalyticsEvent[]>) => {
      state.events = action.payload;
      state.error = null;
    },
    addEvent: (state, action: PayloadAction<AnalyticsEvent>) => {
      state.events.unshift(action.payload);
    },
    clearAnalytics: (state) => {
      state.events = [];
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setEvents, addEvent, clearAnalytics, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;

// ============================================
// 🔍 BASE SELECTORS
// ============================================

const selectAnalyticsState = (state: RootState) => state.analytics;
const selectAllEvents = (state: RootState) => state.analytics.events;

// Helper: Filter events by clientId
const selectClientEvents = createSelector(
  [selectAllEvents, (_state: RootState, clientId: number) => clientId],
  (events, clientId) => events.filter((e) => e.clientId === clientId)
);

// ============================================
// 📌 KPI CARD SELECTORS
// ============================================

/** Total project views for a client */
export const selectTotalProjectViews = createSelector(
  [selectClientEvents],
  (events) => events.filter((e) => e.eventType === 'PROJECT_VIEW').length
);

/** Total virtual tours completed for a client */
export const selectTotalVirtualTours = createSelector(
  [selectClientEvents],
  (events) => events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END').length
);

/** Total appointments booked for a client */
export const selectTotalAppointments = createSelector(
  [selectClientEvents],
  (events) => events.filter((e) => e.eventType === 'APPOINTMENT_BOOKED').length
);

/** Rent vs Buy ratio - returns { rent: number, buy: number } */
export const selectRentVsBuyRatio = createSelector(
  [selectClientEvents],
  (events) => {
    const rent = events.filter((e) => e.eventType === 'RENT_INTEREST').length;
    const buy = events.filter((e) => e.eventType === 'BUY_INTEREST').length;
    return { rent, buy };
  }
);

/** Average virtual tour duration in minutes */
export const selectAverageTourDuration = createSelector(
  [selectClientEvents],
  (events) => {
    const completedTours = events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END');
    if (completedTours.length === 0) return 0;
    const totalSeconds = completedTours.reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
    return Math.round((totalSeconds / completedTours.length) / 60); // Convert to minutes
  }
);

/** Total unique users/visitors */
export const selectTotalUniqueUsers = createSelector(
  [selectClientEvents],
  (events) => {
    const uniqueUserIds = new Set(events.map((e) => e.userId));
    return uniqueUserIds.size;
  }
);

// ============================================
// 📌 TOP INSIGHTS SELECTORS
// ============================================

/** Most viewed project - returns { projectId, projectName, count } */
export const selectMostViewedProject = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = events.filter((e) => e.eventType === 'PROJECT_VIEW');

    const projectCounts: Record<string, { projectId: string; projectName: string; count: number }> = {};

    projectViews.forEach((e) => {
      if (e.projectId) {
        const pid = String(e.projectId);

        if (!projectCounts[pid]) {
          projectCounts[pid] = {
            projectId: pid,
            projectName: e.projectName || pid,
            count: 0,
          };
        }

        projectCounts[pid].count++;
      }
    });

    const sorted = Object.values(projectCounts).sort((a, b) => b.count - a.count);
    return sorted[0] || null;
  }
);


/** Top 5 viewed projects with counts */
export const selectTop5ViewedProjects = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = events.filter((e) => e.eventType === 'PROJECT_VIEW');

    const projectCounts: Record<string, { projectId: string; projectName: string; count: number }> = {};

    projectViews.forEach((e) => {
      if (e.projectId) {
        const pid = String(e.projectId);

        if (!projectCounts[pid]) {
          projectCounts[pid] = {
            projectId: pid,
            projectName: e.projectName || pid,
            count: 0,
          };
        }

        projectCounts[pid].count++;
      }
    });

    return Object.values(projectCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
);


/** Most viewed tower - returns { towerId, towerName, count } */
export const selectMostViewedTower = createSelector(
  [selectClientEvents],
  (events) => {
    const towerViews = events.filter((e) => e.eventType === 'TOWER_VIEW');

    const towerCounts: Record<string, { towerId: string; towerName: string; count: number }> = {};

    towerViews.forEach((e) => {
      if (e.towerId) {
        const tid = String(e.towerId);

        if (!towerCounts[tid]) {
          towerCounts[tid] = {
            towerId: tid,
            towerName: e.towerName || tid,
            count: 0,
          };
        }

        towerCounts[tid].count++;
      }
    });

    const sorted = Object.values(towerCounts).sort((a, b) => b.count - a.count);
    return sorted[0] || null;
  }
);


/** Most viewed flat type - returns { flatType, count } */
export const selectMostViewedFlatType = createSelector(
  [selectClientEvents],
  (events) => {
    const flatViews = events.filter((e) => e.eventType === 'FLAT_VIEW' && e.flatType);
    const flatTypeCounts: Record<string, number> = {};
    
    flatViews.forEach((e) => {
      if (e.flatType) {
        flatTypeCounts[e.flatType] = (flatTypeCounts[e.flatType] || 0) + 1;
      }
    });

    const sorted = Object.entries(flatTypeCounts)
      .map(([flatType, count]) => ({ flatType, count }))
      .sort((a, b) => b.count - a.count);
    
    return sorted[0] || null;
  }
);

/** All flat type preferences with counts */
export const selectFlatTypePreferences = createSelector(
  [selectClientEvents],
  (events) => {
    const flatViews = events.filter((e) => e.eventType === 'FLAT_VIEW' && e.flatType);
    const flatTypeCounts: Record<string, number> = {};
    
    flatViews.forEach((e) => {
      if (e.flatType) {
        flatTypeCounts[e.flatType] = (flatTypeCounts[e.flatType] || 0) + 1;
      }
    });

    return Object.entries(flatTypeCounts)
      .map(([flatType, count]) => ({ flatType, count }))
      .sort((a, b) => b.count - a.count);
  }
);

// ============================================
// 📌 FUNNEL ANALYTICS SELECTORS
// ============================================

/** Users who viewed flats but didn't book appointment */
export const selectUsersViewedButNoAppointment = createSelector(
  [selectClientEvents],
  (events) => {
    const viewedUsers = new Set(
      events
        .filter((e) => e.eventType === 'FLAT_VIEW')
        .map((e) => e.userId)
    );
    
    const bookedUsers = new Set(
      events
        .filter((e) => e.eventType === 'APPOINTMENT_BOOKED')
        .map((e) => e.userId)
    );

    const notBookedUsers = Array.from(viewedUsers).filter((userId) => !bookedUsers.has(userId));
    return notBookedUsers.length;
  }
);

/** Users who completed tour but didn't book */
export const selectUsersCompletedTourButNoBooking = createSelector(
  [selectClientEvents],
  (events) => {
    const tourUsers = new Set(
      events
        .filter((e) => e.eventType === 'VIRTUAL_TOUR_END')
        .map((e) => e.userId)
    );
    
    const bookedUsers = new Set(
      events
        .filter((e) => e.eventType === 'APPOINTMENT_BOOKED')
        .map((e) => e.userId)
    );

    const notBookedUsers = Array.from(tourUsers).filter((userId) => !bookedUsers.has(userId));
    return notBookedUsers.length;
  }
);

/** Conversion funnel data */
export const selectConversionFunnel = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = new Set(events.filter((e) => e.eventType === 'PROJECT_VIEW').map((e) => e.userId));
    const flatViews = new Set(events.filter((e) => e.eventType === 'FLAT_VIEW').map((e) => e.userId));
    const tours = new Set(events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END').map((e) => e.userId));
    const appointments = new Set(events.filter((e) => e.eventType === 'APPOINTMENT_BOOKED').map((e) => e.userId));

    return {
      projectViews: projectViews.size,
      flatViews: flatViews.size,
      virtualTours: tours.size,
      appointments: appointments.size,
    };
  }
);

// ============================================
// 📌 RECENT ACTIVITY SELECTORS
// ============================================

/** Last 5 appointments with full details */
export const selectLast5Appointments = createSelector(
  [selectClientEvents],
  (events) => {
    return events
      .filter((e) => e.eventType === 'APPOINTMENT_BOOKED')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }
);

/** Last 5 virtual tours with duration */
export const selectLast5VirtualTours = createSelector(
  [selectClientEvents],
  (events) => {
    return events
      .filter((e) => e.eventType === 'VIRTUAL_TOUR_END')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }
);

/** Recent user activities (configurable limit) */
export const selectRecentUserActivities = createSelector(
  [selectClientEvents, (_state: RootState, _clientId: number, limit: number = 10) => limit],
  (events, limit) => {
    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
);

// ============================================
// 📌 CHART DATA SELECTORS (UI-READY)
// ============================================

/** Project views chart data - ready for bar/line charts */
export const selectProjectViewsChartData = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = events.filter((e) => e.eventType === 'PROJECT_VIEW');
    const projectCounts: Record<string, number> = {};
    
    projectViews.forEach((e) => {
      const name = e.projectName || `Project ${e.projectId}`;
      projectCounts[name] = (projectCounts[name] || 0) + 1;
    });

    return {
      labels: Object.keys(projectCounts),
      data: Object.values(projectCounts),
    };
  }
);

/** Tower views chart data for a specific project */
export const selectTowerViewsChartData = createSelector(
  [
    selectAllEvents,
    (_state: RootState, projectId: string) => projectId,
  ],
  (events, projectId) => {
    const pid = String(projectId);

    const towerViews = events.filter(
      (e) => e.eventType === 'TOWER_VIEW' && String(e.projectId) === pid
    );

    const towerCounts: Record<string, number> = {};

    towerViews.forEach((e) => {
      const name = e.towerName || String(e.towerId);
      towerCounts[name] = (towerCounts[name] || 0) + 1;
    });

    return {
      labels: Object.keys(towerCounts),
      data: Object.values(towerCounts),
    };
  }
);


/** Flat type interest chart data - ready for pie/doughnut charts */
export const selectFlatTypeInterestChartData = createSelector(
  [selectClientEvents],
  (events) => {
    const flatViews = events.filter((e) => e.eventType === 'FLAT_VIEW' && e.flatType);
    const flatTypeCounts: Record<string, number> = {};
    
    flatViews.forEach((e) => {
      if (e.flatType) {
        flatTypeCounts[e.flatType] = (flatTypeCounts[e.flatType] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(flatTypeCounts),
      data: Object.values(flatTypeCounts),
    };
  }
);

/** Tour duration histogram - buckets of time ranges */
export const selectTourDurationHistogram = createSelector(
  [selectClientEvents],
  (events) => {
    const completedTours = events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END');
    const buckets = {
      '0-5 min': 0,
      '5-10 min': 0,
      '10-15 min': 0,
      '15+ min': 0,
    };

    completedTours.forEach((e) => {
      const minutes = (e.durationSeconds || 0) / 60;
      if (minutes <= 5) buckets['0-5 min']++;
      else if (minutes <= 10) buckets['5-10 min']++;
      else if (minutes <= 15) buckets['10-15 min']++;
      else buckets['15+ min']++;
    });

    return {
      labels: Object.keys(buckets),
      data: Object.values(buckets),
    };
  }
);

/** Daily activity trend - events per day for the last 7 days */
export const selectDailyActivityTrend = createSelector(
  [selectClientEvents],
  (events) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyCounts: Record<string, number> = {};
    last7Days.forEach((date) => (dailyCounts[date] = 0));

    events.forEach((e) => {
      const eventDate = e.timestamp.split('T')[0];
      if (dailyCounts[eventDate] !== undefined) {
        dailyCounts[eventDate]++;
      }
    });

    return {
      labels: last7Days.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      data: last7Days.map((date) => dailyCounts[date]),
    };
  }
);

/** Property type interest (RENT vs BUY) - for pie charts */
export const selectPropertyTypeInterestChartData = createSelector(
  [selectClientEvents],
  (events) => {
    const rent = events.filter((e) => e.eventType === 'RENT_INTEREST').length;
    const buy = events.filter((e) => e.eventType === 'BUY_INTEREST').length;

    return {
      labels: ['Rent', 'Buy'],
      data: [rent, buy],
    };
  }
);

// ============================================
// 🎯 EXPORT ALL
// ============================================

export {
  selectAnalyticsState,
  selectAllEvents,
  selectClientEvents,
};
