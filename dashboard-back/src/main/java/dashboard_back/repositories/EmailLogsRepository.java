package dashboard_back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dashboard_back.entities.EmailLogs;


public interface EmailLogsRepository extends JpaRepository<EmailLogs, Long> {

}
