package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface EstadoRepository extends JpaRepository<Estado, Integer> {
    // Ya puedes usar findById(Integer id) directamente
    Optional<Estado> findById(Integer id);
}