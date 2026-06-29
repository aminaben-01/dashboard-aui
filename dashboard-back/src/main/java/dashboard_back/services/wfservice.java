package dashboard_back.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dashboard_back.entities.wf;
import dashboard_back.repositories.wfRepository;

@Service
public class WfService {
    @Autowired
    private wfRepository wfRepository;

    public List<wf> getwf() {
        return wfRepository.findAll();
    }
}
