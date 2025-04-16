import { validateAndSendNotification } from "https://livestock-lineup.onrender.com/js/validateAndSendNotification.js";
import { checkForNotifications } from "https://livestock-lineup.onrender.com/js/checkForNotifications.js";

// Periodically check for notifications (every 30 seconds).
setInterval(checkForNotifications, 30000);

// Export functions for use in other files
export { validateAndSendNotification, checkForNotifications };