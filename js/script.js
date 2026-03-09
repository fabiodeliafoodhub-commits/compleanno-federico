document.addEventListener('DOMContentLoaded', () => {
    // 1. Falling food animation
    const foodItems = ['🍕', '🍩', '🍔', '🍟', '🧁', '🍦', '🍪'];
    const container = document.getElementById('falling-food-container');

    function createFood() {
        const item = document.createElement('div');
        item.classList.add('falling-item');
        item.innerText = foodItems[Math.floor(Math.random() * foodItems.length)];

        // Randomize position, size and duration
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
        const duration = Math.random() * 5 + 5; // 5s to 10s
        const rotation = Math.random() * 360;

        item.style.left = `${startX}px`;
        item.style.fontSize = `${size}rem`;
        item.style.animationDuration = `${duration}s`;

        container.appendChild(item);

        // Remove item after animation
        setTimeout(() => {
            item.remove();
        }, duration * 1000);
    }

    // Create new food items periodically
    setInterval(createFood, 1000); // 1s

    // Initial burst
    for (let i = 0; i < 8; i++) {
        setTimeout(createFood, Math.random() * 2000);
    }

    // 2. Form submission handler
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    const rsvpCard = document.getElementById('rsvp-card');

    // Enable button initially
    submitBtn.disabled = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect data
        const formData = new FormData(form);
        const data = {
            family_name: formData.get('family_name'),
            adults: parseInt(formData.get('adults')),
            children: parseInt(formData.get('children')),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = 'Invio in corso...';
        errorMsg.classList.add('hidden');

        try {
            // Webhook n8n url
            const webhookUrl = 'https://n8n.srv1036443.hstgr.cloud/webhook/8a4e62e0-491d-4957-ab5c-ed3e6927203e';

            await fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString()
            });

            form.classList.add('hidden');
            // Adjust card padding for success message
            rsvpCard.style.border = '3px dashed var(--primary-green)';
            rsvpCard.querySelector('p').classList.add('hidden');
            rsvpCard.querySelector('h2').classList.add('hidden');

            successMsg.classList.remove('hidden');

        } catch (error) {
            console.error('Errore invio RSVP:', error);
            errorMsg.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Conferma Presenza';
        }
    });
});
