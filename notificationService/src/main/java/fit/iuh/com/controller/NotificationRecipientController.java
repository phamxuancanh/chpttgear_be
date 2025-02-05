package fit.iuh.com.controller;

import fit.iuh.com.model.NotificationRecipient;
import fit.iuh.com.service.NotificationRecipientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class NotificationRecipientController {
    private final NotificationRecipientService notificationRecipientService;

    public NotificationRecipientController(NotificationRecipientService notificationRecipientService) {
        this.notificationRecipientService = notificationRecipientService;
    }

    @GetMapping("/notification_recipients")
    public List<NotificationRecipient> getAllNotificationRecipients() {
        return notificationRecipientService.getAll();
    }

    @GetMapping("/notification_recipients/{id}")
    public NotificationRecipient getNotificationRecipientById(@PathVariable UUID id) {
        return notificationRecipientService.getById(id);
    }

    @PostMapping("/notification_recipients")
    public NotificationRecipient createOneNotificationRecipient(@RequestBody NotificationRecipient notificationRecipient) {
        return notificationRecipientService.createOne(notificationRecipient);
    }

    @PostMapping("/notification_recipients/{id}")
    public NotificationRecipient updateOneNotificationRecipient(@RequestBody NotificationRecipient notificationRecipient, @PathVariable UUID id) {
        return notificationRecipientService.updateOne(notificationRecipient, id);
    }

    @DeleteMapping("/notification_recipients/{id}")
    public NotificationRecipient deleteOneNotificationRecipient(@PathVariable UUID id) {
        return notificationRecipientService.deleteOne(id);
    }

}
