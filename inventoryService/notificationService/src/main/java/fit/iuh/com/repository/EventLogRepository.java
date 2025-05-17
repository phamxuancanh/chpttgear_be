package fit.iuh.com.repository;

import fit.iuh.com.model.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventLogRepository extends JpaRepository<EventLog, UUID> {
}
