const service = new URLSearchParams(location.search).get('service');
const textarea = document.querySelector('textarea[name="message"]');
if (service && textarea && !textarea.value) textarea.value = `I'm interested in: ${service}\n\n`;
