// यूटिलिटी फंक्शन्स
const Utilities = {
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    },

    setupEventListeners: () => {
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', function() {
                const toolId = this.dataset.toolId;
                loadToolContent(toolId);
            });
        });
    },

    loadToolContent: (toolId) => {
        // टूल कंटेंट लोड करने का लॉजिक
        console.log(`Loading tool: ${toolId}`);
    }
};