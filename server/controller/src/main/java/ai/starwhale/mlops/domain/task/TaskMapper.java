package ai.starwhale.mlops.domain.task;

import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface TaskMapper {

    List<TaskEntity> listTasks(@Param("jobId")Long jobId);

    TaskEntity findTaskById(@Param("taskId") Long taskId);

    int addTask(TaskEntity taskEntity);

    int addAll(@Param("taskList")List<TaskEntity> taskList);

    void updateTaskStatus(@Param("ids") List<Long> taskIds,@Param("taskStatus") int taskStatus);

    List<TaskEntity> findTaskByStatus(@Param("taskStatus") int taskStatus);

    List<TaskEntity> findTaskByStatusIn(@Param("taskStatusList") List<Integer> taskStatusList);
}
