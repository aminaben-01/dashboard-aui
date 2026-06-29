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
public class wf{
    @Id
    private Long teacher_id;
    private Integer teacher_name ;
    private String student_id;
    private Date request_date;
    private Integer course;
    private Integer count;
    private Integer wf ; 
    private String course_Cde;
    private Integer absent_Limit;
    private Date approve_Dat;
    private Integer excused;
} 