// Advanced analytics service
export const analyticsService = {
  calculateMetrics(jobs) {
    const total = jobs.length;
    if (total === 0) return null;
    
    const applied = jobs.filter(j => j.status === 'Applied').length;
    const interview = jobs.filter(j => j.status === 'Interview').length;
    const offer = jobs.filter(j => j.status === 'Offer').length;
    const rejected = jobs.filter(j => j.status === 'Rejected').length;
    
    // Calculate conversion rates
    const interviewRate = (interview / applied) * 100;
    const offerRate = (offer / interview) * 100;
    const overallSuccessRate = (offer / total) * 100;
    
    // Calculate average response time (if dates available)
    const jobsWithDates = jobs.filter(j => j.date && j.interviewDate);
    const avgResponseTime = jobsWithDates.length > 0
      ? jobsWithDates.reduce((acc, job) => {
          const appliedDate = new Date(job.date);
          const interviewDate = new Date(job.interviewDate);
          const days = Math.ceil((interviewDate - appliedDate) / (1000 * 60 * 60 * 24));
          return acc + days;
        }, 0) / jobsWithDates.length
      : 0;
    
    // Calculate monthly trends
    const monthlyData = {};
    jobs.forEach(job => {
      if (job.date) {
        const month = job.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { applied: 0, interview: 0, offer: 0, rejected: 0 };
        }
        monthlyData[month][job.status.toLowerCase()]++;
      }
    });
    
    // Calculate success prediction
    const successPrediction = this.predictSuccess(jobs);
    
    return {
      total,
      applied,
      interview,
      offer,
      rejected,
      interviewRate: interviewRate.toFixed(1),
      offerRate: offerRate.toFixed(1),
      overallSuccessRate: overallSuccessRate.toFixed(1),
      avgResponseTime: avgResponseTime.toFixed(0),
      monthlyData,
      successPrediction
    };
  },
  
  predictSuccess(jobs) {
    if (jobs.length < 5) return { confidence: 'low', message: 'Add more data for predictions' };
    
    const offerRate = jobs.filter(j => j.status === 'Offer').length / jobs.length;
    const interviewRate = jobs.filter(j => j.status === 'Interview').length / jobs.length;
    
    const predictedSuccess = (offerRate * 0.7 + interviewRate * 0.3) * 100;
    
    if (predictedSuccess > 50) {
      return { confidence: 'high', rate: predictedSuccess.toFixed(1), message: 'You are on track! Keep applying.' };
    } else if (predictedSuccess > 25) {
      return { confidence: 'medium', rate: predictedSuccess.toFixed(1), message: 'Improve your applications for better results.' };
    } else {
      return { confidence: 'low', rate: predictedSuccess.toFixed(1), message: 'Consider reviewing your application strategy.' };
    }
  },
  
  generateInsights(jobs) {
    const insights = [];
    const total = jobs.length;
    
    if (total === 0) return insights;
    
    // Insight 1: Most common status
    const statusCount = {
      Applied: jobs.filter(j => j.status === 'Applied').length,
      Interview: jobs.filter(j => j.status === 'Interview').length,
      Offer: jobs.filter(j => j.status === 'Offer').length,
      Rejected: jobs.filter(j => j.status === 'Rejected').length
    };
    const mostCommonStatus = Object.keys(statusCount).reduce((a, b) => statusCount[a] > statusCount[b] ? a : b);
    insights.push(`📊 Most applications are in "${mostCommonStatus}" stage`);
    
    // Insight 2: Success rate
    const offerRate = (statusCount.Offer / total) * 100;
    if (offerRate > 20) {
      insights.push(`🎉 Amazing! Your offer rate is ${offerRate.toFixed(1)}% - above average!`);
    } else if (offerRate > 10) {
      insights.push(`👍 Good job! Your offer rate is ${offerRate.toFixed(1)}%`);
    } else {
      insights.push(`💪 Keep pushing! Every application is a step closer to your goal.`);
    }
    
    // Insight 3: Application frequency
    const last30Days = jobs.filter(j => {
      if (!j.date) return false;
      const daysSince = (new Date() - new Date(j.date)) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    }).length;
    
    if (last30Days > 10) {
      insights.push(`🚀 You're on fire! ${last30Days} applications in the last 30 days!`);
    } else if (last30Days > 5) {
      insights.push(`📈 Consistent effort! ${last30Days} applications this month.`);
    } else {
      insights.push(`💡 Try to increase your application frequency for better results.`);
    }
    
    // Insight 4: Deadline reminders
    const upcomingDeadlines = jobs.filter(j => {
      if (!j.deadline) return false;
      const daysUntil = (new Date(j.deadline) - new Date()) / (1000 * 60 * 60 * 24);
      return daysUntil <= 7 && daysUntil >= 0;
    }).length;
    
    if (upcomingDeadlines > 0) {
      insights.push(`⏰ You have ${upcomingDeadlines} upcoming deadline(s) this week!`);
    }
    
    return insights;
  }
};
