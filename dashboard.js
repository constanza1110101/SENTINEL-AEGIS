// dashboard.js - Main frontend component for SENTINEL AEGIS

class SentinelDashboard {
  constructor() {
    this.apiUrl = '/api/v1';
    this.refreshRate = 60000; // 1 minute refresh
    this.initDashboard();
  }

  async initDashboard() {
    this.renderHeader();
    await this.loadSummaryData();
    this.setupRefreshTimer();
    this.setupEventListeners();
  }

  async loadSummaryData() {
    try {
      const response = await fetch(`${this.apiUrl}/summary`);
      const data = await response.json();
      this.renderRiskScore(data.risk_score, data.risk_level);
      this.renderModuleSummaries(data.module_results);
      this.renderRecommendations(data.recommendations);
      this.renderThreatMap(data.threat_data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showErrorMessage('Failed to load dashboard data');
    }
  }

  renderRiskScore(score, level) {
    const riskElement = document.getElementById('risk-score');
    if (!riskElement) return;
    
    riskElement.innerHTML = `
      <div class="score-value ${level.toLowerCase()}">${score}</div>
      <div class="score-label">${level} RISK</div>
    `;
  }

  renderModuleSummaries(modules) {
    const moduleContainer = document.getElementById('module-summaries');
    if (!moduleContainer) return;
    
    moduleContainer.innerHTML = '';
    
    Object.entries(modules).forEach(([name, data]) => {
      const moduleCard = document.createElement('div');
      moduleCard.className = 'module-card';
      moduleCard.innerHTML = `
        <h3>${this.formatModuleName(name)}</h3>
        <div class="module-status ${data.status}">
          ${data.status.toUpperCase()}
        </div>
        ${data.risk_score ? `<div class="module-score">Risk: ${data.risk_score}</div>` : ''}
        <button class="view-details" data-module="${name}">View Details</button>
      `;
      moduleContainer.appendChild(moduleCard);
    });
  }

  formatModuleName(name) {
    return name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  renderRecommendations(recommendations) {
    const recContainer = document.getElementById('recommendations');
    if (!recContainer) return;
    
    recContainer.innerHTML = '<h2>Critical Recommendations</h2>';
    
    if (!recommendations || recommendations.length === 0) {
      recContainer.innerHTML += '<p>No critical recommendations at this time.</p>';
      return;
    }
    
    const recList = document.createElement('ul');
    recommendations.slice(0, 5).forEach(rec => {
      const item = document.createElement('li');
      item.className = `priority-${rec.priority}`;
      item.innerHTML = `
        <span class="rec-module">${this.formatModuleName(rec.module)}</span>
        <span class="rec-finding">${rec.finding}</span>
        <span class="rec-action">${rec.action}</span>
      `;
      recList.appendChild(item);
    });
    
    recContainer.appendChild(recList);
    
    if (recommendations.length > 5) {
      const viewMore = document.createElement('button');
      viewMore.className = 'view-more';
      viewMore.textContent = 'View All Recommendations';
      viewMore.addEventListener('click', () => this.showAllRecommendations(recommendations));
      recContainer.appendChild(viewMore);
    }
  }

  renderThreatMap(threatData) {
    // Implementation for threat visualization would go here
    // Using a library like D3.js or Chart.js
    console.log('Rendering threat map with:', threatData);
  }

  setupEventListeners() {
    document.addEventListener('click', event => {
      if (event.target.matches('.view-details')) {
        const module = event.target.getAttribute('data-module');
        this.showModuleDetails(module);
      }
    });
    
    document.getElementById('run-assessment')?.addEventListener('click', () => {
      this.runNewAssessment();
    });
  }

  async showModuleDetails(moduleName) {
    try {
      const response = await fetch(`${this.apiUrl}/modules/${moduleName}`);
      const data = await response.json();
      
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>${this.formatModuleName(moduleName)} Details</h2>
          <div class="module-details">
            ${this.formatModuleDetails(moduleName, data)}
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
    } catch (error) {
      console.error(`Error loading details for ${moduleName}:`, error);
      this.showErrorMessage(`Failed to load ${this.formatModuleName(moduleName)} details`);
    }
  }

  formatModuleDetails(moduleName, data) {
    // Different formatting based on module type
    switch(moduleName) {
      case 'vulnerability_scanner':
        return this.formatVulnerabilityDetails(data);
      case 'policy_analyzer':
        return this.formatPolicyDetails(data);
      // Add other module formatters
      default:
        return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  }

  formatVulnerabilityDetails(data) {
    if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
      return '<p>No vulnerabilities detected.</p>';
    }
    
    return `
      <div class="vuln-summary">
        <p>Total vulnerabilities: ${data.vulnerabilities.length}</p>
        <p>Scan completed: ${new Date(data.scan_time).toLocaleString()}</p>
      </div>
      <table class="vuln-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Severity</th>
            <th>Affected Systems</th>
            <th>Remediation</th>
          </tr>
        </thead>
        <tbody>
          ${data.vulnerabilities.map(v => `
            <tr class="severity-${v.severity}">
              <td>${v.id}</td>
              <td>${v.name}</td>
              <td>${v.severity.toUpperCase()}</td>
              <td>${v.affected_systems.join(', ')}</td>
              <td>${v.remediation}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  formatPolicyDetails(data) {
    if (!data.policy_gaps || data.policy_gaps.length === 0) {
      return '<p>No policy gaps detected.</p>';
    }
    
    return `
      <div class="policy-summary">
        <p>Policy compliance score: ${100 - (data.risk_score)}%</p>
      </div>
      <table class="policy-table">
        <thead>
          <tr>
            <th>Policy</th>
            <th>Status</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${data.policy_gaps.map(p => `
            <tr class="status-${p.status}">
              <td>${p.policy}</td>
              <td>${p.status.toUpperCase()}</td>
              <td>${p.recommendation}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  async runNewAssessment() {
    try {
      const button = document.getElementById('run-assessment');
      button.disabled = true;
      button.textContent = 'Assessment Running...';
      
      const response = await fetch(`${this.apiUrl}/assessments`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Assessment failed to start');
      }
      
      const data = await response.json();
      
      this.showSuccessMessage(`Assessment started. ID: ${data.assessment_id}`);
      this.pollAssessmentStatus(data.assessment_id);
      
    } catch (error) {
      console.error('Error starting assessment:', error);
      this.showErrorMessage('Failed to start assessment');
      
      const button = document.getElementById('run-assessment');
      button.disabled = false;
      button.textContent = 'Run New Assessment';
    }
  }

  async pollAssessmentStatus(assessmentId) {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/assessments/${assessmentId}`);
        const data = await response.json();
        
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(statusInterval);
          
          const button = document.getElementById('run-assessment');
          button.disabled = false;
          button.textContent = 'Run New Assessment';
          
          if (data.status === 'completed') {
            this.showSuccessMessage('Assessment completed successfully');
            this.loadSummaryData(); // Refresh dashboard
          } else {
            this.showErrorMessage(`Assessment failed: ${data.error || 'Unknown error'}`);
          }
        }
      } catch (error) {
        console.error('Error checking assessment status:', error);
      }
    };
    
    const statusInterval = setInterval(checkStatus, 5000); // Check every 5 seconds
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showMessage(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }

  setupRefreshTimer() {
    setInterval(() => this.loadSummaryData(), this.refreshRate);
  }

  renderHeader() {
    const header = document.getElementById('dashboard-header');
    if (!header) return;
    
    header.innerHTML = `
      <div class="logo">SENTINEL AEGIS</div>
      <div class="header-controls">
        <button id="run-assessment" class="primary-button">Run New Assessment</button>
        <div class="user-controls">
          <span class="organization-name">Organization: ${this.getOrganizationName()}</span>
          <button class="settings-button">⚙️</button>
        </div>
      </div>
    `;
  }

  getOrganizationName() {
    // This would come from the user's session or config
    return localStorage.getItem('organization') || 'Default Organization';
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SentinelDashboard();
});
