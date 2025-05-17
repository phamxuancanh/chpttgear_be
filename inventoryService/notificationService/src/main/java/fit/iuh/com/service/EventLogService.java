package fit.iuh.com.service;

import fit.iuh.com.model.EventLog;
import fit.iuh.com.model.NotificationRecipient;
import fit.iuh.com.repository.EventLogRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EventLogService {
    private final EventLogRepository eventLogRepository;

    public EventLogService(EventLogRepository eventLogRepository) {
        this.eventLogRepository = eventLogRepository;
    }

    public List<EventLog> getAll() {
        return eventLogRepository.findAll();
    }

    public EventLog getById(UUID id) {
        return eventLogRepository.findById(id).orElse(null);
    }

    public EventLog createOne(EventLog eventLog) {
        return eventLogRepository.save(eventLog);
    }

    public EventLog updateOne(EventLog eventLog, UUID id) {
        if (eventLogRepository.findById(id).isPresent()) {
            return eventLogRepository.save(eventLog);
        }
        return null;
    }

    public EventLog deleteOne(UUID id) {
        EventLog eventLog = eventLogRepository.findById(id).orElse(null);
        if (eventLog != null) {
            eventLogRepository.delete(eventLog);
        }
        return eventLog;
    }
}
