package fit.iuh.com.service;

import fit.iuh.com.model.NotificationRecipient;
import fit.iuh.com.repository.NotificationRecipientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationRecipientService {
    private final NotificationRecipientRepository notificationRecipientRepository;

    public NotificationRecipientService(NotificationRecipientRepository notificationRecipientRepository) {
        this.notificationRecipientRepository = notificationRecipientRepository;
    }

    public List<NotificationRecipient> getAll() {
        return notificationRecipientRepository.findAll();
    }

    public NotificationRecipient getById(UUID id) {
        return notificationRecipientRepository.findById(id).orElse(null);
    }

    public NotificationRecipient createOne(NotificationRecipient notificationRecipient) {
        return notificationRecipientRepository.save(notificationRecipient);
    }

    public NotificationRecipient updateOne(NotificationRecipient notificationRecipient, UUID id) {
        if (notificationRecipientRepository.findById(id).isPresent()) {
            return notificationRecipientRepository.save(notificationRecipient);
        }
        return null;
    }

    public NotificationRecipient deleteOne(UUID id) {
        NotificationRecipient notificationRecipient = notificationRecipientRepository.findById(id).orElse(null);
        if (notificationRecipient != null) {
            notificationRecipientRepository.delete(notificationRecipient);
        }
        return notificationRecipient;
    }
}
