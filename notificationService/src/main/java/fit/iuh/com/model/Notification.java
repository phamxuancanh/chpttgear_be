package fit.iuh.com.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    @Column(name = "notification_id")
    private UUID id;
    private String type;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String status;
    private Timestamp createdAt;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_log_id", columnDefinition = "UUID")
    @JsonIgnoreProperties("notifications")
    private EventLog eventLog;
    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL)
    private List<NotificationRecipient> recipients;

    public Notification() {
    }

    public Notification(UUID id, String type, String content, String status, Timestamp createdAt, EventLog eventLog, List<NotificationRecipient> recipients) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.status = status;
        this.createdAt = createdAt;
        this.eventLog = eventLog;
        this.recipients = recipients;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public EventLog getEventLog() {
        return eventLog;
    }

    public void setEventLog(EventLog eventLog) {
        this.eventLog = eventLog;
    }

    public List<NotificationRecipient> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<NotificationRecipient> recipients) {
        this.recipients = recipients;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", content='" + content + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", eventLog=" + eventLog +
                ", recipients=" + recipients +
                '}';
    }
}
