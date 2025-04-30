// मुख्य एप्लिकेशन लॉजिक
document.addEventListener('DOMContentLoaded', () => {
    // टूल्स डेटा
    const tools = {
        pdfTo: [
            { id: 'pdf-to-word', name: 'PDF to Word', icon: 'far fa-file-word' },
            { id: 'pdf-to-excel', name: 'PDF to Excel', icon: 'far fa-file-excel' }
        ],
        toPdf: [
            { id: 'word-to-pdf', name: 'Word to PDF', icon: 'far fa-file-word' }
        ]
    };

    // टूल्स रेंडर करें
    function renderTools() {
        const toolsSection = document.getElementById('tools');
        
        // प्रत्येक टूल कैटेगरी के लिए HTML जेनरेट करें
        for (const [category, toolList] of Object.entries(tools)) {
            const sectionHTML = `
                <h2 class="section-title">${category.replace('-', ' ')}</h2>
                <div class="main-tools" id="${category}Tools"></div>
            `;
            toolsSection.insertAdjacentHTML('beforeend', sectionHTML);
            
            // टूल कार्ड्स जोड़ें
            const container = document.getElementById(`${category}Tools`);
            toolList.forEach(tool => {
                const toolHTML = `
                    <div class="tool-card" data-tool-id="${tool.id}">
                        <div class="tool-icon"><i class="${tool.icon}"></i></div>
                        <div class="tool-name">${tool.name}</div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', toolHTML);
            });
        }
    }

    // इनिशियलाइज़ेशन
    function init() {
        renderTools();
        setupEventListeners();
    }

    init();
});