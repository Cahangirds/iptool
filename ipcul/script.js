// IP validation function
function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    return parts.every(part => {
        const num = parseInt(part, 10);
        return !isNaN(num) && num >= 0 && num <= 255;
    });
}

// Convert CIDR to decimal subnet mask
function cidrToSubnetMask(cidr) {
    const mask = [];
    for (let i = 0; i < 4; i++) {
        const n = Math.min(cidr, 8);
        mask.push(256 - Math.pow(2, 8 - n));
        cidr -= n;
    }
    return mask.join('.');
}

// Convert decimal subnet mask to CIDR
function subnetMaskToCidr(mask) {
    return mask.split('.').reduce((cidr, octet) => {
        return cidr + (parseInt(octet, 10).toString(2).match(/1/g) || []).length;
    }, 0);
}

// Convert IP to binary
function ipToBinary(ip) {
    return ip.split('.').map(octet => 
        parseInt(octet, 10).toString(2).padStart(8, '0')
    ).join('.');
}

// Calculate network address
function calculateNetworkAddress(ip, subnetMask) {
    const ipParts = ip.split('.').map(x => parseInt(x, 10));
    const maskParts = subnetMask.split('.').map(x => parseInt(x, 10));
    
    return ipParts.map((part, index) => part & maskParts[index]).join('.');
}

// Calculate broadcast address
function calculateBroadcastAddress(networkAddr, subnetMask) {
    const networkParts = networkAddr.split('.').map(x => parseInt(x, 10));
    const maskParts = subnetMask.split('.').map(x => parseInt(x, 10));
    
    return networkParts.map((part, index) => {
        const wildcardBits = 255 - maskParts[index];
        return part | wildcardBits;
    }).join('.');
}

// Calculate first and last host addresses
function calculateHostRange(networkAddr, broadcastAddr) {
    const networkParts = networkAddr.split('.').map(x => parseInt(x, 10));
    const broadcastParts = broadcastAddr.split('.').map(x => parseInt(x, 10));
    
    // First host: network + 1
    const firstHost = [...networkParts];
    firstHost[3] += 1;
    if (firstHost[3] > 255) {
        firstHost[3] = 0;
        firstHost[2] += 1;
        if (firstHost[2] > 255) {
            firstHost[2] = 0;
            firstHost[1] += 1;
            if (firstHost[1] > 255) {
                firstHost[1] = 0;
                firstHost[0] += 1;
            }
        }
    }
    
    // Last host: broadcast - 1
    const lastHost = [...broadcastParts];
    lastHost[3] -= 1;
    if (lastHost[3] < 0) {
        lastHost[3] = 255;
        lastHost[2] -= 1;
        if (lastHost[2] < 0) {
            lastHost[2] = 255;
            lastHost[1] -= 1;
            if (lastHost[1] < 0) {
                lastHost[1] = 255;
                lastHost[0] -= 1;
            }
        }
    }
    
    return {
        first: firstHost.join('.'),
        last: lastHost.join('.')
    };
}

// Calculate number of hosts
function calculateHostCount(cidr) {
    const hostBits = 32 - cidr;
    return Math.pow(2, hostBits) - 2; // -2 for network and broadcast
}

// Main calculation function
function performSubnetCalculation(ip, cidr) {
    if (!isValidIP(ip)) {
        throw new Error('Səhv IP ünvanı formatı');
    }

    if (cidr < 0 || cidr > 32) {
        throw new Error('CIDR 0-32 arasında olmalıdır');
    }

    const subnetMask = cidrToSubnetMask(cidr);
    const networkAddress = calculateNetworkAddress(ip, subnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
    const hostRange = calculateHostRange(networkAddress, broadcastAddress);
    const hostCount = calculateHostCount(cidr);

    return {
        inputIP: ip,
        cidr: cidr,
        subnetMask: subnetMask,
        networkAddress: networkAddress,
        broadcastAddress: broadcastAddress,
        firstHost: hostRange.first,
        lastHost: hostRange.last,
        hostCount: hostCount,
        totalAddresses: Math.pow(2, 32 - cidr),
        // Binary representations
        binaryIP: ipToBinary(ip),
        binarySubnetMask: ipToBinary(subnetMask),
        binaryNetworkAddress: ipToBinary(networkAddress),
        binaryBroadcastAddress: ipToBinary(broadcastAddress)
    };
}

// Parse input function
function parseInput(input) {
    input = input.trim();
    
    // CIDR notation (192.168.1.0/24)
    if (input.includes('/')) {
        const [ip, cidr] = input.split('/');
        return { ip: ip.trim(), cidr: parseInt(cidr.trim(), 10) };
    }
    
    // Decimal notation (192.168.1.0 255.255.255.0)
    const parts = input.split(/\s+/);
    if (parts.length === 2) {
        const ip = parts[0];
        const mask = parts[1];
        if (isValidIP(ip) && isValidIP(mask)) {
            const cidr = subnetMaskToCidr(mask);
            return { ip, cidr };
        }
    }
    
    throw new Error('Səhv format. CIDR (192.168.1.0/24) və ya decimal (192.168.1.0 255.255.255.0) formatında daxil edin');
}

// Set example function
function setExample(example) {
    document.getElementById('ipInput').value = example;
    calculateSubnet();
}

// Main calculate function
async function calculateSubnet() {
    const input = document.getElementById('ipInput').value.trim();
    
    if (!input) {
        showError('Zəhmət olmasa IP ünvanı və subnet mask daxil edin');
        return;
    }

    showLoading();
    
    try {
        const { ip, cidr } = parseInput(input);
        const result = performSubnetCalculation(ip, cidr);
        displayResults(result);
    } catch (error) {
        showError(error.message);
    }
}

// Calculate from separate inputs
async function calculateFromSeparate() {
    const ip = document.getElementById('separateIP').value.trim();
    const cidr = parseInt(document.getElementById('subnetMask').value, 10);
    
    if (!ip) {
        showError('Zəhmət olmasa IP ünvanı daxil edin');
        return;
    }

    showLoading();
    
    try {
        const result = performSubnetCalculation(ip, cidr);
        displayResults(result);
    } catch (error) {
        showError(error.message);
    }
}

// Show loading
function showLoading() {
    document.getElementById('results').innerHTML = '<div class="loading">Hesablanır...</div>';
}

// Show error
function showError(message) {
    document.getElementById('results').innerHTML = `<div class="error-message">${message}</div>`;
}

// Display results
function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="result-grid">
            <div class="result-card">
                <div class="result-title">🌐 Şəbəkə Ünvanı</div>
                <div class="result-value">${result.networkAddress}</div>
            </div>
            <div class="result-card">
                <div class="result-title">📡 Broadcast Ünvanı</div>
                <div class="result-value">${result.broadcastAddress}</div>
            </div>
            <div class="result-card">
                <div class="result-title">🏠 İlk Host</div>
                <div class="result-value">${result.firstHost}</div>
            </div>
            <div class="result-card">
                <div class="result-title">🏠 Son Host</div>
                <div class="result-value">${result.lastHost}</div>
            </div>
            <div class="result-card">
                <div class="result-title">👥 Host Sayı</div>
                <div class="result-value">${result.hostCount.toLocaleString()}</div>
            </div>
            <div class="result-card">
                <div class="result-title">📊 Ümumi Ünvan</div>
                <div class="result-value">${result.totalAddresses.toLocaleString()}</div>
            </div>
        </div>

        <div class="subnet-details">
            <h3>🔧 Ətraflı Məlumatlar</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Daxil edilən IP</div>
                    <div class="detail-value">${result.inputIP}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">CIDR Notasiyası</div>
                    <div class="detail-value">/${result.cidr}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Subnet Mask</div>
                    <div class="detail-value">${result.subnetMask}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Şəbəkə Sinfi</div>
                    <div class="detail-value">${getNetworkClass(result.inputIP)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Şəbəkə Növü</div>
                    <div class="detail-value">${getNetworkType(result.inputIP)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Host Bitləri</div>
                    <div class="detail-value">${32 - result.cidr} bit</div>
                </div>
            </div>
        </div>

        <div class="binary-display">
            <div class="binary-title">💾 Binary Reprezentasiya</div>
            <div class="binary-value">
                <strong>IP Ünvanı:</strong><br>
                ${result.binaryIP}<br><br>
                <strong>Subnet Mask:</strong><br>
                ${result.binarySubnetMask}<br><br>
                <strong>Şəbəkə Ünvanı:</strong><br>
                ${result.binaryNetworkAddress}<br><br>
                <strong>Broadcast Ünvanı:</strong><br>
                ${result.binaryBroadcastAddress}
            </div>
        </div>
    `;
}

// Get network class
function getNetworkClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0], 10);
    if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Reserved)';
    return 'Unknown';
}

// Get network type
function getNetworkType(ip) {
    const parts = ip.split('.').map(x => parseInt(x, 10));
    const firstOctet = parts[0];
    const secondOctet = parts[1];

    // Private IP ranges
    if (firstOctet === 10) return 'Private (RFC 1918)';
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'Private (RFC 1918)';
    if (firstOctet === 192 && secondOctet === 168) return 'Private (RFC 1918)';
    
    // Loopback
    if (firstOctet === 127) return 'Loopback';
    
    // APIPA
    if (firstOctet === 169 && secondOctet === 254) return 'APIPA (Link-local)';
    
    return 'Public';
}

// Enter key support
document.getElementById('ipInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateSubnet();
    }
});

document.getElementById('separateIP').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateFromSeparate();
    }
});