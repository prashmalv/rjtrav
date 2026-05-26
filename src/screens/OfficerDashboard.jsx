import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// ─── Translations (English + Hindi) ───────────────────────────────────────
const T = {
  English: {
    officerPortal: 'Officer Portal', officerName: 'Anita Sharma · DTO Pushkar', live: 'LIVE',
    operations: '⚙️ Operations', executive: '📊 Executive',
    opsSub: 'Field-officer focus', execSub: 'Strategic view',
    actions: '🎯 Actions', liveOps: '🔴 Live Ops', forecast: '🔮 Forecast',
    grievances: '📢 Grievances', safety: '🛡 Safety', bsp: '🏨 BSP',
    tourists: '👥 Tourists', external: '💬 External', analytics: '📈 Analytics',
    actionsShort: 'Actions', liveShort: 'Live', predict: 'Predict', cases: 'Cases',
    safetyShort: 'Safety', externalShort: 'External',
    opsDashboard: 'Operations dashboard', execOverview: 'Executive overview',
    activeGrievances: 'Active Grievances', sosOpen: 'SOS Open', bspInspections: 'BSP Inspections', avgResolution: 'Avg Resolution',
    revenueMTD: 'Revenue MTD', totalVisitors: 'Total Visitors', satisfaction: 'Satisfaction', foreignShare: 'Foreign Share',
    aiActionCenter: "AI Action Center · Today's Top 5", rankedBy: 'Ranked by impact · urgency · risk',
    rajwadaAI: 'RAJWADA AI', impact: 'Impact', aiPrefix: '🤖',
    critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM',
    touristSentimentLabel: 'Tourist Sentiment · Last 7 days', tapExternalDetail: 'Tap External for detail',
    positive: '😊 Positive', neutral: '😐 Neutral', negative: '😟 Negative',
    updated: 'Updated', secondsAgo: 's ago', touristsToday: 'tourists registered today', activeAlerts: 'active alerts',
    liveTouristDensity: '📊 Live Tourist Density · Heritage Sites', updatesEvery5s: 'Updates every 5s',
    aiDensityNote: '🤖 AI: Hawa Mahal & Ranthambore Zone 3 trending towards capacity — recommend pre-emptive crowd diversion via app.',
    incoming4h: '✈️ Incoming · Next 4 Hours', welcomeDesk: 'Welcome Desk',
    breakingFeed: '🚨 Breaking Feed', liveWeatherAlerts: '🌡 Live Weather Alerts',
    aiForecasting7d: 'AI Forecasting · 7-day outlook',
    footfallForecast: '🔮 Footfall Forecast', revenueForecast: '💰 Revenue Forecast · ₹ Cr',
    actual: 'Actual', aiPredicted: 'AI Predicted', weekTotal: 'Week total',
    aiForecastNote: '🤖 Weekend surge (Sat: 18.6k, Sun: 16.2k) — +96% above weekday average. Pre-position resources Friday.',
    aiAnomalies: '⚠ AI Anomaly Detection', upcomingEvents: '🎪 Upcoming Events · Predicted Impact',
    baseline: 'Baseline', current: 'Current', conf: 'conf', activeNow: '🔴 ACTIVE NOW',
    extReputation: 'External Reputation · Inter-dept Coordination',
    sentimentIndex: 'Tourist Sentiment Index', reviewsCount: 'reviews', vsLastMonth: 'vs last month',
    sentimentByPlatform: '📱 Sentiment by Platform', mentions: 'mentions',
    npsBySite: '⭐ NPS by Heritage Site', pressCoverage: '📰 Press Coverage · This Week',
    interDept: '🤝 Inter-Department Workflows', started: 'Started', ago: 'ago',
    sortedByPriority: '23 Active · Sorted by Priority',
    responseWindow: 'h response window',
    assign: 'Assign', resolve: 'Resolve', dispatch: 'Dispatch Unit', callTourist: 'Call Tourist',
    statusHigh: '⚡ HIGH', statusMedium: '⚠ MEDIUM',
    bspSubtitle: 'Business Service Providers · Rajasthan',
    aiRiskScore: 'AI Risk Score · Complaints', verified: '✓ VERIFIED', flagged: '⚠ FLAGGED', pending: '⏳ PENDING',
    touristRegistrations: 'Tourist Registrations · May 2026',
    registeredToday: 'Registered Today', thisWeek: 'This Week', thisMonth: 'This Month', foreignTourists: 'Foreign Tourists',
    nationalityBreakdown: 'Nationality Breakdown', entryPoints: 'Entry Points',
    lawEnforcement: 'Law Enforcement & Safety · Live',
    activeSos: 'Active SOS Alerts', resolvedToday: 'Resolved Today', blueBeretPosts: 'Blue Beret Posts', helpline1363: 'Helpline 1363',
    sosLast24h: '🆘 SOS Incidents · Last 24h',
    statusActive: '🔴 ACTIVE', statusResponding: '🔵 RESPONDING', statusResolved: '✓ RESOLVED',
    blueBeretDeployment: '👮 Blue Beret Deployment', officers: 'officers', optimal: '✓ Optimal', needsReinforce: '⚠ Needs reinforcement',
    touristsToday2: 'tourists today',
    analyticsSubtitle: 'Tourist Analytics · May 2026',
    totalVisitorsMtd: 'Total Visitors (MTD)', revenueCr: 'Revenue (₹ Cr)', avgStay: 'Avg Stay (days)',
    districtHeatmap: 'District Footfall Heatmap', thisMonthLbl: 'This Month',
    monthlyTrend: 'Monthly Tourist Trend',
    capacityForecast: '📊 Capacity Forecast · Weekend', aiPredictedLbl: 'AI Predicted',
    nearCapacity: '⚠ Near Capacity', highDemand: '↑ High Demand', normal: '✓ Normal',
    nowAbbr: 'Now', wknd: 'Wknd', revenue: 'Revenue',
  },
  Hindi: {
    officerPortal: 'अधिकारी पोर्टल', officerName: 'अनिता शर्मा · DTO पुष्कर', live: 'लाइव',
    operations: '⚙️ संचालन', executive: '📊 कार्यकारी',
    opsSub: 'क्षेत्र अधिकारी दृष्टि', execSub: 'सामरिक दृष्टि',
    actions: '🎯 कार्य', liveOps: '🔴 लाइव', forecast: '🔮 पूर्वानुमान',
    grievances: '📢 शिकायतें', safety: '🛡 सुरक्षा', bsp: '🏨 BSP',
    tourists: '👥 पर्यटक', external: '💬 बाहरी', analytics: '📈 विश्लेषण',
    actionsShort: 'कार्य', liveShort: 'लाइव', predict: 'पूर्वानुमान', cases: 'शिकायतें',
    safetyShort: 'सुरक्षा', externalShort: 'बाहरी',
    opsDashboard: 'संचालन डैशबोर्ड', execOverview: 'कार्यकारी दृष्टि',
    activeGrievances: 'सक्रिय शिकायतें', sosOpen: 'खुले SOS', bspInspections: 'BSP निरीक्षण', avgResolution: 'औसत निपटान',
    revenueMTD: 'राजस्व (माह)', totalVisitors: 'कुल पर्यटक', satisfaction: 'संतुष्टि', foreignShare: 'विदेशी हिस्सा',
    aiActionCenter: 'AI कार्य केंद्र · आज के शीर्ष 5', rankedBy: 'प्रभाव · तत्कालता · जोखिम के अनुसार',
    rajwadaAI: 'रजवाड़ा AI', impact: 'प्रभाव', aiPrefix: '🤖',
    critical: 'गंभीर', high: 'उच्च', medium: 'मध्यम',
    touristSentimentLabel: 'पर्यटक भावना · पिछले 7 दिन', tapExternalDetail: 'विवरण के लिए "बाहरी" टैप करें',
    positive: '😊 सकारात्मक', neutral: '😐 तटस्थ', negative: '😟 नकारात्मक',
    updated: 'अपडेट', secondsAgo: 'से पूर्व', touristsToday: 'आज पंजीकृत पर्यटक', activeAlerts: 'सक्रिय अलर्ट',
    liveTouristDensity: '📊 लाइव पर्यटक घनत्व · विरासत स्थल', updatesEvery5s: 'हर 5 सेकंड अपडेट',
    aiDensityNote: '🤖 AI: हवा महल और रणथंभौर ज़ोन 3 क्षमता की ओर बढ़ रहे हैं — ऐप के माध्यम से भीड़ का प्रवाह बदलने की सलाह।',
    incoming4h: '✈️ आगमन · अगले 4 घंटे', welcomeDesk: 'स्वागत डेस्क',
    breakingFeed: '🚨 ताज़ा फीड', liveWeatherAlerts: '🌡 लाइव मौसम चेतावनी',
    aiForecasting7d: 'AI पूर्वानुमान · 7-दिन दृष्टिकोण',
    footfallForecast: '🔮 पर्यटक संख्या पूर्वानुमान', revenueForecast: '💰 राजस्व पूर्वानुमान · ₹ करोड़',
    actual: 'वास्तविक', aiPredicted: 'AI अनुमानित', weekTotal: 'साप्ताहिक कुल',
    aiForecastNote: '🤖 सप्ताहांत उछाल (शनि: 18.6k, रवि: 16.2k) — +96% सप्ताहांत औसत से अधिक। शुक्रवार से संसाधन तैनात करें।',
    aiAnomalies: '⚠ AI विसंगति पहचान', upcomingEvents: '🎪 आगामी कार्यक्रम · अनुमानित प्रभाव',
    baseline: 'आधार', current: 'वर्तमान', conf: 'विश्वास', activeNow: '🔴 अभी सक्रिय',
    extReputation: 'बाहरी प्रतिष्ठा · अंतर-विभागीय समन्वय',
    sentimentIndex: 'पर्यटक भावना सूचकांक', reviewsCount: 'समीक्षाएं', vsLastMonth: 'पिछले महीने की तुलना में',
    sentimentByPlatform: '📱 प्लेटफॉर्म अनुसार भावना', mentions: 'उल्लेख',
    npsBySite: '⭐ NPS विरासत स्थल अनुसार', pressCoverage: '📰 प्रेस कवरेज · इस सप्ताह',
    interDept: '🤝 अंतर-विभागीय कार्यप्रवाह', started: 'शुरू', ago: 'पहले',
    sortedByPriority: '23 सक्रिय · प्राथमिकता द्वारा क्रमबद्ध',
    responseWindow: 'घंटे प्रतिक्रिया विंडो',
    assign: 'सौंपें', resolve: 'हल करें', dispatch: 'टुकड़ी भेजें', callTourist: 'पर्यटक को कॉल करें',
    statusHigh: '⚡ उच्च', statusMedium: '⚠ मध्यम',
    bspSubtitle: 'व्यापार सेवा प्रदाता · राजस्थान',
    aiRiskScore: 'AI जोखिम स्कोर · शिकायतें', verified: '✓ सत्यापित', flagged: '⚠ चिह्नित', pending: '⏳ लंबित',
    touristRegistrations: 'पर्यटक पंजीकरण · मई 2026',
    registeredToday: 'आज पंजीकृत', thisWeek: 'इस सप्ताह', thisMonth: 'इस माह', foreignTourists: 'विदेशी पर्यटक',
    nationalityBreakdown: 'राष्ट्रीयता विभाजन', entryPoints: 'प्रवेश बिंदु',
    lawEnforcement: 'कानून प्रवर्तन व सुरक्षा · लाइव',
    activeSos: 'सक्रिय SOS', resolvedToday: 'आज हल हुए', blueBeretPosts: 'ब्लू बेरेट चौकियां', helpline1363: 'हेल्पलाइन 1363',
    sosLast24h: '🆘 SOS घटनाएं · पिछले 24 घंटे',
    statusActive: '🔴 सक्रिय', statusResponding: '🔵 प्रतिक्रिया में', statusResolved: '✓ हल',
    blueBeretDeployment: '👮 ब्लू बेरेट तैनाती', officers: 'अधिकारी', optimal: '✓ इष्टतम', needsReinforce: '⚠ अधिक बल चाहिए',
    touristsToday2: 'पर्यटक आज',
    analyticsSubtitle: 'पर्यटक विश्लेषण · मई 2026',
    totalVisitorsMtd: 'कुल पर्यटक (माह)', revenueCr: 'राजस्व (₹ करोड़)', avgStay: 'औसत प्रवास (दिन)',
    districtHeatmap: 'जिला पर्यटक संख्या मानचित्र', thisMonthLbl: 'इस माह',
    monthlyTrend: 'मासिक पर्यटक रुझान',
    capacityForecast: '📊 क्षमता पूर्वानुमान · सप्ताहांत', aiPredictedLbl: 'AI अनुमानित',
    nearCapacity: '⚠ क्षमता के निकट', highDemand: '↑ उच्च मांग', normal: '✓ सामान्य',
    nowAbbr: 'अभी', wknd: 'सप्ताहांत', revenue: 'राजस्व',
  },
}

// ─── Theme Palettes ────────────────────────────────────────────────────────
const palettes = {
  dark: {
    bg: '#0F172A', card: '#1E293B', cardInner: '#0F172A', border: '#334155',
    text: '#E2E8F0', textMute: '#94A3B8', textDim: '#64748B',
    headerBg: 'linear-gradient(135deg,#0D1B2E,#1E3A5F)',
    headerBorder: '#334155',
    tabBg: '#1E293B', tabBorder: '#334155',
    aiBoxBg: 'linear-gradient(135deg,#1E1E3A,#1A2A4F)', aiBoxBorder: '#4338CA',
    aiNoteBg: '#0A1A0F',
    sosActiveBg: '#7F1D1D', sosActiveBorder: '#991B1B',
    sosRespondingBg: '#1C3A5E', sosRespondingBorder: '#2D4A7E',
    insightBg: 'linear-gradient(135deg,#1B2D3A,#0F2818)', insightBorder: '#166534', insightText: '#86EFAC', insightAccent: '#4ADE80',
    tickerBg: 'linear-gradient(135deg,#1B2D1F,#0F2818)', tickerBorder: '#166534', tickerText: '#86EFAC',
    chipNeutralBg: '#334155', chipNeutralText: '#94A3B8',
    btnPrimaryBg: '#1E40AF', btnPrimaryText: '#BFDBFE',
    btnSuccessBg: '#065F46', btnSuccessText: '#A7F3D0',
    bottomNavBg: '#1E293B', bottomNavBorder: '#334155',
    headerTextOnDark: '#fff', headerSubOnDark: '#94A3B8',
    badgeHighBg: '#7F1D1D', badgeHighText: '#FCA5A5',
    badgeMedBg: '#78350F', badgeMedText: '#FDE68A',
    badgeOkBg: '#065F46', badgeOkText: '#A7F3D0',
  },
  light: {
    bg: '#F1F5F9', card: '#FFFFFF', cardInner: '#F8FAFC', border: '#E2E8F0',
    text: '#0F172A', textMute: '#475569', textDim: '#64748B',
    headerBg: 'linear-gradient(135deg,#1E3A8A,#3B82F6)',
    headerBorder: '#1E40AF',
    tabBg: '#FFFFFF', tabBorder: '#E2E8F0',
    aiBoxBg: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)', aiBoxBorder: '#6366F1',
    aiNoteBg: '#ECFDF5',
    sosActiveBg: '#FEE2E2', sosActiveBorder: '#FECACA',
    sosRespondingBg: '#DBEAFE', sosRespondingBorder: '#BFDBFE',
    insightBg: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', insightBorder: '#A7F3D0', insightText: '#065F46', insightAccent: '#059669',
    tickerBg: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', tickerBorder: '#A7F3D0', tickerText: '#065F46',
    chipNeutralBg: '#F1F5F9', chipNeutralText: '#475569',
    btnPrimaryBg: '#3B82F6', btnPrimaryText: '#FFFFFF',
    btnSuccessBg: '#10B981', btnSuccessText: '#FFFFFF',
    bottomNavBg: '#FFFFFF', bottomNavBorder: '#E2E8F0',
    headerTextOnDark: '#fff', headerSubOnDark: '#CBD5E1',
    badgeHighBg: '#FEE2E2', badgeHighText: '#991B1B',
    badgeMedBg: '#FEF3C7', badgeMedText: '#92400E',
    badgeOkBg: '#D1FAE5', badgeOkText: '#065F46',
  },
}

// ─── KPIs (mode-aware, translated via tr) ──────────────────────────────────
const getKPIs = (mode, tr) => mode === 'ops' ? [
  { label: tr.activeGrievances, value: '23', delta: '+3', color: '#EF4444' },
  { label: tr.sosOpen, value: '1', delta: '1 dispatched', color: '#F59E0B' },
  { label: tr.bspInspections, value: '12', delta: '3 pending', color: '#3B82F6' },
  { label: tr.avgResolution, value: '5.2d', delta: '-0.8d', color: '#10B981' },
] : [
  { label: tr.revenueMTD, value: '₹85.6 Cr', delta: '↑ 18%', color: '#10B981' },
  { label: tr.totalVisitors, value: '57.8K', delta: '↑ 14%', color: '#C2185B' },
  { label: tr.satisfaction, value: '4.6/5', delta: '↑ 0.2', color: '#3B82F6' },
  { label: tr.foreignShare, value: '27%', delta: '↑ 6% YoY', color: '#F59E0B' },
]

// ─── AI Action Center: Top 5 Priorities (with toast messages) ──────────────
const TOP_ACTIONS = [
  {
    id: 'A1', priority: 'CRITICAL', icon: '🚨',
    title: 'SOS · Sam Sand Dunes · 14 min',
    detail: 'Marco Weber (🇩🇪 German). Last GPS 27km from base. No phone response × 4 tries.',
    impact: 'Tourist safety · International incident risk',
    eta: 'NOW',
    primary: 'Dispatch BSF Post-7',
    primaryToast: '✓ BSF Post-7 dispatched · 6 personnel mobilised · ETA 11 min',
    secondary: 'Try sat phone',
    secondaryToast: '📡 Satellite phone attempt initiated · awaiting response',
    aiNote: 'BSF post 7km away has 6 officers — fastest response option.',
  },
  {
    id: 'A2', priority: 'HIGH', icon: '⚠',
    title: 'Pushkar overcharging surge · +300%',
    detail: '5 complaints in 7 days vs 1.2 monthly avg. All against camel safari operators.',
    impact: '₹8L estimated tourist revenue at risk',
    eta: 'Today',
    primary: 'Surprise inspection',
    primaryToast: '✓ Inspection team assigned · 3 BSPs flagged for visit today',
    secondary: 'Open investigation',
    secondaryToast: '🔍 Case opened · INV-2026-0421 · DTO Pushkar assigned',
    aiNote: 'BSP-4521 named in 3 of 5 complaints. Pattern indicates organised overcharging.',
  },
  {
    id: 'A3', priority: 'HIGH', icon: '🏨',
    title: 'BSP-4521 Desert Rose · threshold breached',
    detail: '3 complaints in 30 days (limit: 2). License review required under Rule 14(c).',
    impact: 'Compliance · 240 monthly tourists affected',
    eta: 'Today',
    primary: 'Issue show-cause notice',
    primaryToast: '✓ Notice GST/2026/SCN-4521 issued · 7-day response window',
    secondary: 'Schedule hearing',
    secondaryToast: '📅 Hearing scheduled · 24 May 2026 · DTO Office Pushkar',
    aiNote: 'Pattern: peak-season overcharging. Last inspection: 14 months ago.',
  },
  {
    id: 'A4', priority: 'MEDIUM', icon: '🌡',
    title: 'Heat advisory · Bikaner 47°C, Jaisalmer 46°C',
    detail: '4 districts crossed extreme-heat threshold (≥42°C). 12,400 tourists in zone.',
    impact: 'Tourist health · negative reviews risk',
    eta: 'Within 1h',
    primary: 'Broadcast app advisory',
    primaryToast: '📡 Heat advisory pushed to 12,400 tourists in affected zone',
    secondary: 'SMS to hotels',
    secondaryToast: '📱 SMS sent to 234 registered hotels in 4 districts',
    aiNote: 'App will push notification to all signed-in tourists in affected zone.',
  },
  {
    id: 'A5', priority: 'MEDIUM', icon: '📈',
    title: 'Jaisalmer Fort capacity 95% this weekend',
    detail: 'AI forecast: footfall will exceed safe limit Sat 2–5 PM. 18,400 expected.',
    impact: 'Crowd safety · stampede risk',
    eta: 'By Friday',
    primary: 'Pre-position medical+police',
    primaryToast: '✓ 6 medical + 12 police personnel scheduled for Sat 1 PM',
    secondary: 'Timed-entry advisory',
    secondaryToast: '📢 Timed-entry slots announced for Sat 2–5 PM',
    aiNote: 'Same pattern caused minor incident on 23 Mar 2026. Plan ahead.',
  },
]

// ─── Live Ops Data ────────────────────────────────────────────────────────
const LIVE_SITES = [
  { name: 'Amber Fort, Jaipur',      current: 2400, capacity: 3500, color: '#F59E0B' },
  { name: 'Hawa Mahal, Jaipur',      current: 1820, capacity: 2200, color: '#EF4444' },
  { name: 'City Palace, Udaipur',    current: 1450, capacity: 2800, color: '#10B981' },
  { name: 'Mehrangarh, Jodhpur',     current: 1850, capacity: 2500, color: '#F59E0B' },
  { name: 'Jaisalmer Fort',          current: 1200, capacity: 1500, color: '#EF4444' },
  { name: 'Sam Sand Dunes',          current: 620,  capacity: 1800, color: '#10B981' },
  { name: 'Brahma Temple, Pushkar',  current: 980,  capacity: 1400, color: '#F59E0B' },
  { name: 'Ranthambore Zone 3',      current: 145,  capacity: 160,  color: '#EF4444' },
]

const INCOMING_ARRIVALS = [
  { flight: 'AI 663', origin: 'Delhi',   eta: '12:40', pax: 178, type: '✈️' },
  { flight: '6E 2041', origin: 'Mumbai', eta: '13:15', pax: 184, type: '✈️' },
  { flight: 'LH 760',  origin: 'Frankfurt (via DEL)', eta: '14:05', pax: 142, type: '✈️' },
  { flight: 'Train 12015', origin: 'New Delhi (Shatabdi)', eta: '13:35', pax: 410, type: '🚂' },
  { flight: 'AI 985', origin: 'London (via DEL)', eta: '15:20', pax: 234, type: '✈️' },
]

const WEATHER_ALERTS = [
  { city: 'Bikaner',   temp: 47, level: 'extreme',  msg: 'Outdoor sightseeing dangerous 11AM–4PM' },
  { city: 'Jaisalmer', temp: 46, level: 'extreme',  msg: 'Desert safari only at sunset' },
  { city: 'Jodhpur',   temp: 43, level: 'high',     msg: 'Encourage hydration messaging' },
  { city: 'Jaipur',    temp: 41, level: 'moderate', msg: 'Normal precautions' },
]

// ─── Forecast Data ────────────────────────────────────────────────────────
const FORECAST_FOOTFALL = [
  { day: 'Mon', actual: 8200,  predicted: 8400  },
  { day: 'Tue', actual: 7800,  predicted: 7900  },
  { day: 'Wed', actual: 9100,  predicted: 9200  },
  { day: 'Thu', actual: null,  predicted: 9800  },
  { day: 'Fri', actual: null,  predicted: 12400 },
  { day: 'Sat', actual: null,  predicted: 18600 },
  { day: 'Sun', actual: null,  predicted: 16200 },
]
const FORECAST_REVENUE = [
  { day: 'Mon', value: 2.4 }, { day: 'Tue', value: 2.2 }, { day: 'Wed', value: 2.8 },
  { day: 'Thu', value: 3.1 }, { day: 'Fri', value: 4.2 }, { day: 'Sat', value: 6.8 }, { day: 'Sun', value: 5.6 },
]

const ANOMALIES = [
  { metric: 'Pushkar complaints', deviation: '+300%', baseline: '1.2/wk', current: '5/wk', confidence: 96, severity: 'high' },
  { metric: 'Jaisalmer hotel cancellations', deviation: '+47%', baseline: '8/day', current: '12/day', confidence: 88, severity: 'medium' },
  { metric: 'Ranthambore safari refunds', deviation: '+125%', baseline: '4/wk', current: '9/wk', confidence: 92, severity: 'medium' },
  { metric: 'German tourist registrations', deviation: '+28%', baseline: 'YoY', current: '+28% YoY', confidence: 99, severity: 'positive' },
]

const FESTIVAL_IMPACTS = [
  { name: 'Summer Heat Peak', date: '25 May–10 Jun', city: 'Statewide', impact: '−38% footfall', revenue: '−₹12 Cr', status: 'now' },
  { name: 'Teej Festival', date: '15–17 Aug 2026', city: 'Jaipur', impact: '+22% domestic', revenue: '+₹3.8 Cr', status: 'upcoming' },
  { name: 'Marwar Festival', date: '3–4 Oct 2026', city: 'Jodhpur', impact: '+35% footfall', revenue: '+₹4.5 Cr', status: 'upcoming' },
  { name: 'Pushkar Camel Fair', date: '1–11 Nov 2026', city: 'Pushkar', impact: '+280% footfall', revenue: '+₹18.2 Cr', status: 'upcoming' },
]

const SENTIMENT_PLATFORMS = [
  { name: 'Google Reviews', score: 4.6, count: 28420, trend: '↑ 0.2', color: '#4285F4' },
  { name: 'TripAdvisor', score: 4.4, count: 18620, trend: '↑ 0.1', color: '#00AA6C' },
  { name: 'X (Twitter) buzz', score: 78, count: 4280, trend: '↑ 5%', color: '#1E293B', unit: '% positive' },
  { name: 'Instagram tags', score: 92, count: 156000, trend: '↑ 12%', color: '#E1306C', unit: '% positive' },
  { name: 'YouTube comments', score: 81, count: 2840, trend: '↓ 2%', color: '#FF0000', unit: '% positive' },
]

const NPS_SITES = [
  { site: 'Amber Fort', nps: 72, trend: '↑' }, { site: 'Lake Pichola', nps: 84, trend: '↑' },
  { site: 'Mehrangarh', nps: 78, trend: '→' }, { site: 'Jaisalmer Fort', nps: 68, trend: '↓' },
  { site: 'Sam Sand Dunes', nps: 71, trend: '↑' }, { site: 'Pushkar Lake', nps: 65, trend: '↓' },
  { site: 'Hawa Mahal', nps: 58, trend: '↓' },
]

const PRESS_COVERAGE = [
  { source: 'The Hindu', headline: 'Rajasthan tourism crosses 5 Cr arrivals', sentiment: 'positive', date: '18 May 2026' },
  { source: 'Times of India', headline: 'AI tourism app receives global acclaim', sentiment: 'positive', date: '17 May 2026' },
  { source: 'Lonely Planet', headline: 'Jaisalmer Fort named "Top 10 living forts"', sentiment: 'positive', date: '15 May 2026' },
  { source: 'Hindustan Times', headline: 'Concerns over overcharging in Pushkar', sentiment: 'negative', date: '14 May 2026' },
  { source: 'BBC Travel', headline: 'Why Rajasthan should be on every bucket list', sentiment: 'positive', date: '12 May 2026' },
]

const COORD_INCIDENTS = [
  {
    id: 'INC-2026-0421', type: 'Medical · Heat stroke', location: 'Jaisalmer Fort', tourist: 'Sarah Mitchell (🇺🇸)',
    started: '11:42 AM', age: '2h 14m',
    timeline: [
      { dept: 'Tourist Helpline 1363', action: 'Call received', time: '11:42 AM', done: true },
      { dept: 'Tourist Police', action: 'Officer dispatched', time: '11:48 AM', done: true },
      { dept: '108 Ambulance', action: 'Ambulance routed', time: '11:54 AM', done: true },
      { dept: 'District Hospital', action: 'Admitted, stable', time: '12:38 PM', done: true },
      { dept: 'Tourism Dept', action: 'Insurance liaison', time: '01:15 PM', done: false },
    ],
  },
  {
    id: 'INC-2026-0420', type: 'Fraud · Cab overcharging', location: 'Jaipur Railway Station', tourist: 'Tomoko Sato (🇯🇵)',
    started: '09:15 AM', age: '4h 41m',
    timeline: [
      { dept: 'Grievance App', action: 'Filed online', time: '09:15 AM', done: true },
      { dept: 'Tourist Police', action: 'Cabbie traced', time: '10:02 AM', done: true },
      { dept: 'RTO', action: 'License hold', time: '11:30 AM', done: true },
      { dept: 'Refund team', action: 'Refund initiated', time: '—', done: false },
    ],
  },
]

// ─── Existing data ────────────────────────────────────────────────────────
const GRIEVANCES = [
  { id: 'GRV-2026-04812', title: 'Overcharging at Camel Safari', location: 'Pushkar', priority: 'high', hours: 18, tourist: 'Vikram Singh', category: 'Overcharging' },
  { id: 'GRV-2026-04801', title: 'Unsafe road near Amber Fort', location: 'Jaipur', priority: 'high', hours: 6, tourist: 'Priya Sharma', category: 'Infrastructure' },
  { id: 'GRV-2026-04798', title: 'Guide gave wrong historical info', location: 'Udaipur', priority: 'medium', hours: 36, tourist: 'John Adams', category: 'BSP / Operator' },
]

const BSP = [
  { id: 'BSP-4521', name: 'Desert Rose Camel Safari', location: 'Pushkar', status: 'flagged', score: 62, complaints: 3 },
  { id: 'BSP-3891', name: 'Heritage Haveli Resort', location: 'Jaipur', status: 'verified', score: 94, complaints: 0 },
  { id: 'BSP-2211', name: 'Royal Guide Services', location: 'Udaipur', status: 'pending', score: 78, complaints: 1 },
]

const FOOTFALL = [
  { district: 'Jaipur', visitors: 18420, revenue: 24.2, change: '+12%', color: '#C2185B' },
  { district: 'Udaipur', visitors: 11300, revenue: 18.7, change: '+8%', color: '#3B82F6' },
  { district: 'Jodhpur', visitors: 9850, revenue: 14.1, change: '+15%', color: '#8B5CF6' },
  { district: 'Jaisalmer', visitors: 7620, revenue: 12.4, change: '+22%', color: '#F59E0B' },
  { district: 'Pushkar', visitors: 6410, revenue: 8.9, change: '+5%', color: '#10B981' },
  { district: 'Ranthambore', visitors: 4280, revenue: 7.3, change: '+18%', color: '#EF4444' },
]

const MONTHLY = [
  { month: 'Aug', val: 38 }, { month: 'Sep', val: 52 }, { month: 'Oct', val: 71 }, { month: 'Nov', val: 94 },
  { month: 'Dec', val: 100 }, { month: 'Jan', val: 88 }, { month: 'Feb', val: 76 }, { month: 'Mar', val: 65 },
]

const TOURIST_REGS = [
  { nationality: 'India (Domestic)', count: 42180, pct: 73, color: '#C2185B' },
  { nationality: 'United Kingdom', count: 3420, pct: 6, color: '#3B82F6' },
  { nationality: 'Germany', count: 2890, pct: 5, color: '#F59E0B' },
  { nationality: 'USA / Canada', count: 2450, pct: 4, color: '#8B5CF6' },
  { nationality: 'France', count: 1980, pct: 3, color: '#10B981' },
  { nationality: 'Japan / Korea', count: 1620, pct: 3, color: '#EF4444' },
  { nationality: 'Others', count: 3340, pct: 6, color: '#64748B' },
]

const ENTRY_POINTS = [
  { type: 'Jaipur Airport', count: 18420, ico: '✈️', color: '#3B82F6' },
  { type: 'Jaipur Railway', count: 14200, ico: '🚂', color: '#C2185B' },
  { type: 'Road (NH-48)', count: 12300, ico: '🚗', color: '#F59E0B' },
  { type: 'Udaipur Airport', count: 8960, ico: '✈️', color: '#8B5CF6' },
  { type: 'Jodhpur Airport', count: 4000, ico: '✈️', color: '#10B981' },
]

const SOS_ALERTS_INIT = [
  { id: 'SOS-2026-001', tourist: 'Marco Weber', nationality: 'Germany', location: 'Sam Sand Dunes, Jaisalmer', time: '14 min ago', status: 'active', severity: 'high' },
  { id: 'SOS-2026-002', tourist: 'Priya Sharma', nationality: 'India', location: 'Ranthambore Zone 3', time: '52 min ago', status: 'responding', severity: 'medium' },
  { id: 'SOS-2026-003', tourist: 'Yuki Tanaka', nationality: 'Japan', location: 'Mehrangarh Fort, Jodhpur', time: '2h 14m ago', status: 'resolved', severity: 'low' },
]

const POLICE_POSTS = [
  { location: 'Amber Fort', district: 'Jaipur', officers: 8, status: 'optimal', tourists: 2400 },
  { location: 'Mehrangarh Fort', district: 'Jodhpur', officers: 6, status: 'optimal', tourists: 1850 },
  { location: 'Jaisalmer Fort', district: 'Jaisalmer', officers: 5, status: 'optimal', tourists: 1200 },
  { location: 'Sam Sand Dunes', district: 'Jaisalmer', officers: 4, status: 'low', tourists: 620 },
]

const CAPACITY_ALERTS = [
  { site: 'Ranthambore NP', current: 90, weekend: 100, trend: 'At capacity', trendColor: '#EF4444' },
  { site: 'Jaisalmer Fort', current: 78, weekend: 95, trend: 'Rising fast', trendColor: '#F59E0B' },
  { site: 'Sam Sand Dunes', current: 55, weekend: 88, trend: 'Rising', trendColor: '#F59E0B' },
  { site: 'Amber Fort', current: 65, weekend: 82, trend: 'Stable', trendColor: '#10B981' },
]

const maxEntryCount = Math.max(...ENTRY_POINTS.map(e => e.count))
const maxMonthly = Math.max(...MONTHLY.map(m => m.val))
const maxFootfall = Math.max(...FOOTFALL.map(f => f.visitors))
const maxForecast = Math.max(...FORECAST_FOOTFALL.map(f => f.predicted))
const maxRevenue = Math.max(...FORECAST_REVENUE.map(f => f.value))

const priorityColor = (p) => p === 'CRITICAL' ? '#EF4444' : p === 'HIGH' ? '#F59E0B' : '#3B82F6'
const localisePriority = (p, tr) => p === 'CRITICAL' ? tr.critical : p === 'HIGH' ? tr.high : tr.medium

// ──────────────────────────────────────────────────────────────────────────
export default function OfficerDashboard() {
  const navigate = useNavigate()
  const { showToast, appLanguage, setAppLanguage } = useApp()
  const [theme, setTheme] = useState('light')
  const [mode, setMode] = useState('ops')
  const [activeTab, setActiveTab] = useState('actions')
  const [sos, setSos] = useState(SOS_ALERTS_INIT)
  const [live, setLive] = useState({
    totalToday: 1842, lastTick: Date.now(),
    feed: [
      { id: 1, time: 'just now',  type: 'arrival',   text: 'Flight 6E 2041 landed at Jaipur · 184 pax expected to clear immigration' },
      { id: 2, time: '4 min ago', type: 'incident',  text: 'GRV-04823 filed · Overcharging at Jaipur Walled City' },
      { id: 3, time: '7 min ago', type: 'capacity',  text: 'Hawa Mahal hit 82% capacity · monitoring' },
      { id: 4, time: '12 min ago', type: 'positive', text: 'Tourist Marco gave 5★ review for Amber Fort experience' },
    ],
  })
  const tickRef = useRef(0)
  const c = palettes[theme]
  const tr = T[appLanguage === 'Hindi' ? 'Hindi' : 'English']

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1
      setLive(prev => {
        const newTotal = prev.totalToday + Math.floor(Math.random() * 5) + 1
        const events = [
          { type: 'arrival',  text: `${['Couple', 'Solo backpacker', 'Family of 4', 'German tourist group'][tickRef.current % 4]} just registered at Jaipur Airport` },
          { type: 'positive', text: `5★ review just posted for ${['Mehrangarh', 'Amber Fort', 'Lake Pichola'][tickRef.current % 3]}` },
          { type: 'capacity', text: `${['Ranthambore', 'Jaisalmer Fort', 'Hawa Mahal'][tickRef.current % 3]} crossed capacity threshold` },
          { type: 'incident', text: `New grievance filed at ${['Pushkar', 'Jaisalmer', 'Jaipur'][tickRef.current % 3]}` },
        ]
        const newEvent = { id: Date.now(), time: 'just now', ...events[tickRef.current % events.length] }
        const updatedFeed = [newEvent, ...prev.feed.slice(0, 5).map(f => ({ ...f, time: ageTime(f.time) }))]
        return { totalToday: newTotal, lastTick: Date.now(), feed: updatedFeed }
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const kpis = getKPIs(mode, tr)
  const tabs = [
    ['actions',  tr.actions],
    ['liveops',  tr.liveOps],
    ['forecast', tr.forecast],
    ['grievances', tr.grievances],
    ['safety',   tr.safety],
    ['bsp',      tr.bsp],
    ['tourists', tr.tourists],
    ['external', tr.external],
    ['analytics', tr.analytics],
  ]

  const toggleLang = () => setAppLanguage(appLanguage === 'Hindi' ? 'English' : 'Hindi')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <div className="app-shell" style={{ background: c.bg, color: c.text }}>
      {/* Header */}
      <div style={{ background: c.headerBg, padding: '12px 14px 12px', flexShrink: 0, borderBottom: `1px solid ${c.headerBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🛡️</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: c.headerTextOnDark }}>{tr.officerPortal}</div>
              <div style={{ fontSize: 9, color: c.headerSubOnDark }}>{tr.officerName}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={toggleLang} title="Toggle language" style={{ fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 7px', cursor: 'pointer' }}>
              {appLanguage === 'Hindi' ? 'अ' : 'A'}
            </button>
            <button onClick={toggleTheme} title="Toggle theme" style={{ fontSize: 12, background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 7px', cursor: 'pointer' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <span style={{ fontSize: 8.5, background: '#10B981', color: '#fff', padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>● {tr.live}</span>
            <button style={{ fontSize: 14, color: '#fff', background: 'none' }} onClick={() => navigate('/visitor')}>🚪</button>
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 3, marginTop: 10, border: '1px solid rgba(255,255,255,0.15)' }}>
          {[
            ['ops',  tr.operations, tr.opsSub],
            ['exec', tr.executive,   tr.execSub],
          ].map(([m, lbl, sub]) => (
            <button key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '7px 8px', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: mode === m ? 'linear-gradient(135deg,#F59E0B,#D97706)' : 'transparent',
                color: mode === m ? '#fff' : 'rgba(255,255,255,0.7)',
                fontWeight: 700, fontSize: 11, transition: 'all 0.2s',
              }}
            >
              <div>{lbl}</div>
              <div style={{ fontSize: 8.5, fontWeight: 500, opacity: 0.85, marginTop: 1 }}>{sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: c.tabBg, borderBottom: `1px solid ${c.tabBorder}`, flexShrink: 0, overflowX: 'auto' }} className="hide-scrollbar">
        {tabs.map(([val, lbl]) => (
          <button key={val} onClick={() => setActiveTab(val)} style={{ flexShrink: 0, padding: '10px 10px', fontSize: 10.5, fontWeight: 700, color: activeTab === val ? '#F59E0B' : c.textDim, background: 'none', borderBottom: activeTab === val ? '2px solid #F59E0B' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            {lbl}
          </button>
        ))}
      </div>

      <div className="screen-scroll" style={{ background: c.bg }}>
        <div className="content" style={{ background: c.bg, color: c.text }}>

          {/* ── ACTIONS TAB ───────────────────────────────────────────── */}
          {activeTab === 'actions' && (
            <>
              <div style={{ fontSize: 10.5, color: c.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {mode === 'ops' ? tr.opsDashboard : tr.execOverview} · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>

              <div className="grid-2">
                {kpis.map(m => (
                  <div key={m.label} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9, color: c.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: c.textMute, fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              {/* AI Action Center */}
              <div style={{ background: c.aiBoxBg, border: `1px solid ${c.aiBoxBorder}`, borderRadius: 14, padding: 14, boxShadow: theme === 'light' ? '0 2px 10px rgba(99,102,241,0.15)' : '0 4px 14px rgba(67,56,202,0.18)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🎯</span>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: theme === 'light' ? '#3730A3' : '#C7D2FE' }}>{tr.aiActionCenter}</div>
                      <div style={{ fontSize: 9, color: theme === 'light' ? '#6366F1' : '#818CF8' }}>{tr.rankedBy}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 8.5, background: '#4338CA', color: '#fff', padding: '2px 7px', borderRadius: 5, fontWeight: 700 }}>{tr.rajwadaAI}</span>
                </div>

                {TOP_ACTIONS.map((a, i) => {
                  const pc = priorityColor(a.priority)
                  return (
                    <div key={a.id} style={{ background: c.card, border: `1px solid ${pc}33`, borderLeft: `3px solid ${pc}`, borderRadius: 10, padding: 11, marginTop: i === 0 ? 0 : 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                        <span style={{ fontSize: 16 }}>{a.icon}</span>
                        <span style={{ fontSize: 8.5, background: pc + '22', color: pc, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>{localisePriority(a.priority, tr)}</span>
                        <span style={{ fontSize: 8.5, background: c.chipNeutralBg, color: c.chipNeutralText, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{a.eta}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: c.text, marginBottom: 4 }}>{a.title}</div>
                      <div style={{ fontSize: 10.5, color: c.textMute, marginBottom: 5, lineHeight: 1.45 }}>{a.detail}</div>
                      <div style={{ fontSize: 9.5, color: theme === 'light' ? '#991B1B' : '#FCA5A5', marginBottom: 7 }}>💥 {tr.impact}: {a.impact}</div>
                      <div style={{ fontSize: 9.5, color: c.insightText, marginBottom: 8, fontStyle: 'italic', background: c.aiNoteBg, padding: '5px 7px', borderRadius: 5 }}>🤖 {a.aiNote}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => showToast(a.primaryToast)} style={{ flex: 1, background: pc, color: '#fff', padding: '7px 8px', borderRadius: 6, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{a.primary}</button>
                        <button onClick={() => showToast(a.secondaryToast)} style={{ background: c.chipNeutralBg, color: c.chipNeutralText, padding: '7px 10px', borderRadius: 6, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{a.secondary}</button>
                        <button title="Snooze" onClick={() => showToast('⏰ Action snoozed for 1 hour')} style={{ background: c.chipNeutralBg, color: c.chipNeutralText, padding: '7px 9px', borderRadius: 6, fontSize: 11, border: 'none', cursor: 'pointer' }}>⏰</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Sentiment quick view */}
              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{tr.touristSentimentLabel}</span>
                  <span style={{ fontSize: 9.5, color: c.textDim }}>{tr.tapExternalDetail}</span>
                </div>
                {[[tr.positive, 62, '#10B981'], [tr.neutral, 23, '#F59E0B'], [tr.negative, 15, '#EF4444']].map(([label, pct, color]) => (
                  <div key={label} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                      <span>{label}</span><span style={{ color, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: c.cardInner, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: color, width: `${pct}%`, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── LIVE OPS TAB ─────────────────────────────────────────── */}
          {activeTab === 'liveops' && (
            <>
              <div style={{ background: c.tickerBg, border: `1px solid ${c.tickerBorder}`, borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.4s ease-in-out infinite', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: c.tickerText }}>{tr.live} · {tr.updated} {Math.floor((Date.now() - live.lastTick) / 1000)}{tr.secondsAgo}</div>
                  <div style={{ fontSize: 9.5, color: c.insightAccent, marginTop: 1 }}>{live.totalToday.toLocaleString()} {tr.touristsToday} · {sos.filter(s => s.status === 'active').length} {tr.activeAlerts}</div>
                </div>
                <div style={{ fontSize: 20, color: c.tickerText }}>📡</div>
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{tr.liveTouristDensity}</span>
                  <span style={{ fontSize: 9.5, color: c.textDim }}>{tr.updatesEvery5s}</span>
                </div>
                {LIVE_SITES.map(s => {
                  const pct = Math.round((s.current / s.capacity) * 100)
                  return (
                    <div key={s.name} style={{ marginBottom: 9 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 3 }}>
                        <span style={{ color: c.text, fontWeight: 600 }}>{s.name}</span>
                        <span style={{ color: s.color, fontWeight: 700 }}>{s.current.toLocaleString()} / {s.capacity.toLocaleString()} · {pct}%</span>
                      </div>
                      <div style={{ height: 7, background: c.cardInner, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ height: '100%', background: `linear-gradient(90deg,${s.color}99,${s.color})`, width: `${pct}%`, borderRadius: 4, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  )
                })}
                <div style={{ fontSize: 10, color: c.insightText, marginTop: 10, background: c.aiNoteBg, padding: '7px 9px', borderRadius: 6 }}>
                  {tr.aiDensityNote}
                </div>
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.incoming4h}</div>
                {INCOMING_ARRIVALS.map(f => (
                  <div key={f.flight} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${c.cardInner}` }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{f.type}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: c.text }}>{f.flight} · {f.origin}</div>
                      <div style={{ fontSize: 9.5, color: c.textMute, marginTop: 1 }}>ETA {f.eta} · {f.pax} pax</div>
                    </div>
                    <button onClick={() => showToast(`✓ Welcome desk alerted at ${f.origin.split(' ')[0]} gate · ETA ${f.eta}`)} style={{ background: c.btnPrimaryBg, color: c.btnPrimaryText, padding: '4px 8px', borderRadius: 6, fontSize: 9.5, fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}>{tr.welcomeDesk}</button>
                  </div>
                ))}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.breakingFeed}</div>
                {live.feed.map(item => {
                  const color = item.type === 'incident' ? '#EF4444' : item.type === 'capacity' ? '#F59E0B' : item.type === 'positive' ? '#10B981' : '#3B82F6'
                  const ico = item.type === 'incident' ? '⚠' : item.type === 'capacity' ? '📈' : item.type === 'positive' ? '⭐' : '📍'
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: 9, padding: '7px 0', borderBottom: `1px solid ${c.cardInner}` }}>
                      <span style={{ fontSize: 14, flexShrink: 0, color }}>{ico}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, color: c.text, lineHeight: 1.4 }}>{item.text}</div>
                        <div style={{ fontSize: 9, color: c.textDim, marginTop: 1 }}>{item.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.liveWeatherAlerts}</div>
                {WEATHER_ALERTS.map(w => {
                  const lvlColor = w.level === 'extreme' ? '#EF4444' : w.level === 'high' ? '#F59E0B' : '#10B981'
                  return (
                    <div key={w.city} style={{ marginBottom: 7, padding: '8px 10px', background: c.cardInner, border: `1px solid ${lvlColor}33`, borderLeft: `3px solid ${lvlColor}`, borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: c.text }}>{w.city} · {w.temp}°C</span>
                        <span style={{ fontSize: 8.5, background: lvlColor + '22', color: lvlColor, fontWeight: 800, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>{w.level}</span>
                      </div>
                      <div style={{ fontSize: 10, color: c.textMute, marginTop: 3 }}>{w.msg}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ── FORECAST TAB ─────────────────────────────────────────── */}
          {activeTab === 'forecast' && (
            <>
              <div style={{ fontSize: 10.5, color: c.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tr.aiForecasting7d}</div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.footfallForecast}</div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 110, paddingBottom: 22, position: 'relative' }}>
                  {FORECAST_FOOTFALL.map(d => {
                    const isPast = d.actual !== null
                    const value = d.actual ?? d.predicted
                    return (
                      <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
                        <div style={{ fontSize: 8.5, color: c.textMute, fontWeight: 700, position: 'absolute', top: -16 }}>{(value/1000).toFixed(1)}k</div>
                        <div style={{ width: '100%', background: isPast ? '#3B82F6' : 'linear-gradient(180deg,#C2185B,#831843)', borderRadius: '3px 3px 0 0', height: `${(value / maxForecast) * 75}px`, minHeight: 4, transition: 'height 0.5s ease' }} />
                        <div style={{ fontSize: 9, color: c.textDim, fontWeight: 600 }}>{d.day}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 9.5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: c.textMute }}><span style={{ width: 8, height: 8, background: '#3B82F6', borderRadius: 2 }} />{tr.actual}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: c.textMute }}><span style={{ width: 8, height: 8, background: '#C2185B', borderRadius: 2 }} />{tr.aiPredicted}</span>
                </div>
                <div style={{ fontSize: 10, color: c.insightText, marginTop: 8, background: c.aiNoteBg, padding: '7px 9px', borderRadius: 6 }}>
                  {tr.aiForecastNote}
                </div>
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.revenueForecast}</div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80, paddingBottom: 18 }}>
                  {FORECAST_REVENUE.map(d => (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ fontSize: 8.5, color: '#10B981', fontWeight: 700 }}>₹{d.value}</div>
                      <div style={{ width: '100%', background: 'linear-gradient(180deg,#10B981,#065F46)', borderRadius: '3px 3px 0 0', height: `${(d.value / maxRevenue) * 55}px`, minHeight: 4 }} />
                      <div style={{ fontSize: 9, color: c.textDim, fontWeight: 600 }}>{d.day}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10.5, color: c.textMute, marginTop: 8 }}>
                  {tr.weekTotal}: <strong style={{ color: '#10B981' }}>₹27.1 Cr</strong> · +18% vs last week
                </div>
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.aiAnomalies}</div>
                {ANOMALIES.map(a => {
                  const color = a.severity === 'high' ? '#EF4444' : a.severity === 'medium' ? '#F59E0B' : '#10B981'
                  return (
                    <div key={a.metric} style={{ marginBottom: 8, padding: '9px 11px', background: c.cardInner, border: `1px solid ${color}33`, borderLeft: `3px solid ${color}`, borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: c.text }}>{a.metric}</div>
                          <div style={{ fontSize: 9.5, color: c.textMute, marginTop: 2 }}>{tr.baseline}: {a.baseline} → {tr.current}: <strong style={{ color }}>{a.current}</strong></div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color }}>{a.deviation}</div>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>{a.confidence}% {tr.conf}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.upcomingEvents}</div>
                {FESTIVAL_IMPACTS.map(f => (
                  <div key={f.name} style={{ marginBottom: 9, padding: '9px 11px', background: c.cardInner, borderRadius: 8, border: `1px solid ${c.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: c.text }}>{f.name}</div>
                        <div style={{ fontSize: 9.5, color: c.textMute, marginTop: 2 }}>📍 {f.city} · 📅 {f.date}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: f.impact.startsWith('−') ? '#EF4444' : '#10B981' }}>{f.impact}</div>
                        <div style={{ fontSize: 9.5, color: c.textMute, fontWeight: 700 }}>{f.revenue}</div>
                      </div>
                    </div>
                    {f.status === 'now' && <div style={{ fontSize: 9, fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>{tr.activeNow}</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── GRIEVANCES TAB ───────────────────────────────────────── */}
          {activeTab === 'grievances' && (
            <>
              <div style={{ fontSize: 11, color: c.textDim, fontWeight: 700 }}>{tr.sortedByPriority}</div>
              {GRIEVANCES.map(g => (
                <div key={g.id} style={{ background: c.card, border: `1px solid ${g.priority === 'high' ? '#EF444433' : c.border}`, borderRadius: 12, padding: 12, borderLeft: `3px solid ${g.priority === 'high' ? '#EF4444' : '#F59E0B'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: c.text }}>{g.title}</div>
                      <div style={{ fontSize: 10.5, color: c.textMute, marginTop: 2 }}>📍 {g.location} · {g.tourist} · {g.id}</div>
                    </div>
                    <span style={{ background: g.priority === 'high' ? c.badgeHighBg : c.badgeMedBg, color: g.priority === 'high' ? c.badgeHighText : c.badgeMedText, fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>
                      {g.priority === 'high' ? tr.statusHigh : tr.statusMedium}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10.5, color: c.textDim }}>{g.category} · {g.hours}{tr.responseWindow}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => showToast(`✓ ${g.id} assigned to Inspector R. Meena · DTO Pushkar`)} style={{ background: c.btnPrimaryBg, color: c.btnPrimaryText, padding: '5px 9px', borderRadius: 7, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{tr.assign}</button>
                      <button onClick={() => showToast(`✓ ${g.id} marked resolved · ${g.tourist} notified via SMS`)} style={{ background: c.btnSuccessBg, color: c.btnSuccessText, padding: '5px 9px', borderRadius: 7, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{tr.resolve}</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── BSP TAB ──────────────────────────────────────────────── */}
          {activeTab === 'bsp' && (
            <>
              <div style={{ fontSize: 11, color: c.textDim, fontWeight: 700 }}>{tr.bspSubtitle}</div>
              {BSP.map(b => (
                <div key={b.id} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: c.text }}>{b.name}</div>
                      <div style={{ fontSize: 10.5, color: c.textMute, marginTop: 2 }}>📍 {b.location} · {b.id}</div>
                    </div>
                    <span style={{
                      background: b.status === 'verified' ? c.badgeOkBg : b.status === 'flagged' ? c.badgeHighBg : c.badgeMedBg,
                      color: b.status === 'verified' ? c.badgeOkText : b.status === 'flagged' ? c.badgeHighText : c.badgeMedText,
                      fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6,
                    }}>
                      {b.status === 'verified' ? tr.verified : b.status === 'flagged' ? tr.flagged : tr.pending}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 10.5, color: c.textMute, marginBottom: 3 }}>{tr.aiRiskScore}: {b.complaints}</div>
                      <div style={{ height: 5, background: c.cardInner, borderRadius: 3, width: 120, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: b.score > 80 ? '#10B981' : b.score > 60 ? '#F59E0B' : '#EF4444', width: `${b.score}%`, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: b.score > 80 ? '#10B981' : b.score > 60 ? '#F59E0B' : '#EF4444' }}>{b.score}</div>
                      <div style={{ fontSize: 9, color: c.textDim }}>/ 100</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── TOURISTS TAB ─────────────────────────────────────────── */}
          {activeTab === 'tourists' && (
            <>
              <div style={{ fontSize: 11, color: c.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tr.touristRegistrations}</div>
              <div className="grid-2">
                {[
                  { label: tr.registeredToday, value: live.totalToday.toLocaleString(), delta: '↑ 8%', color: '#C2185B' },
                  { label: tr.thisWeek, value: '11,240', delta: '↑ 12%', color: '#3B82F6' },
                  { label: tr.thisMonth, value: '57,880', delta: '↑ 14%', color: '#10B981' },
                  { label: tr.foreignTourists, value: '15,700', delta: '27%', color: '#F59E0B' },
                ].map(m => (
                  <div key={m.label} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9.5, color: c.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: c.textMute, fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 12 }}>{tr.nationalityBreakdown}</div>
                {TOURIST_REGS.map(r => (
                  <div key={r.nationality} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: c.text, fontWeight: 600 }}>{r.nationality}</span>
                      <span style={{ color: r.color, fontWeight: 700 }}>{r.count.toLocaleString()} · {r.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: c.cardInner, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: r.color, width: `${r.pct}%`, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 12 }}>{tr.entryPoints}</div>
                {ENTRY_POINTS.map(e => (
                  <div key={e.type} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: c.text }}>{e.ico} {e.type}</span>
                      <span style={{ color: e.color, fontWeight: 700 }}>{e.count.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 6, background: c.cardInner, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: `linear-gradient(90deg,${e.color},${e.color}88)`, width: `${(e.count / maxEntryCount) * 100}%`, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── SAFETY TAB ───────────────────────────────────────────── */}
          {activeTab === 'safety' && (
            <>
              <div style={{ fontSize: 11, color: c.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tr.lawEnforcement}</div>
              <div className="grid-2">
                {[
                  { label: tr.activeSos, value: String(sos.filter(s => s.status === 'active').length), delta: '1 team responding', color: '#EF4444' },
                  { label: tr.resolvedToday, value: '3', delta: 'Avg 8 min', color: '#10B981' },
                  { label: tr.blueBeretPosts, value: '28', delta: '14 sites covered', color: '#3B82F6' },
                  { label: tr.helpline1363, value: '47', delta: '4.8/5', color: '#F59E0B' },
                ].map(m => (
                  <div key={m.label} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9.5, color: c.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: c.textMute, fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.sosLast24h}</div>
                {sos.map(s => (
                  <div key={s.id} style={{ marginBottom: 10, padding: '10px 12px', borderRadius: 10, background: s.status === 'active' ? c.sosActiveBg : s.status === 'responding' ? c.sosRespondingBg : c.cardInner, border: `1px solid ${s.status === 'active' ? c.sosActiveBorder : s.status === 'responding' ? c.sosRespondingBorder : c.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{s.tourist} <span style={{ fontSize: 10, color: c.textMute, fontWeight: 500 }}>· {s.nationality}</span></div>
                        <div style={{ fontSize: 10.5, color: c.textMute, marginTop: 2 }}>📍 {s.location}</div>
                        <div style={{ fontSize: 10, color: c.textDim, marginTop: 2 }}>{s.id} · {s.time}</div>
                      </div>
                      <span style={{
                        background: s.status === 'active' ? '#EF4444' : s.status === 'responding' ? '#3B82F6' : '#10B981',
                        color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, flexShrink: 0,
                      }}>
                        {s.status === 'active' ? tr.statusActive : s.status === 'responding' ? tr.statusResponding : tr.statusResolved}
                      </span>
                    </div>
                    {s.status === 'active' && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button onClick={() => { setSos(prev => prev.map(x => x.id === s.id ? { ...x, status: 'responding' } : x)); showToast(`✓ Unit dispatched for ${s.tourist} · ETA 11 min`) }} style={{ background: c.btnPrimaryBg, color: c.btnPrimaryText, padding: '5px 10px', borderRadius: 7, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{tr.dispatch}</button>
                        <button onClick={() => showToast(`📞 Calling ${s.tourist} · +49 ***** ***5481`)} style={{ background: c.btnSuccessBg, color: c.btnSuccessText, padding: '5px 10px', borderRadius: 7, fontSize: 10.5, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{tr.callTourist}</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.blueBeretDeployment}</div>
                {POLICE_POSTS.map(p => (
                  <div key={p.location} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '8px 0', borderBottom: `1px solid ${c.cardInner}` }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{p.location}</div>
                      <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>📍 {p.district} · {p.tourists.toLocaleString()} {tr.touristsToday2}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: p.status === 'optimal' ? '#10B981' : '#F59E0B' }}>{p.officers} {tr.officers}</div>
                      <div style={{ fontSize: 9, color: p.status === 'optimal' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{p.status === 'optimal' ? tr.optimal : tr.needsReinforce}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── EXTERNAL TAB ─────────────────────────────────────────── */}
          {activeTab === 'external' && (
            <>
              <div style={{ fontSize: 10.5, color: c.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tr.extReputation}</div>

              <div style={{ background: c.insightBg, border: `1px solid ${c.insightBorder}`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: c.insightText, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{tr.sentimentIndex}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: c.insightAccent, lineHeight: 1 }}>4.6 / 5</div>
                <div style={{ fontSize: 10, color: c.insightText, marginTop: 5 }}>↑ 0.2 {tr.vsLastMonth} · 207k {tr.reviewsCount}</div>
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.sentimentByPlatform}</div>
                {SENTIMENT_PLATFORMS.map(p => {
                  const isScore = p.score <= 5
                  const display = isScore ? `${p.score} / 5` : `${p.score}% positive`
                  return (
                    <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '7px 0', borderBottom: `1px solid ${c.cardInner}` }}>
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: c.text }}>{p.name}</div>
                        <div style={{ fontSize: 9.5, color: c.textDim, marginTop: 1 }}>{p.count.toLocaleString()} {tr.mentions} · {p.trend}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: theme === 'light' && p.color === '#1E293B' ? c.text : p.color }}>{display}</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.npsBySite}</div>
                {NPS_SITES.map(s => {
                  const color = s.nps >= 75 ? '#10B981' : s.nps >= 65 ? '#F59E0B' : '#EF4444'
                  return (
                    <div key={s.site} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 3 }}>
                        <span style={{ color: c.text, fontWeight: 600 }}>{s.site} <span style={{ color: c.textDim, fontSize: 10 }}>{s.trend}</span></span>
                        <span style={{ color, fontWeight: 700 }}>NPS {s.nps}</span>
                      </div>
                      <div style={{ height: 5, background: c.cardInner, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: color, width: `${s.nps}%`, borderRadius: 3 }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.pressCoverage}</div>
                {PRESS_COVERAGE.map(p => {
                  const color = p.sentiment === 'positive' ? '#10B981' : p.sentiment === 'negative' ? '#EF4444' : '#F59E0B'
                  const ico = p.sentiment === 'positive' ? '✓' : p.sentiment === 'negative' ? '⚠' : '•'
                  return (
                    <div key={p.headline} style={{ display: 'flex', gap: 8, padding: '7px 0', borderBottom: `1px solid ${c.cardInner}` }}>
                      <span style={{ fontSize: 14, color, flexShrink: 0 }}>{ico}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 600, color: c.text, lineHeight: 1.35 }}>{p.headline}</div>
                        <div style={{ fontSize: 9, color: c.textDim, marginTop: 2 }}>{p.source} · {p.date}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{tr.interDept}</div>
                {COORD_INCIDENTS.map(inc => (
                  <div key={inc.id} style={{ marginBottom: 12, padding: '10px 12px', background: c.cardInner, border: `1px solid ${c.border}`, borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: c.text }}>{inc.type}</div>
                        <div style={{ fontSize: 9.5, color: c.textMute, marginTop: 2 }}>📍 {inc.location} · {inc.tourist}</div>
                        <div style={{ fontSize: 9, color: c.textDim, marginTop: 1 }}>{inc.id} · {tr.started} {inc.started} · {inc.age} {tr.ago}</div>
                      </div>
                    </div>
                    <div style={{ borderLeft: `2px solid ${c.border}`, paddingLeft: 12, marginLeft: 4 }}>
                      {inc.timeline.map((t, i) => (
                        <div key={i} style={{ position: 'relative', marginBottom: 7 }}>
                          <div style={{ position: 'absolute', left: -17, top: 3, width: 8, height: 8, borderRadius: '50%', background: t.done ? '#10B981' : c.textDim }} />
                          <div style={{ fontSize: 10, color: t.done ? c.text : c.textMute, fontWeight: 700 }}>{t.dept}</div>
                          <div style={{ fontSize: 9.5, color: c.textMute }}>{t.action} · <span style={{ color: t.done ? '#10B981' : '#F59E0B' }}>{t.time}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── ANALYTICS TAB ────────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <>
              <div style={{ fontSize: 11, color: c.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tr.analyticsSubtitle}</div>

              <div className="grid-2">
                {[
                  { label: tr.totalVisitorsMtd, value: '57,880', delta: '↑ 14%', color: '#C2185B' },
                  { label: tr.revenueCr, value: '₹85.6', delta: '↑ 18%', color: '#10B981' },
                  { label: tr.avgStay, value: '4.2', delta: '+0.3', color: '#F59E0B' },
                  { label: tr.satisfaction, value: '4.6/5', delta: '↑ 0.2', color: '#3B82F6' },
                ].map(m => (
                  <div key={m.label} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 12, borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ fontSize: 9.5, color: c.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color, marginTop: 4, lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 9.5, color: c.textMute, fontWeight: 700, marginTop: 2 }}>{m.delta}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{tr.districtHeatmap}</span>
                  <span style={{ fontSize: 10, color: c.textDim }}>{tr.thisMonthLbl}</span>
                </div>
                {FOOTFALL.map(f => (
                  <div key={f.district} style={{ marginBottom: 9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, color: c.text }}>{f.district}</span>
                      <span style={{ color: f.color, fontWeight: 700 }}>{f.visitors.toLocaleString()} · {f.change}</span>
                    </div>
                    <div style={{ height: 8, background: c.cardInner, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: `linear-gradient(90deg,${f.color},${f.color}88)`, width: `${(f.visitors / maxFootfall) * 100}%`, borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 9.5, color: c.textDim, marginTop: 1 }}>{tr.revenue}: ₹{f.revenue} Cr</div>
                  </div>
                ))}
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 12 }}>{tr.monthlyTrend}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
                  {MONTHLY.map(m => (
                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: '100%', background: m.month === 'Dec' ? '#C2185B' : c.border, borderRadius: '3px 3px 0 0', height: `${(m.val / maxMonthly) * 70}px`, minHeight: 4, position: 'relative' }}>
                        {m.month === 'Dec' && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: '#C2185B', fontWeight: 800, whiteSpace: 'nowrap' }}>PEAK</div>}
                      </div>
                      <div style={{ fontSize: 8.5, color: c.textDim, fontWeight: 600 }}>{m.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{tr.capacityForecast}</span>
                  <span style={{ fontSize: 10, color: c.textDim }}>{tr.aiPredictedLbl}</span>
                </div>
                {CAPACITY_ALERTS.map(cap => {
                  const weekendColor = cap.weekend >= 90 ? '#EF4444' : cap.weekend >= 75 ? '#F59E0B' : '#10B981'
                  return (
                    <div key={cap.site} style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 10, background: c.cardInner, border: `1px solid ${weekendColor}33` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{cap.site}</span>
                        <span style={{ background: weekendColor + '22', color: weekendColor, fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                          {cap.weekend >= 90 ? tr.nearCapacity : cap.weekend >= 75 ? tr.highDemand : tr.normal}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 10.5, marginBottom: 6 }}>
                        <span style={{ color: c.textMute }}>{tr.nowAbbr}: <strong style={{ color: c.text }}>{cap.current}%</strong></span>
                        <span style={{ color: c.textMute }}>{tr.wknd}: <strong style={{ color: weekendColor }}>{cap.weekend}%</strong></span>
                        <span style={{ color: cap.trendColor, fontWeight: 700 }}>{cap.trend}</span>
                      </div>
                      <div style={{ height: 5, background: c.card, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: `linear-gradient(90deg,${weekendColor}88,${weekendColor})`, width: `${cap.weekend}%`, borderRadius: 3 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: c.bottomNavBg, borderTop: `1px solid ${c.bottomNavBorder}`, padding: '8px 2px 12px', flexShrink: 0 }}>
        {[['🎯', tr.actionsShort, 'actions'], ['🔴', tr.liveShort, 'liveops'], ['🔮', tr.predict, 'forecast'], ['📢', tr.cases, 'grievances'], ['🛡', tr.safetyShort, 'safety'], ['💬', tr.externalShort, 'external']].map(([ico, lbl, val]) => (
          <button key={val} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 9, color: activeTab === val ? '#F59E0B' : c.textDim, fontWeight: 600, flex: 1, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab(val)}>
            <span style={{ fontSize: 18 }}>{ico}</span>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  )
}

function ageTime(t) {
  if (t === 'just now') return '5s ago'
  const m = t.match(/^(\d+)s ago$/)
  if (m) {
    const s = parseInt(m[1]) + 5
    return s >= 60 ? `1m ago` : `${s}s ago`
  }
  const mn = t.match(/^(\d+)m ago$/)
  if (mn) return `${parseInt(mn[1]) + 1}m ago`
  return t
}
