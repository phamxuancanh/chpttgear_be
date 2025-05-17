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

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/notifications")
    public List<Notification> getAllNotifications() {
        return notificationService.getAll();
    }

    @GetMapping("/notifications/{id}")
    public Notification getNotificationById(@PathVariable UUID id) {
        return notificationService.getById(id);
    }

    @PostMapping("/notifications")
    public Notification createOneNotification(@RequestBody Notification notification) {
        return notificationService.createOne(notification);
    }

    @PostMapping("/notifications/{id}")
    public Notification updateOneNotification(@RequestBody Notification notification, @PathVariable UUID id) {
        return notificationService.updateOne(notification, id);
    }

    @DeleteMapping("/notifications/{id}")
    public Notification deleteOneNotification(@PathVariable UUID id) {
        return notificationService.deleteOne(id);
    }
}
