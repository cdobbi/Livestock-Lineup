import { validateAndSendNotification } from "./validateAndSendNotification.js";
import { checkForNotifications } from "./checkForNotifications.js";

// Periodically check for notifications (every 30 seconds).
setInterval(checkForNotifications, 30000);

// Export functions for use in other files
export { validateAndSendNotification, checkForNotifications };