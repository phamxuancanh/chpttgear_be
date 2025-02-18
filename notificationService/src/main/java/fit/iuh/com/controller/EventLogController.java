package fit.iuh.com.controller;

import fit.iuh.com.model.EventLog;
import fit.iuh.com.service.EventLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class EventLogController {
    private final EventLogService eventLogService;

    public EventLogController(EventLogService eventLogService) {
        this.eventLogService = eventLogService;
    }

    @GetMapping("/event_logs")
    public List<EventLog> getAllEventLogs() {
        return eventLogService.getAll();
    }

    @GetMapping("/event_logs/{id}")
    public EventLog getEventLogById(@PathVariable UUID id) {
        return eventLogService.getById(id);
    }

    @PostMapping("/event_logs")
    public EventLog createOneEventLog(@RequestBody EventLog eventLog) {
        return eventLogService.createOne(eventLog);
    }

    @PostMapping("/event_logs/{id}")
    public EventLog updateOneEventLog(@RequestBody EventLog eventLog, @PathVariable UUID id) {
        return eventLogService.updateOne(eventLog, id);
    }

    @DeleteMapping("/event_logs/{id}")
    public EventLog deleteOneEventLog(@PathVariable UUID id) {
        return eventLogService.deleteOne(id);
    }

}
