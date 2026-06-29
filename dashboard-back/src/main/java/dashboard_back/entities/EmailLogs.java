package dashboard_back.entities;

import java.time.LocalTime;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmailLogs {
    @Id
    private Long id;
    private Integer sis_student_id;
    private String sis_course_id;
    private String seniority;
    private Date date_recorded;
    private Integer absence_count;
    private Integer absent_limit;
    private Integer sis_teacher_id;
    private Integer warning_level;
    private LocalTime sent_at;
}
