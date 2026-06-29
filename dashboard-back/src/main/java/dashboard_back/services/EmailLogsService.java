package dashboard_back.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dashboard_back.entities.EmailLogs;
import dashboard_back.repositories.EmailLogsRepository;

@Service
public class EmailLogsService {
    @Autowired
    private EmailLogsRepository emailLogsRepository;

    public List<EmailLogs> getEmailLogs() {
        return emailLogsRepository.findAll();
    }
}
