// Advanced storage service with encryption and versioning
export const storageService = {
  save(key, data, encrypt = false) {
    try {
      const package_ = {
        data: data,
        timestamp: new Date().toISOString(),
        version: '2.0'
      };
      
      let storageData = JSON.stringify(package_);
      
      // Simple obfuscation (in production, use proper encryption)
      if (encrypt) {
        storageData = btoa(storageData);
      }
      
      localStorage.setItem(`jobtracker_${key}`, storageData);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  },
  
  load(key, encrypt = false) {
    try {
      let data = localStorage.getItem(`jobtracker_${key}`);
      if (!data) return null;
      
      if (encrypt) {
        data = atob(data);
      }
      
      const package_ = JSON.parse(data);
      return package_.data;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  },
  
  clear(key) {
    localStorage.removeItem(`jobtracker_${key}`);
  },
  
  clearAll() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('jobtracker_')) {
        localStorage.removeItem(key);
      }
    });
  },
  
  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2; // Approximate size in bytes
      }
    }
    return (total / 1024).toFixed(2) + ' KB';
  }
};
