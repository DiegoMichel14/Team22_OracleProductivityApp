package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.TareaDeveloper;
import com.springboot.MyTodoList.model.TareaDeveloperId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface TareaDeveloperRepository extends JpaRepository<TareaDeveloper, TareaDeveloperId> {
    List<TareaDeveloper> findByDeveloper_IdDeveloper(Integer developerId);
}