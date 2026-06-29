package dashboard_back.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dashboard_back.entities.EmailLogs;
import dashboard_back.services.EmailLogsService;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173/")
public class EmailLogsController {
    @Autowired
    private EmailLogsService emailLogsService;

    @GetMapping("/email-logs")
    private ResponseEntity<List<EmailLogs>> getEmailLogs() {
        return new ResponseEntity<>(emailLogsService.getEmailLogs(), HttpStatus.OK);
    }
}
