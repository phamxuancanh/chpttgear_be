package fit.iuh.com.service;

import fit.iuh.com.model.Notification;
import fit.iuh.com.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    public Notification getById(UUID id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public Notification createOne(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification updateOne(Notification notification, UUID id) {
        if (notificationRepository.findById(id).isPresent()) {
            return notificationRepository.save(notification);
        }
        return null;
    }

    public Notification deleteOne(UUID id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notificationRepository.delete(notification);
        }
        return notification;
    }
}
