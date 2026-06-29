package dashboard_back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import dashboard_back.entities.wf;


public interface wfRepository extends JpaRepository<wf, Long> {

}
