package fit.iuh.com.controller;

import fit.iuh.com.model.EventLog;
import fit.iuh.com.model.Notification;
import fit.iuh.com.model.NotificationRecipient;
import fit.iuh.com.service.EventLogService;
import fit.iuh.com.service.NotificationRecipientService;
import fit.iuh.com.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class NotificationController {
    private final NotificationService notificationService;
    private final EventLogService eventLogService;
    private final NotificationRecipientService notificationRecipientService;

    public NotificationController(NotificationService notificationService, EventLogService eventLogService, NotificationRecipientService notificationRecipientService) {
        this.notificationService = notificationService;
        this.eventLogService = eventLogService;
        this.notificationRecipientService = notificationRecipientService;
    }

    /**
     * GET
     */
    // GET All
    @GetMapping("/notifications")
    public List<Notification> getAllNotifications() {
        return notificationService.getAll();
    }

    @GetMapping("/notification_recipients")
    public List<NotificationRecipient> getAllNotificationRecipients() {
        return notificationRecipientService.getAll();
    }

    @GetMapping("/event_logs")
    public List<EventLog> getAllEventLogs() {
        return eventLogService.getAll();
    }

    // GET BY ID

    @GetMapping("/notifications/{id}")
    public Notification getNotificationById(@PathVariable UUID id) {
        return notificationService.getById(id);
    }

    @GetMapping("/notification_recipients/{id}")
    public NotificationRecipient getNotificationRecipientById(@PathVariable UUID id) {
        return notificationRecipientService.getById(id);
    }

    @GetMapping("/event_logs/{id}")
    public EventLog getEventLogById(@PathVariable UUID id) {
        return eventLogService.getById(id);
    }

    /**
     * POST
     */
    // CREATE

    @PostMapping("/notifications")
    public Notification createOneNotification(@RequestBody Notification notification) {
        return notificationService.createOne(notification);
    }

    @PostMapping("/notification_recipients")
    public NotificationRecipient createOneNotificationRecipient(@RequestBody NotificationRecipient notificationRecipient) {
        return notificationRecipientService.createOne(notificationRecipient);
    }

    @PostMapping("/event_logs")
    public EventLog createOneEventLog(@RequestBody EventLog eventLog) {
        return eventLogService.createOne(eventLog);
    }

    //UPDATE

    @PostMapping("/notifications/{id}")
    public Notification updateOneNotification(@RequestBody Notification notification, @PathVariable UUID id) {
        return notificationService.updateOne(notification, id);
    }

    @PostMapping("/notification_recipients/{id}")
    public NotificationRecipient updateOneNotificationRecipient(@RequestBody NotificationRecipient notificationRecipient, @PathVariable UUID id) {
        return notificationRecipientService.updateOne(notificationRecipient, id);
    }

    @PostMapping("/event_logs/{id}")
    public EventLog updateOneEventLog(@RequestBody EventLog eventLog, @PathVariable UUID id) {
        return eventLogService.updateOne(eventLog, id);
    }

    // DELETE
    @DeleteMapping("/notifications/{id}")
    public Notification deleteOneNotification(@PathVariable UUID id) {
        return notificationService.deleteOne(id);
    }

    @DeleteMapping("/notification_recipients/{id}")
    public NotificationRecipient deleteOneNotificationRecipient(@PathVariable UUID id) {
        return notificationRecipientService.deleteOne(id);
    }

    @DeleteMapping("/event_logs/{id}")
    public EventLog deleteOneEventLog(@PathVariable UUID id) {
        return eventLogService.deleteOne(id);
    }

}
