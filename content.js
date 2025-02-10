// console.log("Gmail Phishing Detector loaded");

// class PhishingDetector {
//     constructor() {
//         console.log("Initializing detector");
//         this.addVisibleIndicator();
//         this.startDetection();
//     }

//     addVisibleIndicator() {
//         // Add a visible indicator that the extension is running
//         const indicator = document.createElement('div');
//         indicator.style.cssText = `
//             position: fixed;
//             top: 10px;
//             right: 10px;
//             background: #333;
//             color: white;
//             padding: 15px;
//             border-radius: 5px;
//             z-index: 9999;
//             font-family: Arial;
//             box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//         `;
//         indicator.innerHTML = `
//             <div>📧 Phishing Detector Active</div>
//             <button id="testButton" style="margin-top: 10px; padding: 5px;">Test Detection</button>
//         `;
//         document.body.appendChild(indicator);

//         // Add test button functionality
//         const testButton = indicator.querySelector('#testButton');
//         testButton.addEventListener('click', () => this.testDetection());
//     }

//     startDetection() {
//         setInterval(() => {
//             const emails = document.querySelectorAll('.adn.ads');
//             emails.forEach(email => this.checkEmail(email));
//         }, 2000);
//     }

//     checkEmail(emailElement) {
//         if (emailElement.getAttribute('data-scanned')) return;
        
//         console.log("Checking email...");
        
//         // Mark as scanned
//         emailElement.setAttribute('data-scanned', 'true');

//         // Add warning banner
//         const warning = document.createElement('div');
//         warning.style.cssText = `
//             padding: 10px;
//             margin: 5px 0;
//             background-color: #ff4444;
//             color: white;
//             text-align: center;
//             font-weight: bold;
//             border-radius: 4px;
//         `;
//         warning.textContent = '🔍 Email Scanned high  risk';
//         emailElement.insertBefore(warning, emailElement.firstChild);
//     }

//     testDetection() {
//         console.log("Running test detection...");
//         const testWarning = document.createElement('div');
//         testWarning.style.cssText = `
//             position: fixed;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             background: #ff4444;
//             color: white;
//             padding: 20px;
//             border-radius: 10px;
//             z-index: 10000;
//             text-align: center;
//             box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//         `;
        
//         // Create elements properly
//         const title = document.createElement('h3');
//         title.textContent = 'Test Detection Running';
        
//         const message = document.createElement('p');
//         message.textContent = 'The extension is working!';
        
//         const closeButton = document.createElement('button');
//         closeButton.textContent = 'Close';
//         closeButton.style.cssText = 'margin-top: 10px; padding: 5px;';
//         closeButton.addEventListener('click', () => testWarning.remove());

//         // Append elements
//         testWarning.appendChild(title);
//         testWarning.appendChild(message);
//         testWarning.appendChild(closeButton);
        
//         document.body.appendChild(testWarning);
//     }

//     analyzeEmail(emailContent) {
//         const suspiciousPatterns = [
//             'urgent',
//             'verify',
//             'suspended',
//             'click here',
//             'account access',
//             'security alert'
//         ];

//         let riskScore = 0;
//         suspiciousPatterns.forEach(pattern => {
//             if (emailContent.toLowerCase().includes(pattern)) {
//                 riskScore += 20;
//                 console.log(`Suspicious pattern found: ${pattern}`);
//             }
//         });

//         return Math.min(riskScore, 100);
//     }
// }

// // Start the detector
// const detector = new PhishingDetector();

// // Add a visible border to show the extension is active
// document.body.style.border = '2px solid #333';
console.log("Gmail Phishing Detector loaded");

class PhishingDetector {
    constructor() {
        console.log("Initializing detector");
        // Define warning colors as a class property
        this.warningColors = {
            safe: '#4CAF50',      // Green
            suspicious: '#FFC107', // Yellow
            fraudulent: '#FF4444'  // Red
        };
        this.addVisibleIndicator();
        this.startDetection();
    }

    getWarningColor(status) {
        // Safely get color with fallback
        return this.warningColors[status] || '#333333';
    }

    addVisibleIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #333;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        indicator.innerHTML = `
            <div>📧 Phishing Detector Active</div>
            <div style="margin-top: 5px; font-size: 12px;">
                <span style="color: ${this.getWarningColor('safe')}">🟢 Safe</span> |
                <span style="color: ${this.getWarningColor('suspicious')}">🟡 Suspicious</span> |
                <span style="color: ${this.getWarningColor('fraudulent')}">🔴 Fraudulent</span>
            </div>
            <button id="testButton" style="margin-top: 10px; padding: 5px;">Test Detection</button>
        `;
        document.body.appendChild(indicator);

        const testButton = indicator.querySelector('#testButton');
        testButton.addEventListener('click', () => this.testDetection());
    }

    startDetection() {
        setInterval(() => {
            const emails = document.querySelectorAll('.adn.ads');
            emails.forEach(email => this.checkEmail(email));
        }, 2000);
    }

    checkEmail(emailElement) {
        if (emailElement.getAttribute('data-scanned')) return;
        
        console.log("Checking email...");
        emailElement.setAttribute('data-scanned', 'true');

        // Extract email content
        const subject = emailElement.querySelector('.hP')?.textContent || '';
        const body = emailElement.querySelector('.a3s')?.textContent || '';
        const sender = emailElement.querySelector('.gD')?.getAttribute('email') || '';

        // Analyze email
        const analysis = this.analyzeEmail(subject, body, sender);
        this.addWarningBanner(emailElement, analysis);
        this.highlightSuspiciousElements(emailElement, analysis);
    }

    analyzeEmail(subject, body, sender) {
        const analysis = {
            riskScore: 0,
            reasons: [],
            status: 'safe'
        };

        // Check subject
        const urgentSubjectPatterns = ['urgent', 'immediate', 'action required', 'account suspended'];
        urgentSubjectPatterns.forEach(pattern => {
            if (subject.toLowerCase().includes(pattern)) {
                analysis.riskScore += 20;
                analysis.reasons.push(`Urgent language in subject: "${pattern}"`);
            }
        });

        // Check sender
        const suspiciousDomains = ['security-alert.com', 'account-verify.com'];
        const senderDomain = sender.split('@')[1] || '';
        if (suspiciousDomains.includes(senderDomain)) {
            analysis.riskScore += 30;
            analysis.reasons.push('Suspicious sender domain');
        }

        // Check body content
        const suspiciousPatterns = [
            'verify your account',
            'click here',
            'security alert',
            'password expired',
            'unusual activity'
        ];
        suspiciousPatterns.forEach(pattern => {
            if (body.toLowerCase().includes(pattern)) {
                analysis.riskScore += 15;
                analysis.reasons.push(`Suspicious phrase: "${pattern}"`);
            }
        });

        // Determine status based on risk score
        if (analysis.riskScore >= 70) {
            analysis.status = 'fraudulent';
        } else if (analysis.riskScore >= 30) {
            analysis.status = 'suspicious';
        } else {
            analysis.status = 'safe';
        }

        return analysis;
    }

    addWarningBanner(emailElement, analysis) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            padding: 15px;
            margin: 5px 0;
            background-color: ${this.getWarningColor(analysis.status)};
            color: white;
            border-radius: 4px;
            font-family: Arial;
            transition: all 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const icon = analysis.status === 'safe' ? '🟢' : 
                    analysis.status === 'suspicious' ? '🟡' : '🔴';

        const mainContent = document.createElement('div');
        mainContent.innerHTML = `
            <div style="font-weight: bold; font-size: 14px;">
                ${icon} ${analysis.status.toUpperCase()} - Risk Score: ${analysis.riskScore}%
            </div>
            ${analysis.reasons.length > 0 ? `
                <div style="font-size: 12px; margin-top: 5px;">
                    Reasons: ${analysis.reasons.join(', ')}
                </div>
            ` : ''}
        `;

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'View Details';
        detailsButton.style.cssText = `
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            background: rgba(255,255,255,0.2);
            color: white;
            cursor: pointer;
        `;
        detailsButton.addEventListener('click', () => this.showDetailsPanel(analysis));

        warning.appendChild(mainContent);
        warning.appendChild(detailsButton);
        emailElement.insertBefore(warning, emailElement.firstChild);
    }

    highlightSuspiciousElements(emailElement, analysis) {
        if (analysis.status === 'safe') return;

        // Highlight suspicious links
        const links = emailElement.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (this.isSuspiciousUrl(href)) {
                link.style.cssText = `
                    background-color: ${this.getWarningColor(analysis.status)}33;
                    border-bottom: 2px solid ${this.getWarningColor(analysis.status)};
                    padding: 2px 4px;
                    border-radius: 2px;
                `;
                link.title = 'Suspicious Link Detected!';
            }
        });

        // Highlight suspicious text
        const bodyElement = emailElement.querySelector('.a3s');
        if (bodyElement) {
            analysis.reasons.forEach(reason => {
                const pattern = reason.match(/"([^"]+)"/)?.[1];
                if (pattern) {
                    this.highlightText(bodyElement, pattern, analysis.status);
                }
            });
        }
    }

    highlightText(element, text, status) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }

        nodes.forEach(node => {
            const content = node.textContent;
            if (content.toLowerCase().includes(text.toLowerCase())) {
                const span = document.createElement('span');
                span.style.cssText = `
                    background-color: ${this.getWarningColor(status)}33;
                    border-bottom: 2px solid ${this.getWarningColor(status)};
                    padding: 0 2px;
                    border-radius: 2px;
                `;
                span.textContent = content;
                node.parentNode.replaceChild(span, node);
            }
        });
    }

    isSuspiciousUrl(url) {
        if (!url) return false;
        const suspiciousPatterns = [
            'security-verify',
            'account-confirm',
            'login-secure',
            'verify-now'
        ];
        return suspiciousPatterns.some(pattern => url.toLowerCase().includes(pattern));
    }

    showDetailsPanel(analysis) {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 500px;
            width: 90%;
        `;

        panel.innerHTML = `
            <h3 style="margin-top: 0; color: ${this.getWarningColor(analysis.status)}">
                Detailed Analysis
            </h3>
            <div style="margin: 15px 0;">
                <div style="font-weight: bold;">Risk Score: ${analysis.riskScore}%</div>
                <div style="margin-top: 10px;">
                    <div style="font-weight: bold;">Detection Reasons:</div>
                    <ul style="margin-top: 5px;">
                        ${analysis.reasons.map(reason => `
                            <li style="margin: 5px 0;">${reason}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <button style="padding: 8px 16px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Close
            </button>
        `;

        const closeButton = panel.querySelector('button');
        closeButton.addEventListener('click', () => panel.remove());

        document.body.appendChild(panel);
    }

    testDetection() {
        console.log("Running test detection...");
        const testCases = [
            {
                status: 'safe',
                riskScore: 0,
                reasons: ['No suspicious patterns detected']
            },
            {
                status: 'suspicious',
                riskScore: 45,
                reasons: ['Contains urgent language', 'Suspicious sender domain']
            },
            {
                status: 'fraudulent',
                riskScore: 85,
                reasons: ['Phishing attempt detected', 'Malicious links found', 'Impersonating known service']
            }
        ];

        testCases.forEach((testCase, index) => {
            setTimeout(() => {
                const testWarning = document.createElement('div');
                testWarning.style.cssText = `
                    position: fixed;
                    top: ${20 + (index * 120)}px;
                    right: 20px;
                    background: ${this.getWarningColor(testCase.status)};
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    z-index: 10000;
                    width: 300px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                `;

                const icon = testCase.status === 'safe' ? '🟢' : 
                           testCase.status === 'suspicious' ? '🟡' : '🔴';

                testWarning.innerHTML = `
                    <div style="font-weight: bold;">${icon} Test Case: ${testCase.status}</div>
                    <div style="margin-top: 5px;">Risk Score: ${testCase.riskScore}%</div>
                    <div style="font-size: 12px; margin-top: 5px;">
                        ${testCase.reasons[0]}
                    </div>
                `;

                document.body.appendChild(testWarning);

                setTimeout(() => {
                    testWarning.style.opacity = '0';
                    setTimeout(() => testWarning.remove(), 300);
                }, 3000);
            }, index * 1000);
        });
    }
}

// Start the detector
const detector = new PhishingDetector();

// Add a subtle indicator that the extension is active
document.body.style.border = '2px solid #33333333';