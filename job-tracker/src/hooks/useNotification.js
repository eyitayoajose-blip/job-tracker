import { useEffect, useState } from 'react';

export const useNotification = () => {
  const [permission, setPermission] = useState('default');
  
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);
  
  const requestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm === 'granted';
    }
    return false;
  };
  
  const sendNotification = (title, options = {}) => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/job-icon.png',
        badge: '/job-badge.png',
        ...options
      });
      
      setTimeout(() => notification.close(), 5000);
      return notification;
    }
    return null;
  };
  
  const scheduleDeadlineReminder = (jobs) => {
    const today = new Date();
    const upcoming = jobs.filter(job => {
      if (!job.deadline) return false;
      const deadline = new Date(job.deadline);
      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return daysUntil === 1 || daysUntil === 0;
    });
    
    upcoming.forEach(job => {
      sendNotification(`⏰ Deadline Reminder: ${job.company}`, {
        body: `Your application deadline for ${job.position} is ${job.deadline}`,
        tag: job.id.toString()
      });
    });
  };
  
  return { permission, requestPermission, sendNotification, scheduleDeadlineReminder };
};
